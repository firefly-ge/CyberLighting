import { createSettings, normalizeSettings } from './settings.js';
import { DEFAULT_LOCALE, getCopy, normalizeLocale } from './i18n.js';

const STORAGE_KEY = 'cyber-lighting.settings.v1';
const LOCALE_KEY = 'cyber-lighting.locale.v1';
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
const description = document.querySelector('meta[name="description"]');
const localeSelect = document.querySelector('#locale-select');

function loadSettings() {
  try {
    return normalizeSettings({ ...createSettings(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') });
  } catch {
    return createSettings();
  }
}

let settings = loadSettings();
let locale = normalizeLocale(localStorage.getItem(LOCALE_KEY) ?? navigator.language ?? DEFAULT_LOCALE);

function applyLocale() {
  const copy = getCopy(locale);
  document.documentElement.lang = locale;
  document.title = copy.pageTitle;
  description.setAttribute('content', copy.pageDescription);
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = copy[element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', copy[element.dataset.i18nAria]);
  });
  localeSelect.value = locale;
  setFullscreenLabel();
  applySettings();
}

function setLocale(nextLocale) {
  locale = normalizeLocale(nextLocale);
  localStorage.setItem(LOCALE_KEY, locale);
  applyLocale();
}

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
  const copy = getCopy(locale);
  safetyNote.textContent = settings.lowStimulation ? copy.lowStimOn : copy.lowStimOff;

}

function updateSettings(next) {
  settings = normalizeSettings({ ...settings, ...next });
  saveSettings();
  applySettings();
}

function setFullscreenLabel() {
  const copy = getCopy(locale);
  const isFullscreen = document.fullscreenElement === stage;
  fullscreenLabel.textContent = isFullscreen ? copy.exitFullscreen : copy.fillScreen;
  stageButton.setAttribute('aria-label', isFullscreen ? copy.exitFullscreenAria : copy.enterFullscreenAria);
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement === stage) {
      await document.exitFullscreen();
    } else {
      await stage.requestFullscreen();
    }
  } catch {
    fullscreenButton.textContent = getCopy(locale).fullscreenUnavailable;
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
localeSelect.addEventListener('change', (event) => setLocale(event.target.value));

applySettings();
applyLocale();
setFullscreenLabel();
requestAnimationFrame(renderPureColour);
