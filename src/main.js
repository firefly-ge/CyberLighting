import { createSettings, normalizeSettings } from './settings.js';

const STORAGE_KEY = 'cyber-lighting.settings.v1';
const root = document.documentElement;
const stage = document.querySelector('#stage');
const durationInput = document.querySelector('#duration');
const brightnessInput = document.querySelector('#brightness');
const inhaleInput = document.querySelector('#inhale-color');
const exhaleInput = document.querySelector('#exhale-color');
const lowStimInput = document.querySelector('#low-stimulation');
const durationValue = document.querySelector('#duration-value');
const brightnessValue = document.querySelector('#brightness-value');
const inhaleValue = document.querySelector('#inhale-value');
const exhaleValue = document.querySelector('#exhale-value');
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
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function blendChannel(start, end, progress) {
  return Math.round((start + (end - start) * progress) * (.25 + settings.brightness / 100 * .75));
}

function renderPureColour(timestamp) {
  const halfCycle = settings.duration * 1000;
  const progress = (1 - Math.cos(Math.PI * (timestamp / halfCycle))) / 2;
  const inhale = toRgb(settings.inhaleColor);
  const exhale = toRgb(settings.exhaleColor);
  stage.style.backgroundColor = `rgb(${blendChannel(inhale[0], exhale[0], progress)} ${blendChannel(inhale[1], exhale[1], progress)} ${blendChannel(inhale[2], exhale[2], progress)})`;
  requestAnimationFrame(renderPureColour);
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function applySettings() {
  root.style.setProperty('--inhale-color', settings.inhaleColor);
  root.style.setProperty('--exhale-color', settings.exhaleColor);
  root.style.setProperty('--accent', settings.exhaleColor);
  root.style.setProperty('--intensity', String(settings.brightness / 100));
  root.style.setProperty('--breathe-duration', `${settings.duration}s`);

  durationInput.value = String(settings.duration);
  brightnessInput.value = String(settings.brightness);
  inhaleInput.value = settings.inhaleColor;
  exhaleInput.value = settings.exhaleColor;
  lowStimInput.checked = settings.lowStimulation;
  durationValue.textContent = `${settings.duration.toFixed(1)}s`;
  brightnessValue.textContent = `${settings.brightness}%`;
  inhaleValue.textContent = settings.inhaleColor;
  exhaleValue.textContent = settings.exhaleColor;
  safetyNote.textContent = settings.lowStimulation
    ? 'Low stimulation is on — speed and brightness are gently capped.'
    : 'Expanded intensity is on — use in a comfortable, well-lit space.';

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
inhaleInput.addEventListener('input', (event) => updateSettings({ inhaleColor: event.target.value }));
exhaleInput.addEventListener('input', (event) => updateSettings({ exhaleColor: event.target.value }));
lowStimInput.addEventListener('change', (event) => updateSettings({ lowStimulation: event.target.checked }));
fullscreenButton.addEventListener('click', toggleFullscreen);
stageButton.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', setFullscreenLabel);

applySettings();
setFullscreenLabel();
requestAnimationFrame(renderPureColour);
