export default function initNewsTabs() {
  const tabButtons = document.querySelectorAll('.news__tab[data-tab]');
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const section = btn.closest('.news');
      if (!section) return;

      // Сбрасываем все кнопки
      section.querySelectorAll('.news__tab[data-tab]').forEach((b) => {
        b.classList.remove('news__tab--active');
        b.setAttribute('aria-selected', 'false');
      });

      // Активируем нажатую
      btn.classList.add('news__tab--active');
      btn.setAttribute('aria-selected', 'true');

      // Переключаем панели
      section.querySelectorAll('.news__panel').forEach((panel) => {
        const isActive = panel.dataset.panel === tabId;
        panel.classList.toggle('news__panel--active', isActive);
        panel.hidden = !isActive;
      });
    });
  });
}
