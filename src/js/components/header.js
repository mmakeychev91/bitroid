export const initHeader = () => {
  const header = document.querySelector('.js-header');
  const toggleClass = 'hide';

  let prevScrollPos = window.scrollY;

  window.addEventListener('scroll', () => {
    let currentScrollPos = window.scrollY;
    if (prevScrollPos < currentScrollPos) {
      header.classList.add(toggleClass);
    } else {
      header.classList.remove(toggleClass);
    }
    prevScrollPos = currentScrollPos;
  });
};
