import Swiper from 'swiper/bundle';
import { applySwiperPaginationToLastVisible } from '../utils/swiper-pagination-last-visible.js';

/** Экземпляры слайдеров «Новости» (tablet + mobile, max-width 1279px) */
let newsSwiperInstances = [];

let mqNewsSlider;

function destroyNewsSliders() {
  newsSwiperInstances.forEach((s) => {
    try {
      s.destroy(true, true);
    } catch {
      /* уже уничтожен */
    }
  });
  newsSwiperInstances = [];
}

function createNewsSliders() {
  document.querySelectorAll('.news-panel-swiper').forEach((el) => {
    const panel = el.closest('.news__panel');
    const paginationEl = panel?.querySelector('.news-pagination');
    if (!paginationEl) return;

    // Mobile-first: на мобилке 1 слайд; spaceBetween 0 — иначе + отступ к ширине ломают вписывание в контейнер
    const swiper = new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      watchOverflow: true,
      centeredSlides: false,
      observer: true,
      observeParents: true,
      pagination: {
        el: paginationEl,
        clickable: true,
        bulletClass: 'news__dot',
        bulletActiveClass: 'news__dot--active',
        renderBullet(index, className) {
          return `<span class="${className}"></span>`;
        },
      },
      on: {
        afterInit(swiper) {
          requestAnimationFrame(() => applySwiperPaginationToLastVisible(swiper));
        },
        paginationUpdate(swiper) {
          requestAnimationFrame(() => applySwiperPaginationToLastVisible(swiper));
        },
        slideChange(swiper) {
          requestAnimationFrame(() => applySwiperPaginationToLastVisible(swiper));
        },
        transitionEnd(swiper) {
          applySwiperPaginationToLastVisible(swiper);
        },
        resize(swiper) {
          requestAnimationFrame(() => applySwiperPaginationToLastVisible(swiper));
        },
      },
      breakpoints: {
        768: {
          slidesPerView: 'auto',
          spaceBetween: 16,
        },
      },
    });
    newsSwiperInstances.push(swiper);
  });
}

/** После смены таба или resize — пересчитать скрытую панель */
export function updateNewsSliders() {
  newsSwiperInstances.forEach((s) => {
    try {
      s.update();
    } catch {
      /* */
    }
  });
}

export default function initNewsSliders() {
  mqNewsSlider = window.matchMedia('(max-width: 1279px)');

  const apply = () => {
    if (mqNewsSlider.matches) {
      if (newsSwiperInstances.length === 0) {
        createNewsSliders();
      } else {
        updateNewsSliders();
      }
    } else {
      destroyNewsSliders();
    }
  };

  apply();
  mqNewsSlider.addEventListener('change', apply);
}
