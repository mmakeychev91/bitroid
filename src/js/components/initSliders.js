import Swiper from 'swiper/bundle';

export default function initSliders() {
  // ─── Слайдер кейсов ────────────────────────────────────────────────────
  const casesEl = document.querySelector('.cases-swiper');
  if (casesEl) {
    new Swiper(casesEl, {
      slidesPerView: 'auto',
      spaceBetween: 18,
      loop: true,
      navigation: {
        prevEl: '.swiper-button-prev-cases',
        nextEl: '.swiper-button-next-cases',
      },
      pagination: {
        el: '.cases-pagination',
        clickable: true,
        bulletClass: 'cases__dot',
        bulletActiveClass: 'cases__dot--active',
        renderBullet(index, className) {
          return `<span class="${className}"></span>`;
        },
      },
      breakpoints: {
        1280: {
          slidesPerView: 3,
          spaceBetween: 18,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
      },
    });
  }

  // ─── Слайдер отзывов ───────────────────────────────────────────────────
  const reviewsEl = document.querySelector('.reviews-swiper');
  if (reviewsEl) {
    new Swiper(reviewsEl, {
      slidesPerView: 'auto',
      spaceBetween: 24,
      loop: true,
      centeredSlides: false,
      navigation: {
        prevEl: '.swiper-button-prev-reviews',
        nextEl: '.swiper-button-next-reviews',
      },
      pagination: {
        el: '.reviews-pagination',
        clickable: true,
        bulletClass: 'reviews__dot',
        bulletActiveClass: 'reviews__dot--active',
        renderBullet(index, className) {
          return `<span class="${className}"></span>`;
        },
      },
      breakpoints: {
        1280: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 1.2,
          spaceBetween: 16,
        },
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
      },
    });
  }
}
