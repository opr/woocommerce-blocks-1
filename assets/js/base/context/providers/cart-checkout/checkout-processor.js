/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import triggerFetch from '@wordpress/api-fetch';
import {
	useEffect,
	useRef,
	useCallback,
	useState,
	useMemo,
	useReducer,
} from '@wordpress/element';
import {
	emptyHiddenAddressFields,
	formatStoreApiErrorMessage,
} from '@woocommerce/base-utils';
import { useDispatch, useSelect } from '@wordpress/data';
import { usePrevious } from '@woocommerce/base-hooks';
import { CHECKOUT_STORE_KEY } from '@woocommerce/block-data';

/**
 * Internal dependencies
 */
import { preparePaymentData, processCheckoutResponseHeaders } from './utils';
import { useCheckoutContext } from './checkout-state';
import { useShippingDataContext } from './shipping';
import { useCustomerDataContext } from './customer';
import { usePaymentMethodDataContext } from './payment-methods';
import { useValidationContext } from '../validation';
import { useStoreCart } from '../../hooks/cart/use-store-cart';
import { useStoreNoticesContext } from '../store-notices';
import { reducer as emitReducer } from '../../../../data/checkout/events';
import { STATUS } from '../../../../data/checkout/constants';
import { useCheckoutNotices } from '../../hooks/use-checkout-notices';

/**
 * CheckoutProcessor component.
 *
 * Subscribes to checkout context and triggers processing via the API.
 */
const CheckoutProcessor = () => {
	const { onCheckoutValidationBeforeProcessing } = useCheckoutContext();

	const {
		hasError: checkoutHasError,
		redirectUrl,
		isProcessing: checkoutIsProcessing,
		isBeforeProcessing: checkoutIsBeforeProcessing,
		isComplete: checkoutIsComplete,
		orderNotes,
		shouldCreateAccount,
		extensionData,
	} = useSelect( ( select ) => {
		const store = select( CHECKOUT_STORE_KEY );
		return {
			...store.getCheckoutState(),
			isProcessing: store.isProcessing(),
			isBeforeProcessing: store.isBeforeProcessing(),
			isComplete: store.isComplete(),
		};
	} );

	const [ observers ] = useReducer( emitReducer, {} );
	const currentObservers = useRef( observers );

	const checkoutActions = useDispatch( CHECKOUT_STORE_KEY );
	const checkoutState = useSelect( ( select ) =>
		select( CHECKOUT_STORE_KEY ).getCheckoutState()
	);

	if ( redirectUrl && redirectUrl !== checkoutState.redirectUrl ) {
		checkoutActions.setRedirectUrl( redirectUrl );
	}

	const {
		checkoutNotices,
		paymentNotices,
		expressPaymentNotices,
	} = useCheckoutNotices();

	const { setCustomerId, setHasError, processCheckoutResponse } = useDispatch(
		CHECKOUT_STORE_KEY
	);

	const { hasValidationErrors, setValidationErrors } = useValidationContext();
	const { shippingErrorStatus } = useShippingDataContext();
	const { billingData, shippingAddress } = useCustomerDataContext();
	const { cartNeedsPayment, cartNeedsShipping, receiveCart } = useStoreCart();
	const {
		activePaymentMethod,
		isExpressPaymentMethodActive,
		currentStatus: currentPaymentStatus,
		paymentMethodData,
		expressPaymentMethods,
		paymentMethods,
		shouldSavePayment,
	} = usePaymentMethodDataContext();
	const { setIsSuppressed } = useStoreNoticesContext();
	const { createErrorNotice, removeNotice } = useDispatch( 'core/notices' );
	const currentBillingData = useRef( billingData );
	const currentShippingAddress = useRef( shippingAddress );
	const currentRedirectUrl = useRef( redirectUrl );
	const [ isProcessingOrder, setIsProcessingOrder ] = useState( false );

	const paymentMethodId = useMemo( () => {
		const merged = {
			...expressPaymentMethods,
			...paymentMethods,
		};
		return merged?.[ activePaymentMethod ]?.paymentMethodId;
	}, [ activePaymentMethod, expressPaymentMethods, paymentMethods ] );

	const checkoutWillHaveError =
		( hasValidationErrors && ! isExpressPaymentMethodActive ) ||
		currentPaymentStatus.hasError ||
		shippingErrorStatus.hasError;

	const paidAndWithoutErrors =
		! checkoutHasError &&
		! checkoutWillHaveError &&
		( currentPaymentStatus.isSuccessful || ! cartNeedsPayment ) &&
		checkoutIsProcessing;

	// If express payment method is active, let's suppress notices
	useEffect( () => {
		setIsSuppressed( isExpressPaymentMethodActive );
	}, [ isExpressPaymentMethodActive, setIsSuppressed ] );

	// Determine if checkout has an error.
	useEffect( () => {
		if (
			checkoutWillHaveError !== checkoutHasError &&
			( checkoutIsProcessing || checkoutIsBeforeProcessing ) &&
			! isExpressPaymentMethodActive
		) {
			setHasError( checkoutWillHaveError );
		}
	}, [
		checkoutWillHaveError,
		checkoutHasError,
		checkoutIsProcessing,
		checkoutIsBeforeProcessing,
		isExpressPaymentMethodActive,
		setHasError,
	] );

	// Keep shipping, billing and redirectUrl current
	useEffect( () => {
		currentBillingData.current = billingData;
		currentShippingAddress.current = shippingAddress;
		currentRedirectUrl.current = redirectUrl;
	}, [ billingData, shippingAddress, redirectUrl ] );

	const checkValidation = useCallback( () => {
		if ( hasValidationErrors ) {
			return false;
		}
		if ( currentPaymentStatus.hasError ) {
			return {
				errorMessage: __(
					'There was a problem with your payment option.',
					'woo-gutenberg-products-block'
				),
			};
		}
		if ( shippingErrorStatus.hasError ) {
			return {
				errorMessage: __(
					'There was a problem with your shipping option.',
					'woo-gutenberg-products-block'
				),
			};
		}

		return true;
	}, [
		hasValidationErrors,
		currentPaymentStatus.hasError,
		shippingErrorStatus.hasError,
	] );

	// Validate the checkout fields via the onCheckoutValidationBeforeProcessing callback
	useEffect( () => {
		let unsubscribeProcessing;
		if ( ! isExpressPaymentMethodActive ) {
			unsubscribeProcessing = onCheckoutValidationBeforeProcessing(
				checkValidation,
				0
			);
		}
		return () => {
			if ( ! isExpressPaymentMethodActive ) {
				unsubscribeProcessing();
			}
		};
	}, [
		onCheckoutValidationBeforeProcessing,
		checkValidation,
		isExpressPaymentMethodActive,
	] );

	// Redirect when checkout is complete and there is a redirect url.
	useEffect( () => {
		if ( currentRedirectUrl.current ) {
			console.log( "Complete! but Don't redirect" );
			// window.location.href = currentRedirectUrl.current;
		}
	}, [ checkoutIsComplete ] );

	const processOrder = useCallback( async () => {
		if ( isProcessingOrder ) {
			return;
		}
		setIsProcessingOrder( true );
		removeNotice( 'checkout' );

		const paymentData = cartNeedsPayment
			? {
					payment_method: paymentMethodId,
					payment_data: preparePaymentData(
						paymentMethodData,
						shouldSavePayment,
						activePaymentMethod
					),
			  }
			: {};

		const data = {
			billing_address: emptyHiddenAddressFields(
				currentBillingData.current
			),
			customer_note: orderNotes,
			create_account: shouldCreateAccount,
			...paymentData,
			extensions: { ...extensionData },
		};

		if ( cartNeedsShipping ) {
			data.shipping_address = emptyHiddenAddressFields(
				currentShippingAddress.current
			);
		}

		triggerFetch( {
			path: '/wc/store/v1/checkout',
			method: 'POST',
			data,
			cache: 'no-store',
			parse: false,
		} )
			.then( ( response ) => {
				processCheckoutResponseHeaders(
					response.headers,
					setCustomerId
				);
				if ( ! response.ok ) {
					throw new Error( response );
				}
				return response.json();
			} )
			.then( ( responseJson ) => {
				processCheckoutResponse( responseJson );
				setIsProcessingOrder( false );
			} )
			.catch( ( errorResponse ) => {
				try {
					if ( errorResponse?.headers ) {
						processCheckoutResponseHeaders(
							errorResponse.headers,
							setCustomerId
						);
					}
					// This attempts to parse a JSON error response where the status code was 4xx/5xx.
					errorResponse.json().then( ( response ) => {
						// If updated cart state was returned, update the store.
						if ( response.data?.cart ) {
							receiveCart( response.data.cart );
						}
						createErrorNotice(
							formatStoreApiErrorMessage( response ),
							{
								id: 'checkout',
								context: 'wc/checkout',
							}
						);
						response?.additional_errors?.forEach?.(
							( additionalError ) => {
								createErrorNotice( additionalError.message, {
									id: additionalError.error_code,
									context: 'wc/checkout',
								} );
							}
						);
						processCheckoutResponse( response );
					} );
				} catch {
					createErrorNotice(
						sprintf(
							// Translators: %s Error text.
							__(
								'%s Please try placing your order again.',
								'woo-gutenberg-products-block'
							),
							errorResponse?.message ??
								__(
									'Something went wrong.',
									'woo-gutenberg-products-block'
								)
						),
						{
							id: 'checkout',
							context: 'wc/checkout',
						}
					);
				}
				setHasError( true );
				setIsProcessingOrder( false );
			} );
	}, [
		isProcessingOrder,
		removeNotice,
		cartNeedsPayment,
		paymentMethodId,
		paymentMethodData,
		shouldSavePayment,
		activePaymentMethod,
		orderNotes,
		shouldCreateAccount,
		extensionData,
		cartNeedsShipping,
		createErrorNotice,
		receiveCart,
		setHasError,
		processCheckoutResponse,
		setCustomerId,
	] );

	// process order if conditions are good.
	useEffect( () => {
		if ( paidAndWithoutErrors && ! isProcessingOrder ) {
			processOrder();
		}
	}, [ processOrder, paidAndWithoutErrors, isProcessingOrder ] );

	// Set observers on ref so it's always current.
	useEffect( () => {
		currentObservers.current = observers;
	}, [ observers ] );

	// Emit CHECKOUT_VALIDATE event and set the error state based on the response of
	// the registered callbacks
	useEffect( () => {
		checkoutActions.emitValidateEvent( {
			observers: currentObservers.current,
			createErrorNotice,
			setValidationErrors,
		} );
	}, [
		checkoutState.status,
		setValidationErrors,
		createErrorNotice,
		checkoutActions,
	] );

	const previousStatus = usePrevious( checkoutState.status );
	const previousHasError = usePrevious( checkoutState.hasError );

	// Emit CHECKOUT_AFTER_PROCESSING_WITH_SUCCESS and CHECKOUT_AFTER_PROCESSING_WITH_ERROR events
	// and set checkout errors according to the callback responses
	useEffect( () => {
		if (
			checkoutState.status === previousStatus &&
			checkoutState.hasError === previousHasError
		) {
			return;
		}

		if ( checkoutState.status === STATUS.AFTER_PROCESSING ) {
			checkoutActions.emitAfterProcessingEvents( {
				observers: currentObservers.current,
				createErrorNotice,
				notices: {
					checkoutNotices,
					paymentNotices,
					expressPaymentNotices,
				},
			} );
		}
	}, [
		checkoutState.status,
		checkoutState.hasError,
		checkoutState.redirectUrl,
		checkoutState.orderId,
		checkoutState.customerId,
		checkoutState.orderNotes,
		checkoutState.processingResponse,
		previousStatus,
		previousHasError,
		createErrorNotice,
		checkoutNotices,
		expressPaymentNotices,
		paymentNotices,
		checkoutActions,
	] );

	return null;
};

export default CheckoutProcessor;
