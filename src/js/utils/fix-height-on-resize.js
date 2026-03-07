import { throttle } from './throttle.js';
import vars from './vars.js';

export const fixHeightOnResize = () => {
  const getHeight = () => {
    let vh = window.innerHeight;
    let headerHeight = document.querySelector('.header')?.offsetHeight;

    vars.htmlEl.style.setProperty('--vh', `${vh}px`);
    if (headerHeight) {
      vars.htmlEl.style.setProperty('--header-height', `${headerHeight}px`);
    }
  };

  let fixHeight = throttle(getHeight);

  fixHeight();

  window.addEventListener('resize', fixHeight);
};
