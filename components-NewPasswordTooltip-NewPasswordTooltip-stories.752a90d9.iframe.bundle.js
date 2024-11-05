/*! For license information please see components-NewPasswordTooltip-NewPasswordTooltip-stories.752a90d9.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_weka_weka_ui_components=self.webpackChunk_weka_weka_ui_components||[]).push([[661],{"./lib/components/NewPasswordTooltip/NewPasswordTooltip.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _NewPasswordTooltip__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./lib/components/NewPasswordTooltip/NewPasswordTooltip.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/react/jsx-runtime.js"));function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}const __WEBPACK_DEFAULT_EXPORT__={component:_NewPasswordTooltip__WEBPACK_IMPORTED_MODULE_0__.A,title:"Components/NewPasswordTooltip"};var Default={args:{passValue:""},render:function render(args){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_NewPasswordTooltip__WEBPACK_IMPORTED_MODULE_0__.A,function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({},args))}};const __namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    passValue: ''\n  },\n  render: (args: object) => <NewPasswordTooltipComponent {...args} />\n}",...Default.parameters?.docs?.source}}}},"./lib/components/NewPasswordTooltip/NewPasswordTooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>NewPasswordTooltip_NewPasswordTooltip});__webpack_require__("./node_modules/react/index.js");var dist=__webpack_require__("./node_modules/check-password-strength/dist/index.mjs"),consts=__webpack_require__("./lib/consts.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),newPasswordTooltip=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/NewPasswordTooltip/newPasswordTooltip.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(newPasswordTooltip.A,options);newPasswordTooltip.A&&newPasswordTooltip.A.locals&&newPasswordTooltip.A.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function NewPasswordTooltip(_ref){var _ref$passValue=_ref.passValue,passValue=void 0===_ref$passValue?consts.u1:_ref$passValue,passStrength=(0,dist.Bi)(passValue);return(0,jsx_runtime.jsxs)("div",{className:"password-min-demand",children:[(0,jsx_runtime.jsx)("span",{className:"demand-headline",children:"Password must contain:"}),(0,jsx_runtime.jsx)("span",{className:passStrength.length>=8?"valid":consts.u1,children:"● At least 8 characters"}),(0,jsx_runtime.jsx)("span",{className:passStrength.contains.includes("uppercase")?"valid":consts.u1,children:"● Uppercase letter"}),(0,jsx_runtime.jsx)("span",{className:passStrength.contains.includes("lowercase")?"valid":consts.u1,children:"● Lowercase letter"}),(0,jsx_runtime.jsx)("span",{className:passStrength.contains.includes("number")||passStrength.contains.includes("symbol")?"valid":consts.u1,children:"● Number or special character"})]})}const NewPasswordTooltip_NewPasswordTooltip=NewPasswordTooltip;try{NewPasswordTooltip.displayName="NewPasswordTooltip",NewPasswordTooltip.__docgenInfo={description:"",displayName:"NewPasswordTooltip",props:{passValue:{defaultValue:{value:""},description:"",name:"passValue",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["lib/components/NewPasswordTooltip/NewPasswordTooltip.tsx#NewPasswordTooltip"]={docgenInfo:NewPasswordTooltip.__docgenInfo,name:"NewPasswordTooltip",path:"lib/components/NewPasswordTooltip/NewPasswordTooltip.tsx#NewPasswordTooltip"})}catch(__react_docgen_typescript_loader_error){}},"./lib/consts.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Br:()=>SAVED_RESIZED,By:()=>FILTER_CHANGE_LISTENER,Cg:()=>SAVED_RESIZING_ENABLED,ID:()=>TIME_PARTS,K4:()=>FILTERBOXES,KR:()=>MONTHS,L8:()=>SHORT_ROLES,TM:()=>DRIVES_STATUSES,Wb:()=>OBS_MODES,XQ:()=>STATUS,Yn:()=>OBS_IS_DETACHING,Zn:()=>TAG_SEPARATOR,Zs:()=>ZERO_STRING,_W:()=>TIME_PARTS_SHORTENINGS,a1:()=>GENERAL_ERROR,cP:()=>DEFAULT_DEBOUNCE_DELAY,ch:()=>EVENT_KEYS,i8:()=>FILTER_LISTENER,jJ:()=>EXPLICITLY_REMOVED_FILTERS,jX:()=>NODES_STATUSES,kW:()=>NOP,kv:()=>DIALOG_STATUSES,m2:()=>SAVED_FILTERS,oC:()=>SEVERITIES,oc:()=>ORIGIN_OPTIONS,p6:()=>SHORT_DAY_OF_WEEK,qg:()=>COLUMN_RESIZING_LISTENER,u1:()=>EMPTY_STRING,uo:()=>TOASTER_DIALOG,xS:()=>SAVED_HIDDEN,xv:()=>TIME_FORMATS,zU:()=>SEVERITIES_ICONS});var _svgs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./lib/svgs/index.ts"),EMPTY_STRING="",ZERO_STRING="0",NOP=function NOP(){},TAG_SEPARATOR=",",EVENT_KEYS={ENTER:"Enter",BACKSPACE:"Backspace",TAB:"Tab",ARROW_RIGHT:"ArrowRight",ARROW_LEFT:"ArrowLeft",DOT:"."},SAVED_FILTERS="saved_filters",EXPLICITLY_REMOVED_FILTERS="explicitly_removed_filters",SAVED_HIDDEN="saved_hidden",SAVED_RESIZED="saved_resized_columns",SAVED_RESIZING_ENABLED="saved_resizing_enabled",FILTER_CHANGE_LISTENER="table-filters-change",FILTER_LISTENER="table-filters",COLUMN_RESIZING_LISTENER="column-resizing",GENERAL_ERROR="Something went wrong. Please refresh the page and try again.",FILTERBOXES={MINSEVERITY:"Min Severity",SEVERITY:"Min Severity",ACCESSPOINT:"Access Point",FSNAME:"Filesystem",FS:"Filesystem",MOUNTOPTIONS:"Mount Mode",AUTH_METHOD:"Auth Method",LAST_ERRORS:"Last Errors",INNERPATH:"Inner Path",SHARENAME:"Share Name",EXPIRY_DAYS:"Expiration Days",POSIXUID:"Posix UID",POSIXGID:"Posix GID",S3POLICY:"S3 Policy",SUPPORTEDVERSIONS:"Supported Versions",NID:"Process ID",NODEID:"Process ID",RELATED_NODE_IDS:"Related Processes","INFO.CURLERRORSTR":"Curl Errors","INFO.KEY":"Identifier","INFO.CONCURRENCYATSTART":"Concurrency Level",CHANTYPE:"Operation Type",OPPHASE:"Phase"},NODES_STATUSES={DOWN:"DOWN",FENCING:"FENCING",UP:"UP",JOINING:"JOINING",SYNCING:"SYNCING"},DRIVES_STATUSES={INACTIVE:"INACTIVE",PHASING_IN:"PHASING_IN",ACTIVE:"ACTIVE",PHASING_OUT:"PHASING_OUT"},STATUS={OK:"OK",UP:"UP",DEGRADED:"DEGRADED",DOWN:"DOWN",READY:"READY",DEACTIVATING:"DEACTIVATING",ACTIVE:"ACTIVE",ENABLED:"ENABLED",UPDATING:"UPDATING",CREATING:"CREATING",DOWNLOADING:"DOWNLOADING",REMOVING:"REMOVING",ADDING:"ADDING"},OBS_IS_DETACHING="DETACHING",OBS_MODES={REMOTE:"REMOTE",WRITABLE:"WRITABLE",READ_ONLY:"READ_ONLY"},TIME_PARTS_SHORTENINGS={years:"y",months:"mon",weeks:"w",days:"d",hours:"h",minutes:"min",seconds:"sec"},SHORT_DAY_OF_WEEK="Mon Tue Wed Thu Fri Sat Sun".split(" "),MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"],TIME_PARTS={HOUR:"hour",MINUTE:"minute",SECOND:"second"},TIME_FORMATS={DATE:"yyyy-MM-dd",DATE_TIME:"yyyy-MM-dd HH:mm",DATE_TIME_SECONDS:"yyyy-MM-dd HH:mm:ss",DATE_TIME_SECONDS_MS:"yyyy-MM-dd HH:mm:ss.SSS"},SEVERITIES=["DEBUG","INFO","WARNING","MINOR","MAJOR","CRITICAL"],SEVERITIES_ICONS={INFO:_svgs__WEBPACK_IMPORTED_MODULE_0__.vY,WARNING:_svgs__WEBPACK_IMPORTED_MODULE_0__.N5,DEBUG:_svgs__WEBPACK_IMPORTED_MODULE_0__.Mr,MINOR:_svgs__WEBPACK_IMPORTED_MODULE_0__.J6,MAJOR:_svgs__WEBPACK_IMPORTED_MODULE_0__.lC,CRITICAL:_svgs__WEBPACK_IMPORTED_MODULE_0__.N8},SHORT_ROLES={FRONTEND:"FE",DRIVES:"SSD",MANAGEMENT:"MGMT"},ORIGIN_OPTIONS={USER:"USER",WEKA:"WEKA"},DIALOG_STATUSES={SUCCESS:"success",ERROR:"error"},TOASTER_DIALOG="toasterDialog",DEFAULT_DEBOUNCE_DELAY=700},"./node_modules/check-password-strength/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Bi:()=>passwordStrength_1});var src={exports:{}};const defaultOptions=[{id:0,value:"Too weak",minDiversity:0,minLength:0},{id:1,value:"Weak",minDiversity:2,minLength:6},{id:2,value:"Medium",minDiversity:4,minLength:8},{id:3,value:"Strong",minDiversity:4,minLength:10}],passwordStrength=(password,options=defaultOptions,allowedSymbols="!\"#$%&'()*+,-./:;<=>?@[\\\\\\]^_`{|}~")=>{let passwordCopy=password||"";options[0].minDiversity=0,options[0].minLength=0;const rules=[{regex:"[a-z]",message:"lowercase"},{regex:"[A-Z]",message:"uppercase"},{regex:"[0-9]",message:"number"}];allowedSymbols&&rules.push({regex:`[${allowedSymbols}]`,message:"symbol"});let strength={};strength.contains=rules.filter((rule=>new RegExp(`${rule.regex}`).test(passwordCopy))).map((rule=>rule.message)),strength.length=passwordCopy.length;let fulfilledOptions=options.filter((option=>strength.contains.length>=option.minDiversity)).filter((option=>strength.length>=option.minLength)).sort(((o1,o2)=>o2.id-o1.id)).map((option=>({id:option.id,value:option.value})));return Object.assign(strength,fulfilledOptions[0]),strength};src.exports={passwordStrength,defaultOptions};var passwordStrength_1=src.exports.passwordStrength=passwordStrength;src.exports.defaultOptions=defaultOptions,src.exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/NewPasswordTooltip/newPasswordTooltip.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".password-min-demand{font-size:12px;display:flex;flex-direction:column;margin:0}.password-min-demand .demand-headline{font-size:16px;margin-bottom:4px}.password-min-demand .valid{color:var(--complement-key)}","",{version:3,sources:["webpack://./lib/components/NewPasswordTooltip/newPasswordTooltip.scss"],names:[],mappings:"AAAE,qBAME,cAAA,CACA,YAAA,CACA,qBAAA,CACA,QAAA,CARA,sCACE,cAAA,CACA,iBAAA,CAQF,4BACE,2BAAA",sourcesContent:["  .password-min-demand {\n    .demand-headline {\n      font-size: 16px;\n      margin-bottom: 4px;\n    }\n\n    font-size: 12px;\n    display: flex;\n    flex-direction: column;\n    margin: 0;\n\n    .valid {\n      color: var(--complement-key);\n    }\n  }\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);