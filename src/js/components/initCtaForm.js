export default function initCtaForm() {
  const forms = document.querySelectorAll('.cta__form');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        submitForm(form);
      }
    });

    // Очищаем ошибку при вводе
    form.querySelectorAll('.cta__input').forEach((input) => {
      input.addEventListener('input', () => clearError(input));
    });
    const consentInput = form.querySelector('[name="consent"]');
    if (consentInput) {
      consentInput.addEventListener('change', () => clearError(consentInput));
    }
  });
}

function validateForm(form) {
  let valid = true;

  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const siteInput = form.querySelector('[name="site"]');
  const consentInput = form.querySelector('[name="consent"]');

  if (nameInput && nameInput.value.trim().length < 2) {
    showError(nameInput, 'Введите ваше имя (минимум 2 символа)');
    valid = false;
  }

  if (phoneInput) {
    const val = phoneInput.value.trim().replace(/\s/g, '');
    const phoneRe = /^[\+]?[78]?[-\s\.]?\(?[489][0-9]{2}\)?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{2}[-\s\.]?[0-9]{2}$/;
    if (val.length === 0) {
      showError(phoneInput, 'Введите номер телефона');
      valid = false;
    } else if (!phoneRe.test(val)) {
      showError(phoneInput, 'Введите корректный номер телефона');
      valid = false;
    }
  }

  if (siteInput && siteInput.value.trim().length > 0) {
    try {
      new URL(siteInput.value.trim());
    } catch {
      showError(siteInput, 'Введите корректный адрес сайта (например: https://example.ru)');
      valid = false;
    }
  }

  if (consentInput && !consentInput.checked) {
    showError(consentInput, 'Необходимо согласие на обработку данных');
    valid = false;
  }

  return valid;
}

function getWrapper(input) {
  // Чекбокс находится внутри .cta__consent
  if (input.type === 'checkbox') {
    return input.closest('.cta__consent');
  }
  return input.closest('.cta__form-field');
}

function showError(input, message) {
  const wrapper = getWrapper(input);
  if (!wrapper) return;

  clearError(input);
  input.classList.add('cta__input--error');

  const errorEl = document.createElement('span');
  errorEl.className = 'cta__error';
  errorEl.textContent = message;
  wrapper.appendChild(errorEl);
}

function clearError(input) {
  const wrapper = getWrapper(input);
  if (!wrapper) return;

  input.classList.remove('cta__input--error');
  const errorEl = wrapper.querySelector('.cta__error');
  if (errorEl) errorEl.remove();
}

function submitForm(form) {
  const btn = form.querySelector('[type="submit"]');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Отправляется…';
  }

  // Здесь подключается реальный API
  setTimeout(() => {
    form.reset();
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Отправить';
    }

    const successMsg = document.createElement('p');
    successMsg.className = 'cta__success-msg';
    successMsg.textContent = 'Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.';
    form.insertAdjacentElement('afterend', successMsg);
    setTimeout(() => successMsg.remove(), 5000);
  }, 800);
}
