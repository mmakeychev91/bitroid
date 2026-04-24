import { throttle } from '../utils/throttle.js';

const trackTemplates = new WeakMap();
const tickerLayoutWidths = new WeakMap();
const TICKER_SPEED_PX_PER_SEC = 80;
/** Скачки innerWidth на мобилке (панель браузера); лишние пересборки сбрасывают анимацию. */
const RESIZE_WIDTH_THRESHOLD_PX = 6;

function appendTemplateSet(track, template) {
  template.forEach((node) => {
    track.appendChild(node.cloneNode(true));
  });
}

/** Стабилизация вёрстки перед замером (шрифты, картинки, reflow). */
function nextFrames(n = 2) {
  return new Promise((resolve) => {
    const step = (left) => {
      if (left <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => step(left - 1));
    };
    requestAnimationFrame(() => step(n));
  });
}

function waitForImagesIn(root) {
  const images = Array.from(root.querySelectorAll('img'));
  if (!images.length) {
    return Promise.resolve();
  }
  return Promise.all(
    images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            }),
    ),
  );
}

/**
 * @param {Element} track
 * @param {boolean} [force] — игнорировать порог ширины (window.load, ручной пересчёт)
 */
async function buildTickerTrack(track, force = false) {
  const ticker = track.closest('.certificates__ticker');
  if (!ticker) {
    return;
  }

  const widthNow = ticker.clientWidth;
  if (!force) {
    const prevW = tickerLayoutWidths.get(ticker);
    if (prevW != null && Math.abs(widthNow - prevW) < RESIZE_WIDTH_THRESHOLD_PX) {
      return;
    }
  }

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // не блокируем
    }
  }

  await waitForImagesIn(ticker);
  await nextFrames(2);

  if (!trackTemplates.has(track)) {
    const template = Array.from(track.children).map((node) => node.cloneNode(true));
    trackTemplates.set(track, template);
  }

  const template = trackTemplates.get(track);
  if (!template || !template.length) {
    return;
  }

  // Первый проход: замеряем ширину одного полного набора.
  track.innerHTML = '';
  appendTemplateSet(track, template);
  await nextFrames(1);

  const singleSetWidth = track.scrollWidth;
  if (!singleSetWidth) {
    return;
  }

  // Количество наборов в первой половине должно перекрывать ширину контейнера.
  const halfSetsCount = Math.max(1, Math.ceil(ticker.clientWidth / singleSetWidth));

  // Второй проход: собираем 2 одинаковые половины для бесшовного цикла.
  track.innerHTML = '';
  for (let i = 0; i < halfSetsCount; i += 1) {
    appendTemplateSet(track, template);
  }
  await nextFrames(1);

  const firstHalfWidth = track.scrollWidth;
  if (!firstHalfWidth) {
    return;
  }

  const firstHalfNodes = Array.from(track.children).map((node) => node.cloneNode(true));
  firstHalfNodes.forEach((node) => {
    track.appendChild(node);
  });
  await nextFrames(1);

  const firstHalfWidthRounded = Math.round(firstHalfWidth);

  // Анимируем трек строго на ширину первой половины, чтобы цикл был бесшовным.
  track.style.setProperty('--ticker-loop-width', `${firstHalfWidthRounded}px`);

  // Единая скорость для всех строк: длительность зависит от длины трека.
  const durationInSeconds = firstHalfWidthRounded / TICKER_SPEED_PX_PER_SEC;
  track.style.setProperty('--ticker-duration', `${durationInSeconds}s`);

  tickerLayoutWidths.set(ticker, ticker.clientWidth);
}

export default function initTickers() {
  const tracks = document.querySelectorAll('.certificates__ticker-track');
  if (!tracks.length) {
    return;
  }

  const rebuildAll = (force = false) => {
    (async () => {
      for (const track of tracks) {
        await buildTickerTrack(track, force);
      }
    })();
  };

  void rebuildAll(true);

  window.addEventListener(
    'resize',
    throttle(() => {
      rebuildAll(false);
    }, 300),
  );

  // После загрузки картинок в строке с логотипами — пересчёт, иначе scrollWidth неверный и «шов» дёргается.
  window.addEventListener('load', () => {
    rebuildAll(true);
  });
}
