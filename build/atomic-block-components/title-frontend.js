(window.webpackWcBlocksJsonp=window.webpackWcBlocksJsonp||[]).push([[18],{156:function(e,t,o){"use strict";var n=o(18),l=o.n(n),c=o(0),a=o(25),r=o(5),i=o.n(r);o(191),t.a=e=>{let{className:t="",disabled:o=!1,name:n,permalink:r="",rel:s,style:u,onClick:d,...p}=e;const m=i()("wc-block-components-product-name",t);if(o){const e=p;return Object(c.createElement)("span",l()({className:m},e,{dangerouslySetInnerHTML:{__html:Object(a.decodeEntities)(n)}}))}return Object(c.createElement)("a",l()({className:m,href:r,rel:s},p,{dangerouslySetInnerHTML:{__html:Object(a.decodeEntities)(n)},style:u}))}},191:function(e,t){},315:function(e,t,o){"use strict";o.d(t,"a",(function(){return l})),o(202);var n=o(84);const l=()=>n.m>1},317:function(e,t){},387:function(e,t,o){"use strict";o.r(t);var n=o(134),l=o(0),c=o(5),a=o.n(c),r=o(65),i=o(201),s=o(315),u=o(156),d=o(42);o(317);const p=e=>{let{children:t,headingLevel:o,elementType:n="h"+o,...c}=e;return Object(l.createElement)(n,c,t)};var m=Object(n.withProductDataContext)(e=>{var t,o,n,c;let{className:m,headingLevel:b=2,showProductLink:v=!0,align:f,textColor:j,fontSize:O,style:h}=e;const{parentClassName:y}=Object(r.useInnerBlockLayoutContext)(),{product:g}=Object(r.useProductDataContext)(),{dispatchStoreEvent:k}=Object(d.a)(),w=Object(i.getColorClassName)("color",j),S=Object(i.getFontSizeClass)(O),C=a()("wp-block-woocommerce-product-title",{"has-text-color":j||(null==h||null===(t=h.color)||void 0===t?void 0:t.text)||(null==h?void 0:h.color),"has-font-size":O||(null==h||null===(o=h.typography)||void 0===o?void 0:o.fontSize)||(null==h?void 0:h.fontSize),[w]:w,[S]:S}),z={fontSize:(null==h?void 0:h.fontSize)||(null==h||null===(n=h.typography)||void 0===n?void 0:n.fontSize),color:(null==h||null===(c=h.color)||void 0===c?void 0:c.text)||(null==h?void 0:h.color)};return g.id?Object(l.createElement)(p,{headingLevel:b,className:a()(m,"wc-block-components-product-title",{[y+"__product-title"]:y,["wc-block-components-product-title--align-"+f]:f&&Object(s.a)()})},Object(l.createElement)(u.a,{className:a()({[C]:Object(s.a)()}),disabled:!v,name:g.name,permalink:g.permalink,rel:v?"nofollow":"",onClick:()=>{k("product-view-link",{product:g})},style:Object(s.a)()?z:{}})):Object(l.createElement)(p,{headingLevel:b,className:a()(m,"wc-block-components-product-title",{[y+"__product-title"]:y,["wc-block-components-product-title--align-"+f]:f&&Object(s.a)(),[C]:Object(s.a)()})})});let b={headingLevel:{type:"number",default:2},showProductLink:{type:"boolean",default:!0},productId:{type:"number",default:0}};Object(s.a)()&&(b={...b,align:{type:"string"},color:{type:"string"},customColor:{type:"string"},fontSize:{type:"string"},customFontSize:{type:"number"}});var v=b;t.default=Object(n.withFilteredAttributes)(v)(m)}}]);