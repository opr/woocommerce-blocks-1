(window.webpackWcBlocksJsonp=window.webpackWcBlocksJsonp||[]).push([[36],{230:function(e,t,c){"use strict";var n=c(11),o=c.n(n),a=c(0),s=c(4),l=c.n(s);c(8),c(231),t.a=e=>{let{children:t,className:c,headingLevel:n,...s}=e;const r=l()("wc-block-components-title",c),d="h"+n;return Object(a.createElement)(d,o()({className:r},s),t)}},231:function(e,t){},237:function(e,t){},266:function(e,t,c){"use strict";var n=c(0),o=c(4),a=c.n(o),s=c(230);c(237);const l=e=>{let{title:t,stepHeadingContent:c}=e;return Object(n.createElement)("div",{className:"wc-block-components-checkout-step__heading"},Object(n.createElement)(s.a,{"aria-hidden":"true",className:"wc-block-components-checkout-step__title",headingLevel:"2"},t),!!c&&Object(n.createElement)("span",{className:"wc-block-components-checkout-step__heading-content"},c))};t.a=e=>{let{id:t,className:c,title:o,legend:s,description:r,children:d,disabled:i=!1,showStepNumber:b=!0,stepHeadingContent:u=(()=>{})}=e;const p=s||o?"fieldset":"div";return Object(n.createElement)(p,{className:a()(c,"wc-block-components-checkout-step",{"wc-block-components-checkout-step--with-step-number":b,"wc-block-components-checkout-step--disabled":i}),id:t,disabled:i},!(!s&&!o)&&Object(n.createElement)("legend",{className:"screen-reader-text"},s||o),!!o&&Object(n.createElement)(l,{title:o,stepHeadingContent:u()}),Object(n.createElement)("div",{className:"wc-block-components-checkout-step__container"},!!r&&Object(n.createElement)("p",{className:"wc-block-components-checkout-step__description"},r),Object(n.createElement)("div",{className:"wc-block-components-checkout-step__content"},d)))}},353:function(e,t){},354:function(e,t){},397:function(e,t,c){"use strict";c.r(t);var n=c(0),o=c(4),a=c.n(o),s=c(1),l=c(266),r=c(42),d=c(32),i=c(15),b=c(8),u=c.n(b);c(354);var p=e=>{let{className:t="",disabled:c=!1,onTextChange:o,placeholder:s,value:l=""}=e;return Object(n.createElement)("textarea",{className:a()("wc-block-components-textarea",t),disabled:c,onChange:e=>{o(e.target.value)},placeholder:s,rows:2,value:l})};c(353),p.propTypes={onTextChange:u.a.func.isRequired,disabled:u.a.bool,placeholder:u.a.string,value:u.a.string};var m=e=>{let{disabled:t,onChange:c,placeholder:o,value:a}=e;const[l,r]=Object(n.useState)(!1),[d,b]=Object(n.useState)("");return Object(n.createElement)("div",{className:"wc-block-checkout__add-note"},Object(n.createElement)(i.CheckboxControl,{disabled:t,label:Object(s.__)("Add a note to your order","woo-gutenberg-products-block"),checked:l,onChange:e=>{r(e),e?a!==d&&c(d):(c(""),b(a))}}),l&&Object(n.createElement)(p,{disabled:t,onTextChange:c,placeholder:o,value:a}))};t.default=e=>{let{className:t}=e;const{needsShipping:c}=Object(r.b)(),{isProcessing:o,orderNotes:i,dispatchActions:b}=Object(d.b)(),{setOrderNotes:u}=b;return Object(n.createElement)(l.a,{id:"order-notes",showStepNumber:!1,className:a()("wc-block-checkout__order-notes",t),disabled:o},Object(n.createElement)(m,{disabled:o,onChange:u,placeholder:c?Object(s.__)("Notes about your order, e.g. special notes for delivery.","woo-gutenberg-products-block"):Object(s.__)("Notes about your order.","woo-gutenberg-products-block"),value:i}))}}}]);