export default function initFaq() {
  const faqList = document.querySelectorAll('.faq__item');
  if (!faqList.length) return;

  faqList.forEach((item) => {
    const header = item.querySelector('.faq__item-header');
    const toggle = item.querySelector('.faq__toggle');
    const answer = item.querySelector('.faq__answer');

    if (!header || !answer) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');

      // Закрываем все открытые
      faqList.forEach((other) => {
        if (other !== item) {
          other.classList.remove('faq__item--open');
          const otherAnswer = other.querySelector('.faq__answer');
          const otherToggle = other.querySelector('.faq__toggle');
          if (otherAnswer) otherAnswer.hidden = true;
          if (otherToggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            setToggleIcon(otherToggle, false);
          }
        }
      });

      // Переключаем текущий
      item.classList.toggle('faq__item--open', !isOpen);
      answer.hidden = isOpen;
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(!isOpen));
        setToggleIcon(toggle, !isOpen);
      }
    });
  });
}

function setToggleIcon(btn, isOpen) {
  btn.innerHTML = isOpen
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
         <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
       </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
         <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
       </svg>`;
}
