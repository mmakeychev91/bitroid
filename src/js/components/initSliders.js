import Swiper from 'swiper/bundle';

export default function initSliders() {
  // ─── Слайдер кейсов ────────────────────────────────────────────────────
  const casesEl = document.querySelector('.cases-swiper');
  if (casesEl) {
    const casesSwiper = new Swiper(casesEl, {
      slidesPerView: 1,
      spaceBetween: 12,
      loop: false,
      watchOverflow: true,
      navigation: {
        prevEl: '.swiper-button-prev-cases',
        nextEl: '.swiper-button-next-cases',
      },
      pagination: false,
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

    // Кастомная пагинация: буллет = каждый слайд (как в макете), а не snapGrid
    const paginationEl = document.querySelector('.cases-pagination');
    if (paginationEl) {
      const render = () => {
        const slidesCount = casesSwiper.slides.length;
        paginationEl.innerHTML = Array.from({ length: slidesCount })
          .map((_, i) => `<span class="cases__dot${i === casesSwiper.realIndex ? ' cases__dot--active' : ''}" data-index="${i}"></span>`)
          .join('');
      };

      const setActive = () => {
        const bullets = paginationEl.querySelectorAll('.cases__dot');
        bullets.forEach((b) => b.classList.remove('cases__dot--active'));
        const active = paginationEl.querySelector(`.cases__dot[data-index="${casesSwiper.realIndex}"]`);
        if (active) active.classList.add('cases__dot--active');
      };

      render();
      paginationEl.addEventListener('click', (e) => {
        const target = e.target.closest('.cases__dot');
        if (!target) return;
        const idx = Number(target.getAttribute('data-index'));
        if (Number.isNaN(idx)) return;
        casesSwiper.slideTo(idx);
      });

      casesSwiper.on('slideChange', setActive);
      casesSwiper.on('update', () => {
        render();
        setActive();
      });
    }
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
}
