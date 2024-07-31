"use strict";(self.webpackChunk_weka_weka_ui_components=self.webpackChunk_weka_weka_ui_components||[]).push([[113],{"./lib/components/ToggleButton/ToggleButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ToggleButton:()=>ToggleButton,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _ToggleButton__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./lib/components/ToggleButton/ToggleButton.tsx"),_utils__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./lib/utils.tsx"),react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _slicedToArray(r,e){return function _arrayWithHoles(r){if(Array.isArray(r))return r}(r)||function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r}finally{try{if(!f&&null!=t.return&&(u=t.return(),Object(u)!==u))return}finally{if(o)throw n}}return a}}(r,e)||function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0}}(r,e)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/ToggleButton",component:_ToggleButton__WEBPACK_IMPORTED_MODULE_0__.A,argTypes:{onChange:{description:"Trigger on click on the ToggleButton",type:{name:"function",required:!0}},options:{description:"Array of options",type:{name:"object",required:!0}},value:{description:"Control value of the toggle",type:{name:"string",required:!0}}}};var ToggleButton=function Template(args){var options=args.options,_useState2=_slicedToArray((0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(options[0].value),2),value=_useState2[0],setValue=_useState2[1];return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_ToggleButton__WEBPACK_IMPORTED_MODULE_0__.A,_objectSpread(_objectSpread({},args),{},{onChange:setValue,value,options}))}.bind({});ToggleButton.args={options:["one","two","three"].map(_utils__WEBPACK_IMPORTED_MODULE_1__.A.formatStringOption)};const __namedExportsOrder=["ToggleButton"];ToggleButton.parameters={...ToggleButton.parameters,docs:{...ToggleButton.parameters?.docs,source:{originalSource:"(args: object) => {\n  const {\n    options\n  } = args;\n  const [value, setValue] = useState(options[0].value);\n  return <ToggleButtonComponent {...args} onChange={setValue} value={value} options={options} />;\n}",...ToggleButton.parameters?.docs?.source}}};try{ToggleButton.displayName="ToggleButton",ToggleButton.__docgenInfo={description:"",displayName:"ToggleButton",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["lib/components/ToggleButton/ToggleButton.stories.tsx#ToggleButton"]={docgenInfo:ToggleButton.__docgenInfo,name:"ToggleButton",path:"lib/components/ToggleButton/ToggleButton.stories.tsx#ToggleButton"})}catch(__react_docgen_typescript_loader_error){}}}]);