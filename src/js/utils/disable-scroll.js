import vars from './vars.js';

export const disableScroll = () => {
  if (!vars.bodyEl.classList.contains('disable-scroll')) {
    const fixBlocks = document?.querySelectorAll('.fix-block');
    const pagePosition = window.scrollY;
    const paddingOffset = `${window.innerWidth - vars.bodyEl.offsetWidth}px`;

    vars.htmlEl.style.scrollBehavior = 'auto';
    fixBlocks.forEach((el) => {
      el.style.paddingRight = paddingOffset;
    });
    vars.bodyEl.style.paddingRight = paddingOffset;
    vars.bodyEl.classList.add('disable-scroll');
    vars.bodyEl.dataset.position = pagePosition;
    vars.bodyEl.style.top = `-${pagePosition}px`;
  }
};
