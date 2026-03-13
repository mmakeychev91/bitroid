// Utils
import { fixHeightOnResize } from './utils/fix-height-on-resize.js';

// Components
import Modal from './components/initModal.js';
import initHeaderDropdown from './components/header-dropdown.js';
import initSliders from './components/initSliders.js';
import initFaq from './components/initFaq.js';
import initNewsTabs from './components/initNewsTabs.js';
import initCtaForm from './components/initCtaForm.js';

document.addEventListener('DOMContentLoaded', function () {
  fixHeightOnResize();
  initHeaderDropdown();
  initSliders();
  initFaq();
  initNewsTabs();
  initCtaForm();
});

// For Backend
window.modal = new Modal();
