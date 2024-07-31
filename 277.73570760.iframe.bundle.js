"use strict";(self.webpackChunk_weka_weka_ui_components=self.webpackChunk_weka_weka_ui_components||[]).push([[277],{"./lib/components/Tooltip/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>components_Tooltip_Tooltip});__webpack_require__("./node_modules/react/index.js");var Tooltip=__webpack_require__("./node_modules/@mui/material/Tooltip/Tooltip.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),consts=__webpack_require__("./lib/consts.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),tooltip=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/Tooltip/tooltip.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(tooltip.A,options);tooltip.A&&tooltip.A.locals&&tooltip.A.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}var _excluded=["children","clear","data","extraClass","extraPopperClass"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function Tooltip_Tooltip(_ref){var children=_ref.children,_ref$clear=_ref.clear,clear=void 0!==_ref$clear&&_ref$clear,_ref$data=_ref.data,data=void 0===_ref$data?consts.u1:_ref$data,_ref$extraClass=_ref.extraClass,extraClass=void 0===_ref$extraClass?consts.u1:_ref$extraClass,extraPopperClass=_ref.extraPopperClass,rest=function _objectWithoutProperties(e,t){if(null==e)return{};var o,r,i=function _objectWithoutPropertiesLoose(r,e){if(null==r)return{};var t={};for(var n in r)if({}.hasOwnProperty.call(r,n)){if(e.includes(n))continue;t[n]=r[n]}return t}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)o=s[r],t.includes(o)||{}.propertyIsEnumerable.call(e,o)&&(i[o]=e[o])}return i}(_ref,_excluded),classes=(0,clsx.A)(_defineProperty({"tooltip-wrapper":!0,"clear-tooltip":clear},extraClass,!0));return(0,jsx_runtime.jsx)(Tooltip.A,_objectSpread(_objectSpread({enterNextDelay:400,enterDelay:400,title:data,classes:{tooltip:classes,arrow:"tooltip-arrow",popper:extraPopperClass},placement:"top",arrow:!0},rest),{},{children}))}const components_Tooltip_Tooltip=Tooltip_Tooltip;try{Tooltip_Tooltip.displayName="Tooltip",Tooltip_Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{clear:{defaultValue:{value:"false"},description:"",name:"clear",required:!1,type:{name:"boolean"}},data:{defaultValue:{value:""},description:"",name:"data",required:!1,type:{name:"string | ReactElement<any, string | JSXElementConstructor<any>>"}},extraClass:{defaultValue:{value:""},description:"",name:"extraClass",required:!1,type:{name:"string"}},extraPopperClass:{defaultValue:null,description:"",name:"extraPopperClass",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["lib/components/Tooltip/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip_Tooltip.__docgenInfo,name:"Tooltip",path:"lib/components/Tooltip/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./lib/components/Tooltip/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>_Tooltip__WEBPACK_IMPORTED_MODULE_0__.A});var _Tooltip__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./lib/components/Tooltip/Tooltip.tsx");try{Tooltip.displayName="Tooltip",Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{clear:{defaultValue:{value:"false"},description:"",name:"clear",required:!1,type:{name:"boolean"}},data:{defaultValue:{value:""},description:"",name:"data",required:!1,type:{name:"string | ReactElement<any, string | JSXElementConstructor<any>>"}},extraClass:{defaultValue:{value:""},description:"",name:"extraClass",required:!1,type:{name:"string"}},extraPopperClass:{defaultValue:null,description:"",name:"extraPopperClass",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["lib/components/Tooltip/index.tsx#Tooltip"]={docgenInfo:Tooltip.__docgenInfo,name:"Tooltip",path:"lib/components/Tooltip/index.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./lib/components/inputs/TextArea/TextArea.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>TextArea_TextArea});__webpack_require__("./node_modules/react/index.js");var clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),Tooltip=__webpack_require__("./lib/components/Tooltip/index.tsx"),consts=__webpack_require__("./lib/consts.ts"),svgs=__webpack_require__("./lib/svgs/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),textArea=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/inputs/TextArea/textArea.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(textArea.A,options);textArea.A&&textArea.A.locals&&textArea.A.locals;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}var _excluded=["label","onChange","value","error","placeholder","wrapperClass","isRequired","info","tooltip","disabled"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var TextArea=function TextArea(props){var label=props.label,onChange=props.onChange,value=props.value,error=props.error,placeholder=props.placeholder,_props$wrapperClass=props.wrapperClass,wrapperClass=void 0===_props$wrapperClass?"":_props$wrapperClass,isRequired=props.isRequired,info=props.info,_props$tooltip=props.tooltip,tooltip=void 0===_props$tooltip?consts.u1:_props$tooltip,_props$disabled=props.disabled,disabled=void 0!==_props$disabled&&_props$disabled,rest=function _objectWithoutProperties(e,t){if(null==e)return{};var o,r,i=function _objectWithoutPropertiesLoose(r,e){if(null==r)return{};var t={};for(var n in r)if({}.hasOwnProperty.call(r,n)){if(e.includes(n))continue;t[n]=r[n]}return t}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)o=s[r],t.includes(o)||{}.propertyIsEnumerable.call(e,o)&&(i[o]=e[o])}return i}(props,_excluded);var wrapperClasses=(0,clsx.A)(_defineProperty(_defineProperty(_defineProperty({},wrapperClass,!0),"text-area-field",!0),"has-error",!!error));return(0,jsx_runtime.jsxs)("div",{className:wrapperClasses,children:[(0,jsx_runtime.jsx)(Tooltip.A,{data:tooltip,children:(0,jsx_runtime.jsx)("textarea",_objectSpread({className:"field__input",placeholder,value:null===value?consts.u1:value,onChange:function onTextChange(event){onChange(event.target.value)},disabled},rest))}),(0,jsx_runtime.jsx)("span",{className:"field__label-wrap",children:(0,jsx_runtime.jsxs)("span",{className:"field__label field-1-label-content",children:[label,isRequired&&(0,jsx_runtime.jsx)("span",{className:"required-star",children:"*"}),!!info&&(0,jsx_runtime.jsx)(Tooltip.A,{data:info,children:(0,jsx_runtime.jsx)(svgs.R2,{})})]})}),(0,jsx_runtime.jsx)("span",{className:"text-area-error capitalize-first-letter",children:error})]})};const TextArea_TextArea=TextArea;try{TextArea.displayName="TextArea",TextArea.__docgenInfo={description:"",displayName:"TextArea",props:{onChange:{defaultValue:null,description:"",name:"onChange",required:!1,type:{name:"((newVal: any) => void)"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"any"}},wrapperClass:{defaultValue:null,description:"",name:"wrapperClass",required:!1,type:{name:"string"}},info:{defaultValue:null,description:"",name:"info",required:!1,type:{name:"string"}},isRequired:{defaultValue:null,description:"",name:"isRequired",required:!1,type:{name:"boolean"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string | number"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string | ReactElement<any, string | JSXElementConstructor<any>>"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"any"}},tooltip:{defaultValue:null,description:"",name:"tooltip",required:!1,type:{name:"string"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["lib/components/inputs/TextArea/TextArea.tsx#TextArea"]={docgenInfo:TextArea.__docgenInfo,name:"TextArea",path:"lib/components/inputs/TextArea/TextArea.tsx#TextArea"})}catch(__react_docgen_typescript_loader_error){}},"./lib/consts.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Br:()=>SAVED_RESIZED,Cg:()=>SAVED_RESIZING_ENABLED,ID:()=>TIME_PARTS,KR:()=>MONTHS,Zn:()=>TAG_SEPARATOR,_W:()=>TIME_PARTS_SHORTENINGS,a1:()=>GENERAL_ERROR,ch:()=>EVENT_KEYS,kW:()=>NOP,kv:()=>DIALOG_STATUSES,m2:()=>SAVED_FILTERS,oC:()=>SEVERITIES,p6:()=>SHORT_DAY_OF_WEEK,u1:()=>EMPTY_STRING,uo:()=>TOASTER_DIALOG,xS:()=>SAVED_HIDDEN,xv:()=>TIME_FORMATS,zU:()=>SEVERITIES_ICONS});var _svgs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./lib/svgs/index.ts"),EMPTY_STRING="",NOP=function NOP(){},TAG_SEPARATOR=",",EVENT_KEYS={ENTER:"Enter",BACKSPACE:"Backspace",TAB:"Tab",ARROW_RIGHT:"ArrowRight",ARROW_LEFT:"ArrowLeft",DOT:"."},SAVED_FILTERS="saved_filters",SAVED_HIDDEN="saved_hidden",SAVED_RESIZED="saved_resized_columns",SAVED_RESIZING_ENABLED="saved_resizing_enabled",GENERAL_ERROR="Something went wrong. Please refresh the page and try again.",TIME_PARTS_SHORTENINGS={years:"y",months:"mon",weeks:"w",days:"d",hours:"h",minutes:"min",seconds:"sec"},SHORT_DAY_OF_WEEK="Mon Tue Wed Thu Fri Sat Sun".split(" "),MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"],TIME_PARTS={HOUR:"hour",MINUTE:"minute",SECOND:"second"},TIME_FORMATS={DATE:"yyyy-MM-dd",DATE_TIME:"yyyy-MM-dd HH:mm",DATE_TIME_SECONDS:"yyyy-MM-dd HH:mm:ss",DATE_TIME_SECONDS_MS:"yyyy-MM-dd HH:mm:ss.SSS"},SEVERITIES=["DEBUG","INFO","WARNING","MINOR","MAJOR","CRITICAL"],SEVERITIES_ICONS={INFO:_svgs__WEBPACK_IMPORTED_MODULE_0__.vY,WARNING:_svgs__WEBPACK_IMPORTED_MODULE_0__.N5,DEBUG:_svgs__WEBPACK_IMPORTED_MODULE_0__.Mr,MINOR:_svgs__WEBPACK_IMPORTED_MODULE_0__.J6,MAJOR:_svgs__WEBPACK_IMPORTED_MODULE_0__.lC,CRITICAL:_svgs__WEBPACK_IMPORTED_MODULE_0__.N8},DIALOG_STATUSES={SUCCESS:"success",ERROR:"error"},TOASTER_DIALOG="toasterDialog"},"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/Tooltip/tooltip.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".tooltip-wrapper{display:block;white-space:pre-line;padding:var(--spread) var(--spread2) !important;font-size:14px !important;color:var(--text-color) !important;border:1px solid var(--accent-t3);background-color:var(--accent-t5) !important;box-shadow:0 2px 2px rgba(0,0,0,.2) !important}.tooltip-wrapper.clear-tooltip{background-color:rgba(0,0,0,0) !important;padding:0 !important;border:none !important;box-shadow:none !important}.tooltip-wrapper .tooltip-arrow{color:var(--accent-t5)}.tooltip-wrapper .tooltip-arrow::before{background-color:var(--accent-t5);border:1px solid var(--accent-t3);box-shadow:0 2px 2px var(--accent-t3) !important}.dark-mode .tooltip-wrapper{background-color:var(--ironhide-t3) !important;border:1px solid var(--ironhide-t1);box-shadow:0 2px 8px rgba(0,0,0,.4) !important}.dark-mode .tooltip-wrapper .tooltip-arrow{color:var(--ironhide-t3)}.dark-mode .tooltip-wrapper .tooltip-arrow::before{background-color:var(--ironhide-t3);border:1px solid var(--ironhide-t1);box-shadow:0 2px 8px rgba(0,0,0,.4) !important}@media(prefers-color-scheme: dark){.tooltip-wrapper{background-color:var(--ironhide-t3) !important;border:1px solid var(--ironhide-t1);box-shadow:0 2px 8px rgba(0,0,0,.4) !important}.tooltip-wrapper .tooltip-arrow{color:var(--ironhide-t3)}.tooltip-wrapper .tooltip-arrow::before{background-color:var(--ironhide-t3);border:1px solid var(--ironhide-t1);box-shadow:0 2px 8px rgba(0,0,0,.4) !important}}","",{version:3,sources:["webpack://./lib/components/Tooltip/tooltip.scss"],names:[],mappings:"AAAA,iBACE,aAAA,CACA,oBAAA,CACA,+CAAA,CACA,yBAAA,CACA,kCAAA,CACA,iCAAA,CACA,4CAAA,CACA,8CAAA,CAEA,+BACE,yCAAA,CACA,oBAAA,CACA,sBAAA,CACA,0BAAA,CAGF,gCACE,sBAAA,CAEA,wCACE,iCAAA,CACA,iCAAA,CACA,gDAAA,CAmBN,4BAbE,8CAAA,CACA,mCAAA,CACA,8CAAA,CACA,2CACE,wBAAA,CACA,mDACE,mCAAA,CACA,mCAAA,CACA,8CAAA,CASN,mCACE,iBAlBA,8CAAA,CACA,mCAAA,CACA,8CAAA,CACA,gCACE,wBAAA,CACA,wCACE,mCAAA,CACA,mCAAA,CACA,8CAAA,CAAA",sourcesContent:[".tooltip-wrapper {\n  display: block;\n  white-space: pre-line;\n  padding: var(--spread) var(--spread2) !important;\n  font-size: 14px !important;\n  color: var(--text-color) !important;\n  border: 1px solid var(--accent-t3);\n  background-color: var(--accent-t5) !important;\n  box-shadow: 0 2px 2px #00000033 !important;\n\n  &.clear-tooltip {\n    background-color: transparent !important;\n    padding: 0 !important;\n    border: none !important;\n    box-shadow: none !important;\n  }\n\n  .tooltip-arrow {\n    color: var(--accent-t5);\n\n    &::before {\n      background-color: var(--accent-t5);\n      border: 1px solid var(--accent-t3);\n      box-shadow: 0 2px 2px var(--accent-t3) !important;\n    }\n  }\n}\n\n@mixin tooltip-wrapper-dark {\n  background-color: var(--ironhide-t3) !important;\n  border: 1px solid var(--ironhide-t1);\n  box-shadow: 0 2px 8px #00000066 !important;\n  .tooltip-arrow {\n    color: var(--ironhide-t3);\n    &::before {\n      background-color: var(--ironhide-t3);\n      border: 1px solid var(--ironhide-t1);\n      box-shadow: 0 2px 8px #00000066 !important;\n    }\n  }\n}\n\n.dark-mode .tooltip-wrapper {\n  @include tooltip-wrapper-dark();\n}\n\n@media (prefers-color-scheme: dark) {\n  .tooltip-wrapper {\n    @include tooltip-wrapper-dark();\n  }\n}\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./lib/components/inputs/TextArea/textArea.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".text-area-field{--uiFieldBorderWidth: var(--fieldBorderWidth, 2px);--uiFieldPaddingRight: var(--fieldPaddingRight, 1rem);--uiFieldPaddingLeft: var(--fieldPaddingLeft, 1rem);--uiFieldBorderColorActive: var(--fieldBorderColorActive, rgba(22, 22, 22, 1));display:var(--fieldDisplay, inline-flex);position:relative;width:525px;height:320px;padding-top:20px}.text-area-field .field__input{box-sizing:border-box;border:1px solid var(--ironhide-t1);width:100%;padding-left:12px;padding-right:10px;border-radius:4px;color:var(--ironhide-s4);background-color:var(--input-background);font-size:17px;font-family:inherit;display:inline-block;word-break:break-all}.text-area-field .field__input::-webkit-outer-spin-button,.text-area-field .field__input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.text-area-field .field__input[type=number]{-moz-appearance:textfield}.text-area-field .field__input:focus{outline:none}.text-area-field .field__label-wrap{box-sizing:border-box;position:absolute;top:0;right:0;left:0}.text-area-field .field__input:focus~.field__label-wrap::after{opacity:1}.text-area-field .field__label{position:absolute;left:12px;top:4px}.text-area-field .field__label svg{height:12px;position:absolute;right:-16px}.text-area-field .field__label svg path{fill:currentColor}.text-area-field .field__input:focus{border:1px solid var(--main-color);box-shadow:0 0 0 1px var(--main-color);border-radius:4px}.text-area-field.has-error .field__input{border:1px solid var(--focus-key);box-shadow:0 0 0 1px var(--focus-key);border-radius:4px}.text-area-field .field__input:disabled{background-color:var(--ironhide-t2);color:var(--ironhide-s1)}.text-area-field .text-area-error{position:absolute;bottom:-16px;left:3px;font-size:12px;color:var(--focus-key);white-space:nowrap}","",{version:3,sources:["webpack://./lib/components/inputs/TextArea/textArea.scss"],names:[],mappings:"AAAA,iBACE,kDAAA,CACA,qDAAA,CACA,mDAAA,CACA,8EAAA,CAEA,wCAAA,CACA,iBAAA,CACA,WAAA,CACA,YAAA,CACA,gBAAA,CAGA,+BACE,qBAAA,CACA,mCAAA,CACA,UAAA,CACA,iBAAA,CACA,kBAAA,CACA,iBAAA,CACA,wBAAA,CACA,wCAAA,CACA,cAAA,CACA,mBAAA,CACA,oBAAA,CACA,oBAAA,CAGA,oHACE,uBAAA,CACA,QAAA,CAGF,4CACE,yBAAA,CAIJ,qCACE,YAAA,CAGF,oCACE,qBAAA,CAEA,iBAAA,CACA,KAAA,CACA,OAAA,CACA,MAAA,CAGF,+DACE,SAAA,CAGF,+BACE,iBAAA,CACA,SAAA,CACA,OAAA,CAEA,mCACE,WAAA,CACA,iBAAA,CACA,WAAA,CAEA,wCACE,iBAAA,CAKL,qCACC,kCAAA,CACA,sCAAA,CACA,iBAAA,CAGF,yCACE,iCAAA,CACA,qCAAA,CACA,iBAAA,CAGF,wCACE,mCAAA,CACA,wBAAA,CAIF,kCACE,iBAAA,CACA,YAAA,CACA,QAAA,CACA,cAAA,CACA,sBAAA,CACA,kBAAA",sourcesContent:[".text-area-field {\n  --uiFieldBorderWidth: var(--fieldBorderWidth, 2px);\n  --uiFieldPaddingRight: var(--fieldPaddingRight, 1rem);\n  --uiFieldPaddingLeft: var(--fieldPaddingLeft, 1rem);\n  --uiFieldBorderColorActive: var(--fieldBorderColorActive, rgba(22, 22, 22, 1));\n\n  display: var(--fieldDisplay, inline-flex);\n  position: relative;\n  width: 525px;\n  height: 320px;\n  padding-top: 20px;\n\n\n  .field__input {\n    box-sizing: border-box;\n    border: 1px solid var(--ironhide-t1);\n    width: 100%;\n    padding-left: 12px;\n    padding-right: 10px;\n    border-radius: 4px;\n    color: var(--ironhide-s4);\n    background-color: var(--input-background);\n    font-size: 17px;\n    font-family: inherit;\n    display: inline-block;\n    word-break: break-all;\n\n\n    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {\n      -webkit-appearance: none;\n      margin: 0;\n    }\n\n    &[type=number] {\n      -moz-appearance: textfield;\n    }\n  }\n\n  .field__input:focus {\n    outline: none;\n  }\n\n  .field__label-wrap {\n    box-sizing: border-box;\n\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n  }\n\n  .field__input:focus ~ .field__label-wrap::after {\n    opacity: 1;\n  }\n\n  .field__label {\n    position: absolute;\n    left: 12px;\n    top: 4px;\n\n    svg {\n      height: 12px;\n      position: absolute;\n      right: -16px;\n\n      path {\n        fill: currentColor;\n      }\n    }\n  }\n\n   .field__input:focus {\n    border: 1px solid var(--main-color);\n    box-shadow: 0 0 0 1px var(--main-color);\n    border-radius: 4px;\n  }\n\n  &.has-error .field__input {\n    border: 1px solid var(--focus-key);\n    box-shadow: 0 0 0 1px var(--focus-key);\n    border-radius: 4px;\n  }\n\n  .field__input:disabled {\n    background-color: var(--ironhide-t2);\n    color: var(--ironhide-s1);\n\n  }\n\n  .text-area-error {\n    position: absolute;\n    bottom: -16px;\n    left: 3px;\n    font-size: 12px;\n    color: var(--focus-key);\n    white-space: nowrap;\n  }\n}\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);