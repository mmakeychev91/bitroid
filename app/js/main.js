/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/initModal.js":
/*!****************************************!*\
  !*** ./src/js/components/initModal.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Modal; }
/* harmony export */ });
/* harmony import */ var _utils_disable_scroll_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/disable-scroll.js */ "./src/js/utils/disable-scroll.js");
/* harmony import */ var _utils_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/enable-scroll.js */ "./src/js/utils/enable-scroll.js");


class Modal {
  constructor(options) {
    let defaultOptions = {
      isOpen: () => {},
      isClose: () => {}
    };
    this.body = document.body;
    this.options = Object.assign(defaultOptions, options);
    this.speed = 300;
    this._reOpen = false;
    this._nextContainer = false;
    this.modalContainer = false;
    this.isOpen = false;
    this.previousActiveElement = false;
    this.clickedElement = false;
    this._focusElements = ['a[href]', 'input', 'select', 'textarea', 'button', 'iframe', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
    this.openTimeout = null;
    this.closeTimeout = null;
    this.events();
  }
  events() {
    if (document.querySelectorAll('.js-modal').length) {
      document.addEventListener('click', function (e) {
        if (e.target.closest(`[data-modal-path]`)) {
          this.clickedElement = e.target.closest(`[data-modal-path]`);
          let target = this.clickedElement.dataset.modalPath;
          this._nextContainer = document.querySelector(`[data-modal-target="${target}"]`);
          this.open();
          return;
        }
        if (e.target.closest('.js-modal-close')) {
          this.close();
          return;
        }
      }.bind(this));
      window.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.keyCode == 27) && this.isOpen) {
          this.close();
        }
        if ((e.key === 'Tab' || e.keyCode == 9) && this.isOpen) {
          this.focusCatch(e);
          return;
        }
      }.bind(this));
      document.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('js-modal') && e.target.classList.contains('is-open')) {
          this.close();
        }
      }.bind(this));
    }
  }
  open(selector) {
    this.previousActiveElement = document.activeElement;
    if (this.isOpen) {
      this.reOpen = true;
      this.close();
      return;
    }
    this.modalContainer = selector ? document.querySelector(`[data-modal-target="${selector}"]`) : this._nextContainer;
    const modalOverlay = this.modalContainer.closest('.js-modal');
    (0,_utils_disable_scroll_js__WEBPACK_IMPORTED_MODULE_0__.disableScroll)();
    this.body.classList.add('is-modal-open');
    modalOverlay?.classList.add('is-open');
    this.modalContainer.scrollTo(0, 0);
    this.modalContainer.classList.add('modal-open');
    clearTimeout(this.closeTimeout);
    this.openTimeout = setTimeout(() => {
      this.options.isOpen(this);
      this.modalContainer.classList.add('animate-open');
      this.isOpen = true;
      this.focusTrap();
    }, this.speed);
  }
  close() {
    if (this.modalContainer) {
      const modalOverlay = this.modalContainer.closest('.js-modal');
      modalOverlay?.classList.remove('is-open');
      this.modalContainer.classList.remove('animate-open');
      (0,_utils_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__.enableScroll)();
      this.body.classList.remove('is-modal-open');
      this.options.isClose(this);
      this.isOpen = false;
      this.clickedElement = false;
      this.focusTrap();
      if (this.reOpen) {
        this.reOpen = false;
        this.open();
      }
      clearTimeout(this.openTimeout);
      this.closeTimeout = setTimeout(() => {
        this.modalContainer.classList.remove('modal-open');
      }, this.speed);
    }
  }
  focusCatch(e) {
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
    const nodesArray = Array.from(nodes);
    const focusedItemIndex = nodesArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedItemIndex === 0) {
      nodesArray[nodesArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
      nodesArray[0].focus();
      e.preventDefault();
    }
  }

  // если мешает скролл при возвращении фокуса, добавьте параметр { preventScroll: true }
  // nodes[0].focus({ preventScroll: true });
  // this.previousActiveElement.focus({ preventScroll: true });

  focusTrap() {
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
    if (this.isOpen) {
      if (nodes.length) nodes[0].focus();
    } else {
      this.previousActiveElement.focus();
    }
  }
}

/***/ }),

/***/ "./src/js/utils/disable-scroll.js":
/*!****************************************!*\
  !*** ./src/js/utils/disable-scroll.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableScroll: function() { return /* binding */ disableScroll; }
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vars.js */ "./src/js/utils/vars.js");

const disableScroll = () => {
  if (!_vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.classList.contains('disable-scroll')) {
    const fixBlocks = document?.querySelectorAll('.fix-block');
    const pagePosition = window.scrollY;
    const paddingOffset = `${window.innerWidth - _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.offsetWidth}px`;
    _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].htmlEl.style.scrollBehavior = 'auto';
    fixBlocks.forEach(el => {
      el.style.paddingRight = paddingOffset;
    });
    _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.paddingRight = paddingOffset;
    _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.classList.add('disable-scroll');
    _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.dataset.position = pagePosition;
    _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.top = `-${pagePosition}px`;
  }
};

/***/ }),

/***/ "./src/js/utils/enable-scroll.js":
/*!***************************************!*\
  !*** ./src/js/utils/enable-scroll.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enableScroll: function() { return /* binding */ enableScroll; }
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vars.js */ "./src/js/utils/vars.js");

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fix-block');
  const pagePosition = parseInt(_vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.dataset.position, 10);
  fixBlocks.forEach(el => {
    el.style.paddingRight = null;
  });
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.paddingRight = null;
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.top = null;
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.classList.remove('disable-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.removeAttribute('data-position');
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].htmlEl.style.scrollBehavior = null;
};

/***/ }),

/***/ "./src/js/utils/fix-height-on-resize.js":
/*!**********************************************!*\
  !*** ./src/js/utils/fix-height-on-resize.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fixHeightOnResize: function() { return /* binding */ fixHeightOnResize; }
/* harmony export */ });
/* harmony import */ var _throttle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./throttle.js */ "./src/js/utils/throttle.js");
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vars.js */ "./src/js/utils/vars.js");


const fixHeightOnResize = () => {
  const getHeight = () => {
    let vh = window.innerHeight;
    let headerHeight = document.querySelector('.header')?.offsetHeight;
    _vars_js__WEBPACK_IMPORTED_MODULE_1__["default"].htmlEl.style.setProperty('--vh', `${vh}px`);
    if (headerHeight) {
      _vars_js__WEBPACK_IMPORTED_MODULE_1__["default"].htmlEl.style.setProperty('--header-height', `${headerHeight}px`);
    }
  };
  let fixHeight = (0,_throttle_js__WEBPACK_IMPORTED_MODULE_0__.throttle)(getHeight);
  fixHeight();
  window.addEventListener('resize', fixHeight);
};

/***/ }),

/***/ "./src/js/utils/throttle.js":
/*!**********************************!*\
  !*** ./src/js/utils/throttle.js ***!
  \**********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttle: function() { return /* binding */ throttle; }
/* harmony export */ });
const throttle = function (func) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  let isThrottled = false;
  let savedArgs = null;
  let savedThis = null;
  return function wrap() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (isThrottled) {
      savedArgs = args, savedThis = this;
      return;
    }
    func.apply(this, args);
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
      if (savedThis) {
        wrap.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
};

/***/ }),

/***/ "./src/js/utils/vars.js":
/*!******************************!*\
  !*** ./src/js/utils/vars.js ***!
  \******************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  windowEl: window,
  documentEl: document,
  htmlEl: document.documentElement,
  bodyEl: document.body,
  root: document.querySelector(':root'),
  header: document.querySelector('header'),
  siteContainer: document.querySelector('.site-container')
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_fix_height_on_resize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/fix-height-on-resize.js */ "./src/js/utils/fix-height-on-resize.js");
/* harmony import */ var _components_initModal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/initModal.js */ "./src/js/components/initModal.js");
// Utils


// Components

document.addEventListener('DOMContentLoaded', function () {
  (0,_utils_fix_height_on_resize_js__WEBPACK_IMPORTED_MODULE_0__.fixHeightOnResize)();
});

// For Backend
window.modal = new _components_initModal_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
}();
/******/ })()
;
//# sourceMappingURL=main.js.map