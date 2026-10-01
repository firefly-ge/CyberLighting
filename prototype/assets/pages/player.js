import { getScene } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';
import { safeRequestFullscreen, showPrototypeToast } from '../shell.js';

const params = new URLSearchParams(location.search);
const scene = getScene(params.get('scene'));
const validHex = (value, fallback) => /^#[0-9A-F]{6}$/i.test(value || '') ? value : fallback;
const state = {
  scene: scene.id,
  primary: validHex(params.get('primary'), scene.colors[0]),
  secondary: validHex(params.get('secondary'), scene.colors[1]),
  speed: params.get('speed') || '.8',
  brightness: params.get('brightness') || '72',
  density: params.get('density') || 'adaptive',
  text: params.get('text') || scene.text || '',
};
const stage = document.querySelector('[data-player-stage]');
const renderer = createSceneRenderer(document.querySelector('[data-scene-canvas]'), { ...scene, colors: [state.primary, state.secondary] }, { speed: state.speed, brightness: Number(state.brightness) / 100, density: state.density, text: state.text, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
let playing = true;
let hideTimer;
const controls = [...document.querySelectorAll('[data-player-controls]')];
const query = new URLSearchParams(state).toString();

document.querySelector('[data-scene-name]').textContent = scene.title;
document.querySelector('[data-edit-scene]').href = `./create.html?${query}`;
document.querySelector('[data-remix-scene]').href = `./create.html?${query}`;

function revealControls() {
  controls.forEach((element) => element.removeAttribute('data-hidden'));
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!controls.some((element) => element.contains(document.activeElement))) controls.forEach((element) => element.setAttribute('data-hidden', ''));
  }, 4000);
}

for (const eventName of ['pointermove', 'pointerdown', 'keydown', 'focusin']) document.addEventListener(eventName, revealControls);
document.querySelector('[data-toggle-play]').addEventListener('click', (event) => {
  playing = !playing;
  if (playing) renderer.start(); else renderer.stop();
  event.currentTarget.textContent = playing ? 'Ⅱ' : '▶';
  event.currentTarget.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
});
document.querySelector('[data-fullscreen]').addEventListener('click', async () => {
  const success = await safeRequestFullscreen(stage);
  if (!success) showPrototypeToast('Fullscreen is unavailable in this browser.');
});
document.querySelector('[data-share-scene]').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); showPrototypeToast('Scene link copied.'); }
  catch { showPrototypeToast('Copy this page address to share the scene.'); }
});

renderer.start();
revealControls();

