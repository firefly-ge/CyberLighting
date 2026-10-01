import { getScene } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';
import { safeRequestFullscreen, showPrototypeToast } from '../shell.js';
import { normalizeSceneState, serializeSceneState } from '../scene-state.js';

const params = new URLSearchParams(location.search);
const scene = getScene(params.get('scene'));
const state = normalizeSceneState(params, scene);
const stage = document.querySelector('[data-player-stage]');
const renderer = createSceneRenderer(document.querySelector('[data-scene-canvas]'), { ...scene, colors: [state.primary, state.secondary] }, { speed: state.speed, brightness: Number(state.brightness) / 100, density: state.density, text: state.text, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
let playing = true;
let hideTimer;
const controls = [...document.querySelectorAll('[data-player-controls]')];
const query = serializeSceneState(state);

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
