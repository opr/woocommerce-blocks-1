/**
 * External dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	useShippingData,
	useSelectShippingRate,
} from '@woocommerce/base-context/hooks';
import { getCurrencyFromPriceResponse } from '@woocommerce/price-format';
import FormattedMonetaryAmount from '@woocommerce/base-components/formatted-monetary-amount';
import { decodeEntities } from '@wordpress/html-entities';
import { getSetting } from '@woocommerce/settings';
import { Icon, mapMarker } from '@wordpress/icons';
import RadioControl from '@woocommerce/base-components/radio-control';
import type { RadioControlOption } from '@woocommerce/base-components/radio-control/types';
import { CartShippingPackageShippingRate } from '@woocommerce/types';

/**
 * Internal dependencies
 */
import './style.scss';

const getPickupLocation = (
	option: CartShippingPackageShippingRate
): string => {
	if ( option?.meta_data ) {
		const match = option.meta_data.find(
			( meta: MetaKeyValue ) => meta.key === 'pickup_location'
		);
		return match ? match.value : '';
	}
	return '';
};

const getPickupAddress = (
	option: CartShippingPackageShippingRate
): string => {
	if ( option?.meta_data ) {
		const match = option.meta_data.find(
			( meta: MetaKeyValue ) => meta.key === 'pickup_address'
		);
		return match ? match.value : '';
	}
	return '';
};

const renderPickupLocation = (
	option: CartShippingPackageShippingRate
): RadioControlOption => {
	const priceWithTaxes = getSetting( 'displayCartPricesIncludingTax', false )
		? option.price + option.taxes
		: option.price;
	const location = getPickupLocation( option );
	const address = getPickupAddress( option );
	return {
		value: option.rate_id,
		label: location
			? decodeEntities( location )
			: decodeEntities( option.name ),
		secondaryLabel: (
			<FormattedMonetaryAmount
				currency={ getCurrencyFromPriceResponse( option ) }
				value={ priceWithTaxes }
			/>
		),
		description: decodeEntities( option.description ),
		secondaryDescription: address ? (
			<>
				<Icon
					icon={ mapMarker }
					className="wc-block-editor-components-block-icon"
				/>
				{ decodeEntities( address ) }
			</>
		) : undefined,
	};
};

const Block = (): JSX.Element | null => {
	const { shippingRates } = useShippingData();
	const { selectShippingRate } = useSelectShippingRate();
	const [ selectedOption, setSelectedOption ] = useState< string >( '' );
	const onSelectRate = useCallback(
		( rateId: string ) => {
			shippingRates.forEach( ( { package_id: packageId } ) => {
				selectShippingRate( rateId, packageId );
			} );
		},
		[ selectShippingRate, shippingRates ]
	);

	// Get pickup locations from the first shipping package.
	const pickupLocations = ( shippingRates[ 0 ]?.shipping_rates || [] )
		.filter( ( { method_id: methodId } ) => methodId === 'pickup_location' )
		// Combine prices by rate ID.
		.map( ( pickupLocation ) => {
			// Find the cost and taxes from the shipping rates response.
			const pickupRate = shippingRates.reduce(
				( acc, shippingRatePackage ) => {
					const rate =
						shippingRatePackage.shipping_rates.find(
							( { rate_id: rateId } ) =>
								rateId === pickupLocation.rate_id
						) || null;
					if ( rate ) {
						acc.price = acc.price + parseInt( rate.price, 10 );
						acc.taxes = acc.taxes + parseInt( rate.taxes, 10 );
					}
					return acc;
				},
				{ price: 0, taxes: 0 }
			);
			return {
				...pickupLocation,
				...pickupRate,
			};
		} );

	// Update the selected option if there is no rate selected on mount.
	useEffect( () => {
		if ( ! selectedOption && pickupLocations[ 0 ] ) {
			setSelectedOption( pickupLocations[ 0 ].rate_id );
			onSelectRate( pickupLocations[ 0 ].rate_id );
		}
	}, [ onSelectRate, pickupLocations, selectedOption ] );

	return (
		<RadioControl
			onChange={ ( value: string ) => {
				setSelectedOption( value );
				onSelectRate( value );
			} }
			selected={ selectedOption }
			options={ pickupLocations.map( renderPickupLocation ) }
		/>
	);
};

export default Block;
