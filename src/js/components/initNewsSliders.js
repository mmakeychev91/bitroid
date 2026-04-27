import Swiper from "swiper/bundle";
import { getRightmostVisibleSlideIndex } from "../utils/swiper-pagination-last-visible.js";

/** Экземпляры слайдеров «Новости» (до узкого десктопа включительно, max-width 1439px) */
let newsSwiperInstances = [];

let mqNewsSlider;

const NEWS_DOT_CLASS = "news__dot";
const NEWS_DOT_ACTIVE_CLASS = "news__dot--active";

/** Ровно по одной точке на слайд (встроенная пagination Swiper при slidesPerView: auto даёт snap-точки, не слайды) */
function renderNewsPaginationDots(swiper) {
  const panel = swiper.el.closest(".news__panel");
  const paginationEl = panel?.querySelector(".news-pagination");
  if (!paginationEl || !swiper.slides?.length) return;

  paginationEl.innerHTML = "";
  swiper.slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = NEWS_DOT_CLASS;
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute("aria-label", `Слайд ${i + 1}`);
    dot.addEventListener("click", () => {
      swiper.slideTo(i);
    });
    dot.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        swiper.slideTo(i);
      }
    });
    paginationEl.appendChild(dot);
  });
}

function syncNewsPaginationDots(swiper) {
  const panel = swiper.el.closest(".news__panel");
  const paginationEl = panel?.querySelector(".news-pagination");
  if (!paginationEl) return;

  const idx = getRightmostVisibleSlideIndex(swiper);
  paginationEl.querySelectorAll(`.${NEWS_DOT_CLASS}`).forEach((dot, i) => {
    dot.classList.toggle(NEWS_DOT_ACTIVE_CLASS, i === idx);
  });
}

function destroyNewsSliders() {
  newsSwiperInstances.forEach((s) => {
    try {
      const panel = s.el?.closest?.(".news__panel");
      const paginationEl = panel?.querySelector(".news-pagination");
      if (paginationEl) {
        paginationEl.innerHTML = "";
      }
      s.destroy(true, true);
    } catch {
      /* уже уничтожен */
    }
  });
  newsSwiperInstances = [];
}

function createNewsSliders() {
  document.querySelectorAll(".news-panel-swiper").forEach((el) => {
    const panel = el.closest(".news__panel");
    const paginationEl = panel?.querySelector(".news-pagination");
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
      on: {
        afterInit(s) {
          renderNewsPaginationDots(s);
          requestAnimationFrame(() => syncNewsPaginationDots(s));
        },
        slideChange(s) {
          requestAnimationFrame(() => syncNewsPaginationDots(s));
        },
        transitionEnd(s) {
          syncNewsPaginationDots(s);
        },
        slideChangeTransitionEnd(s) {
          requestAnimationFrame(() => syncNewsPaginationDots(s));
        },
        resize(s) {
          requestAnimationFrame(() => syncNewsPaginationDots(s));
        },
      },
      breakpoints: {
        768: {
          slidesPerView: "auto",
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
      syncNewsPaginationDots(s);
    } catch {
      /* */
    }
  });
}

export default function initNewsSliders() {
  mqNewsSlider = window.matchMedia("(max-width: 1439px)");

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
  mqNewsSlider.addEventListener("change", apply);
}
