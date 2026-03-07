import vars from './vars.js';

export const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fix-block');
  const pagePosition = parseInt(vars.bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = null;
  });
  vars.bodyEl.style.paddingRight = null;

  vars.bodyEl.style.top = null;
  vars.bodyEl.classList.remove('disable-scroll');
  window.scroll({
    top: pagePosition,
    left: 0,
  });
  vars.bodyEl.removeAttribute('data-position');
  vars.htmlEl.style.scrollBehavior = null;
};
