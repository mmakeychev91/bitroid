import { throttle } from '../utils/throttle.js';

const trackTemplates = new WeakMap();
const TICKER_SPEED_PX_PER_SEC = 80;

function appendTemplateSet(track, template) {
  template.forEach((node) => {
    track.appendChild(node.cloneNode(true));
  });
}

function buildTickerTrack(track) {
  const ticker = track.closest('.certificates__ticker');
  if (!ticker) return;

  if (!trackTemplates.has(track)) {
    const template = Array.from(track.children).map((node) => node.cloneNode(true));
    trackTemplates.set(track, template);
  }

  const template = trackTemplates.get(track);
  if (!template || !template.length) return;

  // Первый проход: замеряем ширину одного полного набора.
  track.innerHTML = '';
  appendTemplateSet(track, template);

  const singleSetWidth = track.scrollWidth;
  if (!singleSetWidth) return;

  // Количество наборов в первой половине должно перекрывать ширину контейнера.
  const halfSetsCount = Math.max(1, Math.ceil(ticker.clientWidth / singleSetWidth));

  // Второй проход: собираем 2 одинаковые половины для бесшовного цикла.
  track.innerHTML = '';
  for (let i = 0; i < halfSetsCount; i += 1) {
    appendTemplateSet(track, template);
  }

  const firstHalfWidth = track.scrollWidth;
  if (!firstHalfWidth) return;

  const firstHalfNodes = Array.from(track.children).map((node) => node.cloneNode(true));
  firstHalfNodes.forEach((node) => {
    track.appendChild(node);
  });

  // Анимируем трек строго на ширину первой половины, чтобы цикл был бесшовным.
  track.style.setProperty('--ticker-loop-width', `${firstHalfWidth}px`);

  // Единая скорость для всех строк: длительность зависит от длины трека.
  const durationInSeconds = firstHalfWidth / TICKER_SPEED_PX_PER_SEC;
  track.style.setProperty('--ticker-duration', `${durationInSeconds}s`);
}

export default function initTickers() {
  const tracks = document.querySelectorAll('.certificates__ticker-track');
  if (!tracks.length) return;

  const rebuildAll = () => {
    tracks.forEach((track) => buildTickerTrack(track));
  };

  rebuildAll();
  window.addEventListener('resize', throttle(rebuildAll, 200));
}
