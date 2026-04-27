/**
 * Индекс слайда, визуально крайнего справа среди видимых в области слайдера (LTR).
 * Нужен для пагинации: при slidesPerView > 1 зелёная точка = последний видимый слайд
 * (например, когда в кадре два последних).
 *
 * @param {object} swiper экземпляр Swiper
 * @returns {number}
 */
export function getRightmostVisibleSlideIndex(swiper) {
  if (!swiper?.el || !swiper?.slides?.length) {
    return swiper?.realIndex ?? 0;
  }

  const rect = swiper.el.getBoundingClientRect();
  const slides = swiper.slides;

  if (swiper.params.rtl) {
    let minIdx = slides.length - 1;
    let anyVisibleRtl = false;
    slides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      if (r.left < rect.right && r.right > rect.left) {
        minIdx = Math.min(minIdx, i);
        anyVisibleRtl = true;
      }
    });
    return anyVisibleRtl ? minIdx : (swiper.activeIndex ?? 0);
  }

  let maxIdx = 0;
  let anyVisible = false;
  slides.forEach((slide, i) => {
    const r = slide.getBoundingClientRect();
    if (r.left < rect.right && r.right > rect.left) {
      maxIdx = i;
      anyVisible = true;
    }
  });

  if (swiper.isEnd && slides.length > 0) {
    return Math.max(maxIdx, slides.length - 1);
  }

  return anyVisible ? maxIdx : (swiper.activeIndex ?? 0);
}

/**
 * Встроенная пагинация Swiper: ставит active-класс на буллете последнего видимого слайда
 * (после стандартного update от Swiper вызывать в slideChange/resize/transitionEnd).
 *
 * @param {object} swiper экземпляр Swiper
 */
export function applySwiperPaginationToLastVisible(swiper) {
  const mod = swiper.pagination;
  if (!mod?.bullets?.length) return;
  const pa = swiper.params.pagination;
  if (!pa) return;
  if (pa.type && pa.type !== 'bullets') return;
  const activeClass = pa.bulletActiveClass;
  if (!activeClass) return;

  const idx = getRightmostVisibleSlideIndex(swiper);
  mod.bullets.forEach((bullet, i) => {
    bullet.classList.toggle(activeClass, i === idx);
  });
}
