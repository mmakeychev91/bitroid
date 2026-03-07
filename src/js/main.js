// Utils
import { fixHeightOnResize } from './utils/fix-height-on-resize.js';

// Components
import Modal from './components/initModal.js';

document.addEventListener('DOMContentLoaded', function () {
  fixHeightOnResize();
});

// For Backend
window.modal = new Modal();
