(window.webpackWcBlocksJsonp=window.webpackWcBlocksJsonp||[]).push([[40],{132:function(e,t,n){"use strict";var c=n(0),a=n(1),s=n(4),o=n.n(s),i=(n(167),n(133));t.a=e=>{let{children:t,className:n,screenReaderLabel:s,showSpinner:l=!1,isLoading:r=!0}=e;return Object(c.createElement)("div",{className:o()(n,{"wc-block-components-loading-mask":r})},r&&l&&Object(c.createElement)(i.a,null),Object(c.createElement)("div",{className:o()({"wc-block-components-loading-mask__children":r}),"aria-hidden":r},t),r&&Object(c.createElement)("span",{className:"screen-reader-text"},s||Object(a.__)("Loading…","woo-gutenberg-products-block")))}},133:function(e,t,n){"use strict";var c=n(0);n(163),t.a=()=>Object(c.createElement)("span",{className:"wc-block-components-spinner","aria-hidden":"true"})},163:function(e,t){},165:function(e,t){},167:function(e,t){},226:function(e,t,n){"use strict";var c=n(0),a=n(4),s=n.n(a),o=n(228);t.a=e=>{let{checked:t,name:n,onChange:a,option:i}=e;const{value:l,label:r,description:p,secondaryLabel:d,secondaryDescription:b}=i;return Object(c.createElement)("label",{className:s()("wc-block-components-radio-control__option",{"wc-block-components-radio-control__option-checked":t}),htmlFor:`${n}-${l}`},Object(c.createElement)("input",{id:`${n}-${l}`,className:"wc-block-components-radio-control__input",type:"radio",name:n,value:l,onChange:e=>a(e.target.value),checked:t,"aria-describedby":s()({[`${n}-${l}__label`]:r,[`${n}-${l}__secondary-label`]:d,[`${n}-${l}__description`]:p,[`${n}-${l}__secondary-description`]:b})}),Object(c.createElement)(o.a,{id:`${n}-${l}`,label:r,secondaryLabel:d,description:p,secondaryDescription:b}))}},228:function(e,t,n){"use strict";var c=n(0);t.a=e=>{let{label:t,secondaryLabel:n,description:a,secondaryDescription:s,id:o}=e;return Object(c.createElement)("div",{className:"wc-block-components-radio-control__option-layout"},Object(c.createElement)("div",{className:"wc-block-components-radio-control__label-group"},t&&Object(c.createElement)("span",{id:o&&o+"__label",className:"wc-block-components-radio-control__label"},t),n&&Object(c.createElement)("span",{id:o&&o+"__secondary-label",className:"wc-block-components-radio-control__secondary-label"},n)),Object(c.createElement)("div",{className:"wc-block-components-radio-control__description-group"},a&&Object(c.createElement)("span",{id:o&&o+"__description",className:"wc-block-components-radio-control__description"},a),s&&Object(c.createElement)("span",{id:o&&o+"__secondary-description",className:"wc-block-components-radio-control__secondary-description"},s)))}},23:function(e,t,n){"use strict";var c=n(0),a=n(4),s=n.n(a);t.a=e=>{let t,{label:n,screenReaderLabel:a,wrapperElement:o,wrapperProps:i={}}=e;const l=null!=n,r=null!=a;return!l&&r?(t=o||"span",i={...i,className:s()(i.className,"screen-reader-text")},Object(c.createElement)(t,i,a)):(t=o||c.Fragment,l&&r&&n!==a?Object(c.createElement)(t,i,Object(c.createElement)("span",{"aria-hidden":"true"},n),Object(c.createElement)("span",{className:"screen-reader-text"},a)):Object(c.createElement)(t,i,n))}},230:function(e,t,n){"use strict";var c=n(11),a=n.n(c),s=n(0),o=n(4),i=n.n(o);n(8),n(231),t.a=e=>{let{children:t,className:n,headingLevel:c,...o}=e;const l=i()("wc-block-components-title",n),r="h"+c;return Object(s.createElement)(r,a()({className:l},o),t)}},231:function(e,t){},237:function(e,t){},238:function(e,t,n){"use strict";var c=n(1);t.a=e=>{let{defaultTitle:t=Object(c.__)("Step","woo-gutenberg-products-block"),defaultDescription:n=Object(c.__)("Step description text.","woo-gutenberg-products-block"),defaultShowStepNumber:a=!0}=e;return{title:{type:"string",default:t},description:{type:"string",default:n},showStepNumber:{type:"boolean",default:a}}}},241:function(e,t,n){"use strict";var c=n(0),a=n(4),s=n.n(a),o=n(12),i=n(226);n(242);const l=e=>{let{className:t="",id:n,selected:a,onChange:r=(()=>{}),options:p=[]}=e;const d=Object(o.useInstanceId)(l),b=n||d;return p.length?Object(c.createElement)("div",{className:s()("wc-block-components-radio-control",t)},p.map(e=>Object(c.createElement)(i.a,{key:`${b}-${e.value}`,name:"radio-control-"+b,checked:e.value===a,option:e,onChange:t=>{r(t),"function"==typeof e.onChange&&e.onChange(t)}}))):null};t.a=l},242:function(e,t){},259:function(e,t){},266:function(e,t,n){"use strict";var c=n(0),a=n(4),s=n.n(a),o=n(230);n(237);const i=e=>{let{title:t,stepHeadingContent:n}=e;return Object(c.createElement)("div",{className:"wc-block-components-checkout-step__heading"},Object(c.createElement)(o.a,{"aria-hidden":"true",className:"wc-block-components-checkout-step__title",headingLevel:"2"},t),!!n&&Object(c.createElement)("span",{className:"wc-block-components-checkout-step__heading-content"},n))};t.a=e=>{let{id:t,className:n,title:a,legend:o,description:l,children:r,disabled:p=!1,showStepNumber:d=!0,stepHeadingContent:b=(()=>{})}=e;const u=o||a?"fieldset":"div";return Object(c.createElement)(u,{className:s()(n,"wc-block-components-checkout-step",{"wc-block-components-checkout-step--with-step-number":d,"wc-block-components-checkout-step--disabled":p}),id:t,disabled:p},!(!o&&!a)&&Object(c.createElement)("legend",{className:"screen-reader-text"},o||a),!!a&&Object(c.createElement)(i,{title:a,stepHeadingContent:b()}),Object(c.createElement)("div",{className:"wc-block-components-checkout-step__container"},!!l&&Object(c.createElement)("p",{className:"wc-block-components-checkout-step__description"},l),Object(c.createElement)("div",{className:"wc-block-components-checkout-step__content"},r)))}},267:function(e,t,n){"use strict";var c=n(0),a=n(1),s=n(25),o=n(132),i=n(15),l=n(304),r=n(24),p=n(20),d=n(4),b=n.n(d),u=n(21),m=n(23),g=n(110),O=n(241),h=n(228),j=n(40),_=n(97),k=n(2);const f=e=>{const t=Object(k.getSetting)("displayCartPricesIncludingTax",!1)?parseInt(e.price,10)+parseInt(e.taxes,10):parseInt(e.price,10);return{label:Object(u.decodeEntities)(e.name),value:e.rate_id,description:Object(c.createElement)(c.Fragment,null,Number.isFinite(t)&&Object(c.createElement)(_.a,{currency:Object(j.getCurrencyFromPriceResponse)(e),value:t}),Number.isFinite(t)&&e.delivery_time?" — ":null,Object(u.decodeEntities)(e.delivery_time))}};var w=e=>{let{className:t="",noResultsMessage:n,onSelectRate:a,rates:s,renderOption:o=f,selectedRate:i}=e;const l=(null==i?void 0:i.rate_id)||"",[r,p]=Object(c.useState)(l);if(Object(c.useEffect)(()=>{l&&p(l)},[l]),0===s.length)return n;if(s.length>1)return Object(c.createElement)(O.a,{className:t,onChange:e=>{p(e),a(e)},selected:r,options:s.map(o)});const{label:d,secondaryLabel:b,description:u,secondaryDescription:m}=o(s[0]);return Object(c.createElement)(h.a,{label:d,secondaryLabel:b,description:u,secondaryDescription:m})};n(259);var E=e=>{let{packageId:t,className:n="",noResultsMessage:s,renderOption:o,packageData:l,collapsible:r=!1,collapse:p=!1,showItems:d=!1}=e;const{selectShippingRate:O}=Object(g.a)(),h=Object(c.createElement)(c.Fragment,null,(d||r)&&Object(c.createElement)("div",{className:"wc-block-components-shipping-rates-control__package-title"},l.name),d&&Object(c.createElement)("ul",{className:"wc-block-components-shipping-rates-control__package-items"},Object.values(l.items).map(e=>{const t=Object(u.decodeEntities)(e.name),n=e.quantity;return Object(c.createElement)("li",{key:e.key,className:"wc-block-components-shipping-rates-control__package-item"},Object(c.createElement)(m.a,{label:n>1?`${t} × ${n}`:""+t,screenReaderLabel:Object(a.sprintf)(
/* translators: %1$s name of the product (ie: Sunglasses), %2$d number of units in the current cart package */
Object(a._n)("%1$s (%2$d unit)","%1$s (%2$d units)",n,"woo-gutenberg-products-block"),t,n)}))}))),j=Object(c.createElement)(w,{className:n,noResultsMessage:s,rates:l.shipping_rates,onSelectRate:e=>O(e,t),selectedRate:l.shipping_rates.find(e=>e.selected),renderOption:o});return r?Object(c.createElement)(i.Panel,{className:"wc-block-components-shipping-rates-control__package",initialOpen:!p,title:h},j):Object(c.createElement)("div",{className:b()("wc-block-components-shipping-rates-control__package",n)},h,j)};const v=e=>{let{packages:t,collapse:n,showItems:a,collapsible:s,noResultsMessage:o,renderOption:i}=e;return t.length?Object(c.createElement)(c.Fragment,null,t.map(e=>{let{package_id:t,...l}=e;return Object(c.createElement)(E,{key:t,packageId:t,packageData:l,collapsible:s,collapse:n,showItems:a,noResultsMessage:o,renderOption:i})})):null};t.a=e=>{let{shippingRates:t,shippingRatesLoading:n,className:d,collapsible:b=!1,noResultsMessage:u,renderOption:m}=e;Object(c.useEffect)(()=>{if(n)return;const e=Object(l.a)(t),c=Object(l.b)(t);1===e?Object(s.speak)(Object(a.sprintf)(
/* translators: %d number of shipping options found. */
Object(a._n)("%d shipping option was found.","%d shipping options were found.",c,"woo-gutenberg-products-block"),c)):Object(s.speak)(Object(a.sprintf)(
/* translators: %d number of shipping packages packages. */
Object(a._n)("Shipping option searched for %d package.","Shipping options searched for %d packages.",e,"woo-gutenberg-products-block"),e)+" "+Object(a.sprintf)(
/* translators: %d number of shipping options available. */
Object(a._n)("%d shipping option was found","%d shipping options were found",c,"woo-gutenberg-products-block"),c))},[n,t]);const{extensions:g,receiveCart:O,...h}=Object(r.a)(),j={className:d,collapsible:b,noResultsMessage:u,renderOption:m,extensions:g,cart:h,components:{ShippingRatesControlPackage:E}},{isEditor:_}=Object(p.a)();return Object(c.createElement)(o.a,{isLoading:n,screenReaderLabel:Object(a.__)("Loading shipping rates…","woo-gutenberg-products-block"),showSpinner:!0},_?Object(c.createElement)(v,{packages:t,noResultsMessage:u,renderOption:m}):Object(c.createElement)(c.Fragment,null,Object(c.createElement)(i.ExperimentalOrderShippingPackages.Slot,j),Object(c.createElement)(i.ExperimentalOrderShippingPackages,null,Object(c.createElement)(v,{packages:t,noResultsMessage:u,renderOption:m}))))}},299:function(e,t,n){"use strict";var c=n(7),a=n(0),s=n(4),o=n.n(s),i=n(12),l=n(46);t.a=function({icon:e,children:t,label:n,instructions:s,className:r,notices:p,preview:d,isColumnLayout:b,...u}){const[m,{width:g}]=Object(i.useResizeObserver)();let O;"number"==typeof g&&(O={"is-large":g>=480,"is-medium":g>=160&&g<480,"is-small":g<160});const h=o()("components-placeholder",r,O),j=o()("components-placeholder__fieldset",{"is-column-layout":b});return Object(a.createElement)("div",Object(c.a)({},u,{className:h}),m,p,d&&Object(a.createElement)("div",{className:"components-placeholder__preview"},d),Object(a.createElement)("div",{className:"components-placeholder__label"},Object(a.createElement)(l.a,{icon:e}),n),!!s&&Object(a.createElement)("div",{className:"components-placeholder__instructions"},s),Object(a.createElement)("div",{className:j},t))}},304:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return a}));const c=e=>e.length,a=e=>e.reduce((function(e,t){return e+t.shipping_rates.length}),0)},306:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var c=n(2),a=n(0),s=n(42),o=n(35);const i=()=>{const{needsShipping:e}=Object(s.b)(),{billingData:t,setBillingData:n,shippingAddress:i,setShippingAddress:l,shippingAsBilling:r,setShippingAsBilling:p}=Object(o.b)(),d=Object(a.useRef)(r),b=Object(a.useRef)(),u=Object(a.useCallback)(e=>{l(e),r&&n(e)},[r,l,n]),m=Object(a.useCallback)(t=>{n(t),e||l(t)},[e,l,n]);Object(a.useEffect)(()=>{if(d.current!==r){if(r)b.current=t,n(i);else{const{email:e,...c}=b.current||t;n({...c})}d.current=r}},[r,n,i,t]);const g=Object(a.useCallback)(e=>{n({email:e})},[n]),O=Object(a.useCallback)(e=>{n({phone:e})},[n]),h=Object(a.useCallback)(e=>{u({phone:e})},[u]);return{defaultAddressFields:c.defaultAddressFields,shippingFields:i,setShippingFields:u,billingFields:t,setBillingFields:m,setEmail:g,setPhone:O,setShippingPhone:h,shippingAsBilling:r,setShippingAsBilling:p,showShippingFields:e,showBillingFields:!e||!d.current}}},350:function(e,t){},351:function(e,t){},392:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n(4),s=n.n(a),o=n(113),i=n(266),l=n(32),r=n(306),p=n(1),d=n(267),b=n(304),u=n(40),m=n(97),g=n(20),O=n(42),h=n(21),j=n(119),_=n(2),k=n(299),f=n(56),w=n(100),E=n(13),v=Object(c.createElement)(E.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(c.createElement)(E.Path,{d:"M3 6.75C3 5.784 3.784 5 4.75 5H15V7.313l.05.027 5.056 2.73.394.212v3.468a1.75 1.75 0 01-1.75 1.75h-.012a2.5 2.5 0 11-4.975 0H9.737a2.5 2.5 0 11-4.975 0H3V6.75zM13.5 14V6.5H4.75a.25.25 0 00-.25.25V14h.965a2.493 2.493 0 011.785-.75c.7 0 1.332.287 1.785.75H13.5zm4.535 0h.715a.25.25 0 00.25-.25v-2.573l-4-2.16v4.568a2.487 2.487 0 011.25-.335c.7 0 1.332.287 1.785.75zM6.282 15.5a1.002 1.002 0 00.968 1.25 1 1 0 10-.968-1.25zm9 0a1 1 0 101.937.498 1 1 0 00-1.938-.498z"}));n(351);var N=()=>Object(c.createElement)(k.a,{icon:Object(c.createElement)(w.a,{icon:v}),label:Object(p.__)("Shipping options","woo-gutenberg-products-block"),className:"wc-block-checkout__no-shipping-placeholder"},Object(c.createElement)("span",{className:"wc-block-checkout__no-shipping-placeholder-description"},Object(p.__)("Your store does not have any Shipping Options configured. Once you have added your Shipping Options they will appear here.","woo-gutenberg-products-block")),Object(c.createElement)(f.a,{isSecondary:!0,href:_.ADMIN_URL+"admin.php?page=wc-settings&tab=shipping",target:"_blank",rel:"noopener noreferrer"},Object(p.__)("Configure Shipping Options","woo-gutenberg-products-block")));n(350);const y=e=>{const t=Object(_.getSetting)("displayCartPricesIncludingTax",!1)?parseInt(e.price,10)+parseInt(e.taxes,10):parseInt(e.price,10);return{label:Object(h.decodeEntities)(e.name),value:e.rate_id,description:Object(h.decodeEntities)(e.description),secondaryLabel:Object(c.createElement)(m.a,{currency:Object(u.getCurrencyFromPriceResponse)(e),value:t}),secondaryDescription:Object(h.decodeEntities)(e.delivery_time)}};var S=()=>{const{isEditor:e}=Object(g.a)(),{shippingRates:t,shippingRatesLoading:n,needsShipping:a,hasCalculatedShipping:o}=Object(O.b)();if(!a)return null;const i=Object(b.a)(t);return e||o||i?Object(c.createElement)(c.Fragment,null,e&&!i?Object(c.createElement)(N,null):Object(c.createElement)(d.a,{noResultsMessage:Object(c.createElement)(j.a,{isDismissible:!1,className:s()("wc-block-components-shipping-rates-control__no-results-notice","woocommerce-error")},Object(p.__)("There are no shipping options available. Please check your shipping address.","woo-gutenberg-products-block")),renderOption:y,shippingRates:t,shippingRatesLoading:n})):Object(c.createElement)("p",null,Object(p.__)("Shipping options will be displayed here after entering your full shipping address.","woo-gutenberg-products-block"))},R=n(238),C={...Object(R.a)({defaultTitle:Object(p.__)("Shipping options","woo-gutenberg-products-block"),defaultDescription:""}),allowCreateAccount:{type:"boolean",default:!1},className:{type:"string",default:""},lock:{type:"object",default:{move:!0,remove:!0}}};t.default=Object(o.withFilteredAttributes)(C)(e=>{let{title:t,description:n,showStepNumber:a,children:o,className:p}=e;const{isProcessing:d}=Object(l.b)(),{showShippingFields:b}=Object(r.a)();return b?Object(c.createElement)(i.a,{id:"shipping-option",disabled:d,className:s()("wc-block-checkout__shipping-option",p),title:t,description:n,showStepNumber:a},Object(c.createElement)(S,null),o):null})},97:function(e,t,n){"use strict";var c=n(11),a=n.n(c),s=n(0),o=n(135),i=n(4),l=n.n(i);n(165);const r=e=>({thousandSeparator:e.thousandSeparator,decimalSeparator:e.decimalSeparator,decimalScale:e.minorUnit,fixedDecimalScale:!0,prefix:e.prefix,suffix:e.suffix,isNumericString:!0});t.a=e=>{let{className:t,value:n,currency:c,onValueChange:i,displayType:p="text",...d}=e;const b="string"==typeof n?parseInt(n,10):n;if(!Number.isFinite(b))return null;const u=b/10**c.minorUnit;if(!Number.isFinite(u))return null;const m=l()("wc-block-formatted-money-amount","wc-block-components-formatted-money-amount",t),g={...d,...r(c),value:void 0,currency:void 0,onValueChange:void 0},O=i?e=>{const t=+e.value*10**c.minorUnit;i(t)}:()=>{};return Object(s.createElement)(o.a,a()({className:m,displayType:p},g,{value:u,onValueChange:O}))}}}]);