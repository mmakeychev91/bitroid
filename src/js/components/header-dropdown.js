/**
 * Выпадающее меню в шапке — открытие по hover/click по Figma «раскрытое меню»
 */
function initHeaderDropdown() {
  const triggers = document.querySelectorAll('.js-dropdown-trigger');
  const dropdowns = document.querySelectorAll('.js-dropdown');

  if (!triggers.length || !dropdowns.length) return;

  triggers.forEach((trigger) => {
    const item = trigger.closest('.header__nav-item--dropdown');
    const dropdown = item?.querySelector('.js-dropdown');
    if (!item || !dropdown) return;

    let hoverTimer = null;

    function open() {
      dropdown.removeAttribute('aria-hidden');
      dropdown.classList.add('is-open');
      item.setAttribute('aria-expanded', 'true');
    }

    function close() {
      dropdown.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('is-open');
      item.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('is-open');
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
}

export default initHeaderDropdown;
