export const DEFAULT_SETTINGS = Object.freeze({
  inhaleColor: '#0D2C32',
  exhaleColor: '#72F3D0',
  brightness: 72,
  duration: 5,
  lowStimulation: true,
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function normalizeColor(value) {
  return /^#[0-9a-f]{6}$/i.test(value ?? '') ? value.toUpperCase() : null;
}

export function createSettings() {
  return { ...DEFAULT_SETTINGS };
}

export function normalizeSettings(input = {}) {
  const lowStimulation = input.lowStimulation ?? DEFAULT_SETTINGS.lowStimulation;
  const minDuration = lowStimulation ? 2.5 : 1.2;
  const maxBrightness = lowStimulation ? 82 : 100;

  return {
    inhaleColor: normalizeColor(input.inhaleColor) ?? DEFAULT_SETTINGS.inhaleColor,
    exhaleColor: normalizeColor(input.exhaleColor) ?? DEFAULT_SETTINGS.exhaleColor,
    brightness: Math.round(clamp(Number(input.brightness ?? DEFAULT_SETTINGS.brightness), 10, maxBrightness)),
    duration: Number(clamp(Number(input.duration ?? DEFAULT_SETTINGS.duration), minDuration, 12).toFixed(1)),
    lowStimulation: Boolean(lowStimulation),
  };
}
