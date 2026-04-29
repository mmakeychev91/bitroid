/**
 * Табы «Полный цикл работ по разработке» (страница создания сайтов).
 */
export default function initSiteDevCycleTabs() {
  const section = document.querySelector('.site-dev-cycle');
  if (!section) return;

  // На мобилке используем отдельную разметку-аккордеон
  const mobileAccordion = section.querySelector('.site-dev-cycle__accordion');
  if (mobileAccordion) return;

  const tablist = section.querySelector('[role="tablist"]');
  const tabs = Array.from(section.querySelectorAll('.site-dev-cycle__tab[data-tab]'));
  const panels = Array.from(section.querySelectorAll('.site-dev-cycle__panel[data-panel]'));

  if (!tabs.length || !panels.length) return;

  function activateById(tabId, { focusTab = true } = {}) {
    const tab = tabs.find((t) => t.dataset.tab === tabId);
    if (!tab) return;

    tabs.forEach((t) => {
      const active = t.dataset.tab === tabId;
      t.classList.toggle('site-dev-cycle__tab--active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === tabId;
      panel.classList.toggle('site-dev-cycle__panel--active', active);
      panel.hidden = !active;
    });

    if (focusTab) {
      tab.focus();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateById(tab.dataset.tab, { focusTab: false });
      tab.focus();
    });
  });

  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const current = document.activeElement;
      if (!tabs.includes(current)) return;

      const idx = tabs.indexOf(current);
      let nextIdx = idx;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIdx = (idx + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIdx = (idx - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIdx = tabs.length - 1;
      } else {
        return;
      }

      activateById(tabs[nextIdx].dataset.tab);
    });
  }
}
