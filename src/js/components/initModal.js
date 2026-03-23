import { disableScroll } from '../utils/disable-scroll.js';
import { enableScroll } from '../utils/enable-scroll.js';

export default class Modal {
  constructor(options) {
    let defaultOptions = {
      isOpen: () => {},
      isClose: () => {},
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
    this._focusElements = [
      'a[href]',
      'input',
      'select',
      'textarea',
      'button',
      'iframe',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.openTimeout = null;
    this.closeTimeout = null;
    this.events();
  }

  events() {
    if (document.querySelectorAll('.js-modal').length) {
      document.addEventListener(
        'click',
        function (e) {
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
        }.bind(this)
      );

      window.addEventListener(
        'keydown',
        function (e) {
          if ((e.key === 'Escape' || e.keyCode == 27) && this.isOpen) {
            this.close();
          }

          if ((e.key === 'Tab' || e.keyCode == 9) && this.isOpen) {
            this.focusCatch(e);
            return;
          }
        }.bind(this)
      );

      document.addEventListener(
        'mousedown',
        function (e) {
          if (e.target.classList.contains('js-modal') && e.target.classList.contains('is-open')) {
            this.close();
          }
        }.bind(this)
      );
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

    disableScroll();
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

      enableScroll();
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
    } else if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }
}
