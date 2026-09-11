import { createSettings, normalizeSettings } from './settings.js';

const STORAGE_KEY = 'cyber-lighting.settings.v1';
const root = document.documentElement;
const stage = document.querySelector('#stage');
const durationInput = document.querySelector('#duration');
const brightnessInput = document.querySelector('#brightness');
const colorInput = document.querySelector('#color');
const lowStimInput = document.querySelector('#low-stimulation');
const durationValue = document.querySelector('#duration-value');
const brightnessValue = document.querySelector('#brightness-value');
const colorValue = document.querySelector('#color-value');
const fullscreenButton = document.querySelector('#enter-fullscreen');
const stageButton = document.querySelector('#stage-fullscreen');
const fullscreenLabel = document.querySelector('#fullscreen-label');
const safetyNote = document.querySelector('#safety-note');

function loadSettings() {
  try {
    return normalizeSettings({ ...createSettings(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') });
  } catch {
    return createSettings();
  }
}

let settings = loadSettings();

function toRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function applySettings() {
  root.style.setProperty('--glow', settings.color);
  root.style.setProperty('--glow-rgb', toRgb(settings.color));
  root.style.setProperty('--intensity', String(settings.brightness / 100));
  root.style.setProperty('--breathe-duration', `${settings.duration}s`);

  durationInput.value = String(settings.duration);
  brightnessInput.value = String(settings.brightness);
  colorInput.value = settings.color;
  lowStimInput.checked = settings.lowStimulation;
  durationValue.textContent = `${settings.duration.toFixed(1)}s`;
  brightnessValue.textContent = `${settings.brightness}%`;
  colorValue.textContent = settings.color;
  safetyNote.textContent = settings.lowStimulation
    ? 'Low stimulation is on — speed and brightness are gently capped.'
    : 'Expanded intensity is on — use in a comfortable, well-lit space.';

  document.querySelectorAll('[data-color]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.color === settings.color);
  });
}

function updateSettings(next) {
  settings = normalizeSettings({ ...settings, ...next });
  saveSettings();
  applySettings();
}

function setFullscreenLabel() {
  const isFullscreen = document.fullscreenElement === stage;
  fullscreenLabel.textContent = isFullscreen ? 'Exit fullscreen' : 'Fill the screen';
  stageButton.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement === stage) {
      await document.exitFullscreen();
    } else {
      await stage.requestFullscreen();
    }
  } catch {
    fullscreenButton.textContent = 'Fullscreen unavailable';
  }
}

durationInput.addEventListener('input', (event) => updateSettings({ duration: event.target.value }));
brightnessInput.addEventListener('input', (event) => updateSettings({ brightness: event.target.value }));
colorInput.addEventListener('input', (event) => updateSettings({ color: event.target.value }));
lowStimInput.addEventListener('change', (event) => updateSettings({ lowStimulation: event.target.checked }));
fullscreenButton.addEventListener('click', toggleFullscreen);
stageButton.addEventListener('click', toggleFullscreen);
document.querySelectorAll('[data-color]').forEach((button) => {
  button.addEventListener('click', () => updateSettings({ color: button.dataset.color }));
});
document.addEventListener('fullscreenchange', setFullscreenLabel);

applySettings();
setFullscreenLabel();
