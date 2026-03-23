// Utils
import { fixHeightOnResize } from './utils/fix-height-on-resize.js';

// Components
import Modal from './components/initModal.js';
import initHeaderDropdown from './components/header-dropdown.js';
import initSliders from './components/initSliders.js';
import initFaq from './components/initFaq.js';
import initNewsTabs from './components/initNewsTabs.js';
import initNewsSliders from './components/initNewsSliders.js';
import initCtaForm from './components/initCtaForm.js';
import initTickers from './components/initTickers.js';

document.addEventListener('DOMContentLoaded', function () {
  fixHeightOnResize();
  initHeaderDropdown();
  initSliders();
  initFaq();
  initNewsSliders();
  initNewsTabs();
  initCtaForm();
  initTickers();
});

// For Backend
window.modal = new Modal();
