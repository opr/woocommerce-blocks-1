<?php
namespace Automattic\WooCommerce\Blocks\Shipping;

use Automattic\WooCommerce\Utilities\ArrayUtil;

/**
 * ShippingController class.
 *
 * @internal
 */
class ShippingController {
	/**
	 * Initialization method.
	 */
	public function init() {
		add_action( 'woocommerce_load_shipping_methods', array( $this, 'register_local_pickup' ) );
		add_filter( 'woocommerce_local_pickup_methods', array( $this, 'register_local_pickup_method' ) );
		add_filter( 'woocommerce_customer_taxable_address', array( $this, 'filter_taxable_address' ) );
		add_filter( 'woocommerce_shipping_packages', array( $this, 'filter_shipping_packages' ) );
	}

	/**
	 * Registers the Local Pickup shipping method used by the Checkout Block.
	 */
	public function register_local_pickup() {
		wc()->shipping->register_shipping_method( new PickupLocation() );
	}

	/**
	 * Declares the Pickup Location shipping method as a Local Pickup method for WooCommerce.
	 *
	 * @param array $methods Shipping method ids.
	 * @return array
	 */
	public function register_local_pickup_method( $methods ) {
		$methods[] = 'pickup_location';
		return $methods;
	}

	/**
	 * Filter the location used for taxes based on the chosen pickup location.
	 *
	 * @param array $address Location args.
	 * @return array
	 */
	public function filter_taxable_address( $address ) {
		// We only need to select from the first package, since pickup_location only supports a single package.
		$chosen_method          = current( WC()->session->get( 'chosen_shipping_methods', array() ) ) ?? '';
		$chosen_method_id       = explode( ':', $chosen_method )[0];
		$chosen_method_instance = explode( ':', $chosen_method )[1] ?? 0;

		if ( $chosen_method_id && true === apply_filters( 'woocommerce_apply_base_tax_for_local_pickup', true ) && 'pickup_location' === $chosen_method_id ) {
			$pickup_locations = get_option( 'pickup_location_pickup_locations', [] );
			$pickup_location  = $pickup_locations[ $chosen_method_instance ] ?? [];

			if ( isset( $pickup_location['address'], $pickup_location['address']['country'] ) && ! empty( $pickup_location['address']['country'] ) ) {
				$address = array(
					$pickup_locations[ $chosen_method_instance ]['address']['country'],
					$pickup_locations[ $chosen_method_instance ]['address']['state'],
					$pickup_locations[ $chosen_method_instance ]['address']['postcode'],
					$pickup_locations[ $chosen_method_instance ]['address']['city'],
				);
			}
		}

		return $address;
	}

	/**
	 * For Local Pickup to work during Block Checkout, all packages must support local pickup. This is because the entire
	 * order must be picked up (so correct taxes are applied to the full order).
	 *
	 * If a shipping package does not support local pickup (e.g. if disabled by an extension), this filters the option
	 * out for all packages. This will in turn disable the "pickup" toggle in Block Checkout.
	 *
	 * @param array $packages Array of shipping packages.
	 * @return array
	 */
	public function filter_shipping_packages( $packages ) {
		// Check all packages for an instance of the pickup_location shipping method.
		$valid_packages = array_filter(
			$packages,
			function( $package ) {
				$shipping_method_ids = ArrayUtil::select( $package['rates'] ?? [], 'get_method_id', ArrayUtil::SELECT_BY_OBJECT_METHOD );
				return in_array( 'pickup_location', $shipping_method_ids, true );
			}
		);

		// Remove pickup location from rates arrays.
		if ( count( $valid_packages ) !== count( $packages ) ) {
			$packages = array_map(
				function( $package ) {
					$package['rates'] = array_filter(
						$package['rates'],
						function( $rate ) {
							return 'pickup_location' !== $rate->get_method_id();
						}
					);
					return $package;
				},
				$packages
			);
		}

		return $packages;
	}
}
