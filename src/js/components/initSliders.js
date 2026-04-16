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
      loop: false,
      watchOverflow: true,
      centeredSlides: true,
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
          slidesPerView: 'auto',
          spaceBetween: 24,
          centeredSlides: true,
        },
        // 768–1279 = only-tablet: без center — первый слайд у левого края контейнера
        768: {
          slidesPerView: 'auto',
          spaceBetween: 16,
          centeredSlides: false,
        },
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
          centeredSlides: true,
        },
      },
    });
  }

  // ─── Слайдер «Технологии» (CRM): одна разметка, один Swiper
  const crmTechSection = document.querySelector('.crm-tech');
  if (crmTechSection) {
    const crmTechWrap = crmTechSection.querySelector('.crm-tech__slider-wrap');
    if (crmTechWrap) {
      const swiperEl = crmTechWrap.querySelector('.swiper');
      if (swiperEl && !swiperEl.swiper) {
        const nav = crmTechWrap.querySelector('.crm-tech__nav');
        const prevBtn = nav?.querySelector('button:first-of-type');
        const nextBtn = nav?.querySelector('button:last-of-type');
        if (prevBtn && nextBtn) {
          const countEl = crmTechWrap.querySelector('.crm-tech__count');
          const barFill = crmTechWrap.querySelector('.crm-tech__bar-fill');

          const swiper = new Swiper(swiperEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            autoHeight: false,
            breakpoints: {
              0: {
                autoHeight: true,
              },
              768: {
                autoHeight: false,
              },
            },
            navigation: {
              prevEl: prevBtn,
              nextEl: nextBtn,
            },
          });

          const total = swiper.slides.length;
          const sync = () => {
            const idx = swiper.realIndex + 1;
            if (countEl) countEl.textContent = `${idx}/${total}`;
            if (barFill) barFill.style.width = `${(100 * idx) / total}%`;
          };

          swiper.on('slideChange', sync);
          sync();
        }
      }
    }
  }

  // ─── Слайдер «Этапы внедрения CRM»: один активный Swiper по брейкпоинту
  const crmStagesSection = document.querySelector('.crm-stages');
  if (crmStagesSection) {
    const desktopWrap = crmStagesSection.querySelector('.container.desktop .crm-stages__slider-wrap');
    const tabletWrap = crmStagesSection.querySelector('.container.only-tablet .crm-stages__slider-wrap');
    const mobileWrap = crmStagesSection.querySelector('.container.mobile .crm-stages__slider-wrap');
    const wraps = [desktopWrap, tabletWrap, mobileWrap];

    const destroyCrmStages = (wrap) => {
      const el = wrap?.querySelector('.swiper');
      if (el?.swiper) {
        el.swiper.destroy(true, true);
      }
    };

    const initCrmStages = (wrap) => {
      if (!wrap) return;
      const swiperEl = wrap.querySelector('.swiper');
      if (!swiperEl || swiperEl.swiper) return;

      const nav = wrap.querySelector('.crm-stages__nav');
      const prevBtn = nav?.querySelector('button:first-of-type');
      const nextBtn = nav?.querySelector('button:last-of-type');
      if (!prevBtn || !nextBtn) return;

      const countEl = wrap.querySelector('.crm-stages__count');
      const barFill = wrap.querySelector('.crm-stages__bar-fill');

      const swiper = new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },
      });

      const total = swiper.slides.length;
      const sync = () => {
        const idx = swiper.realIndex + 1;
        if (countEl) countEl.textContent = `${idx}/${total}`;
        if (barFill) barFill.style.width = `${(100 * idx) / total}%`;
      };

      swiper.on('slideChange', sync);
      sync();
    };

    const activeCrmStagesWrapIndex = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 0;
      if (w >= 768) return 1;
      return 2;
    };

    let currentCrmStagesIndex = -1;

    const applyCrmStagesBreakpoint = () => {
      const next = activeCrmStagesWrapIndex();
      if (next === currentCrmStagesIndex) return;
      wraps.forEach(destroyCrmStages);
      currentCrmStagesIndex = next;
      initCrmStages(wraps[next]);
    };

    applyCrmStagesBreakpoint();

    let crmStagesResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(crmStagesResizeTimer);
      crmStagesResizeTimer = setTimeout(applyCrmStagesBreakpoint, 150);
    });
  }
}
