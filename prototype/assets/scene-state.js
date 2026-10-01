const DENSITIES = new Set(['adaptive', 'coarse', 'balanced', 'fine', 'custom']);

function clampNumber(value, min, max, fallback) {
  if (value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function validColor(value, fallback) {
  return /^#[0-9A-F]{6}$/i.test(value || '') ? value.toUpperCase() : fallback.toUpperCase();
}

export function normalizeSceneState(params, scene) {
  const density = DENSITIES.has(params.get('density')) ? params.get('density') : 'adaptive';
  const state = {
    scene: scene.id,
    primary: validColor(params.get('primary'), scene.colors[0]),
    secondary: validColor(params.get('secondary'), scene.colors[1]),
    speed: clampNumber(params.get('speed'), .6, 2.4, .8).toFixed(1),
    brightness: String(Math.round(clampNumber(params.get('brightness'), 10, 100, 72))),
    density,
    text: String(params.get('text') || scene.text || '').slice(0, 40),
  };
  if (density === 'custom') {
    state.rows = String(Math.max(1, Math.round(clampNumber(params.get('rows'), 1, 100000, 120))));
    state.columns = String(Math.max(1, Math.round(clampNumber(params.get('columns'), 1, 100000, 200))));
  }
  return state;
}

export function serializeSceneState(state) {
  const entries = ['scene', 'primary', 'secondary', 'speed', 'brightness', 'density', 'text'];
  if (state.density === 'custom') entries.push('rows', 'columns');
  const params = new URLSearchParams();
  entries.forEach((key) => params.set(key, state[key] ?? ''));
  return params.toString();
}
