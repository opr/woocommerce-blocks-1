# wc/store/checkout

## Table of Contents

-   [Structure](#structure)
-   [Selectors](#selectors)
    -   [getCartData](#getcartdata)
    -   [getCustomerData](#getcustomerdata)

## Structure

The `wc/store/cart` data store has the following keys:


| Key                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default Value     |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `cartItemsPendingQuantity`       | A list of cart item keys for items whose quantity is being updated. While a request (and the client-side processing involved with it) to update the quantity of an item is in progress, its item ID will be in this list.                                                                                                                                                                                                                     | Empty array: `[]` |
| `cartItemsPendingDelete`         | A list of cart item keys for items that are being deleted. While a request (and the client-side processing involved with it) to delete an item is in progress, its item ID will be in this list.                                                                                                                                                                                                                                              | Empty array: `[]` |
| `cartData`                       | The current client-side representation of the WooCommerce cart.                                                                                                                                                                                                                                                                                                                                                                               | `object`          |
| `cartData.coupons`               | A list of coupons that are currently applied to the cart.                                                                                                                                                                                                                                                                                                                                                                                     | Empty array: `[]` |
| `cartData.shippingRates`         | A list of shipping rates that are currently available on the cart. There will be one entry in this array for each package contained in the cart.                                                                                                                                                                                                                                                                                              | `object`          |
| `cartData.shippingAddress`       | The shipping address of the customer.                                                                                                                                                                                                                                                                                                                                                                                                         | `object`          |
| `cartData.billingAddress`        | The billing address of the customer. This also contains an `email` field.                                                                                                                                                                                                                                                                                                                                                                     | `object`          |
| `cartData.items`                 | The items in the cart.                                                                                                                                                                                                                                                                                                                                                                                                                        | Empty array: `[]` |
| `cartData.itemsCount`            | The total number of items, it is the sum of each item's quantity.                                                                                                                                                                                                                                                                                                                                                                             | `0`               |
| `cartData.itemsWeight`           | The total weight of all items, it is the sum of each item's quantity multiplied by its weight.                                                                                                                                                                                                                                                                                                                                                | `0`               |
| `cartData.crossSells`            | The cross-sells for this specific cart configuration. This is a list of products.                                                                                                                                                                                                                                                                                                                                                             | Empty array: `[]` |
| `cartData.needsShipping`         | True if the cart has physical items that need to be shipped.                                                                                                                                                                                                                                                                                                                                                                                  | `true`            |
| `cartData.needsPayment`          | True if the cart total price is not 0.                                                                                                                                                                                                                                                                                                                                                                                                        | `false`           |
| `cartData.hasCalculatedShipping` | True if the cart shipping price has been calculated and is accurate in the `totals` key.                                                                                                                                                                                                                                                                                                                                                      | `true`            |
| `cartData.fees`                  | A list of additional charges applied to the cart.                                                                                                                                                                                                                                                                                                                                                                                             | Empty array: `[]` |
| `cartData.totals`                | An object containing price information for the cart. It contains the following keys: `total_items`, `total_items_tax`, `total_fees`, `total_fees_tax`, `total_discount`, `total_discount_tax`, `total_shipping`, `total_shipping_tax`, `total_price`, `total_tax`, `tax_lines`, `currency_code`, `currency_symbol`, `currency_minor_unit`, `currency_decimal_separator`, `currency_thousand_separator`, `currency_prefix`, `currency_suffix`. | `object`          |
| `cartData.errors`                | A list of errors on the cart. Any errors in this key will be displayed in a notice above the Cart and Checkout blocks. An error object should contain a `code` and `message` key.                                                                                                                                                                                                                                                             | Empty array: `[]` |
| `cartData.paymentRequirements`   | A list of strings to signal which capabilities a payment method must have to be able to process this cart. For example, if `subscriptions` is present in this list, any payment method that has not declared support for `subscriptions` will not be available.                                                                                                                                                                               | Empty array: `[]` |
| `cartData.extensions`            | An object containing data that extensions can set. Extensions may set data here by [extending the Store API](../rest-api/extend-rest-api-add-data.md#basic-usage)                                                                                                                                                                                                                                                                             | `object`          |
| `metaData`                       | An object containing metadata relating to the cart and its processes.                                                                                                                                                                                                                                                                                                                                                                         | `object`          |
| `metaData.updatingCustomerData`  | True if there is an in-flight request (and during the subsequent processing) to update the customer's billing or shipping addresses.                                                                                                                                                                                                                                                                                                          | `false`           |
| `metaData.updatingSelectedRate`  | True if there is an in-flight request (and during the subsequent processing) to update the selected shipping rate.                                                                                                                                                                                                                                                                                                                            | `false`           |
| `metaData.applyingCoupon`        | If the                                                                                                                                                                                                                                                                                                                                                                                                                                        | `false`           |







## Selectors

### getCartData

Returns the current `cartData` part of the data store. This includes all cart data.

#### Example

```js
import { useSelect } from '@wordpress/data';
import { getCartData } from '@woocommerce/blocks-checkout';

const ShowAllCartData = () => {
    const cartData = useSelect( ( select ) => {
        return select( 'wc/store/cart' ).getCartData();
    } );

    return (
        <div>
            <p>Cart data:</p>
            <pre>{ JSON.stringify( cartData, null, 2 ) }</pre>
        </div>
    );
};
```

## getCustomerData

Returns the current `cartData.billingAddress` and `cartData.shippingAddress`
