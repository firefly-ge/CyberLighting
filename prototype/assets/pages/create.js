import { getScene } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';
import { showPrototypeToast } from '../shell.js';

const STORAGE_KEY = 'cyberlighting.prototype.scenes';
const form = document.querySelector('[data-create-form]');
const params = new URLSearchParams(location.search);
const scene = getScene(params.get('scene'));
const state = {
  scene: scene.id,
  primary: params.get('primary') || scene.colors[0],
  secondary: params.get('secondary') || scene.colors[1],
  speed: params.get('speed') || '.8',
  brightness: params.get('brightness') || '72',
  density: params.get('density') || 'adaptive',
  text: params.get('text') || scene.text || '',
};

for (const [name, value] of Object.entries(state)) if (form.elements[name]) form.elements[name].value = value;
document.querySelector('[data-scene-title]').textContent = scene.title;
document.querySelector('[data-text-control]').hidden = scene.engine !== 'text';
const renderer = createSceneRenderer(document.querySelector('[data-scene-canvas]'), { ...scene, colors: [state.primary, state.secondary] }, { speed: state.speed, brightness: Number(state.brightness) / 100, density: state.density, text: state.text, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
renderer.start();

function sync() {
  Object.assign(state, Object.fromEntries(new FormData(form).entries()));
  document.querySelector('[data-speed-output]').textContent = `${Number(state.speed).toFixed(1)}×`;
  document.querySelector('[data-brightness-output]').textContent = `${state.brightness}%`;
  document.querySelector('[data-custom-density]').hidden = state.density !== 'custom';
  document.querySelector('[data-resolution-readout]').textContent = state.density === 'custom' ? `Custom intent / ${form.elements.columns.value} × ${form.elements.rows.value}` : `${form.elements.density.selectedOptions[0].text} / live viewport`;
  renderer.update({ ...scene, colors: [state.primary, state.secondary] }, { speed: state.speed, brightness: Number(state.brightness) / 100, density: state.density, text: state.text });
  const query = new URLSearchParams(state);
  document.querySelector('[data-open-player]').href = `./player.html?${query}`;
}

form.addEventListener('input', sync);
form.addEventListener('change', sync);
document.querySelector('[data-save-scene]').addEventListener('click', () => {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  stored.unshift({ ...state, title: `${scene.title} / ${new Date().toLocaleDateString()}`, savedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(0, 12)));
  showPrototypeToast('Saved locally to My Screens.');
});
sync();

