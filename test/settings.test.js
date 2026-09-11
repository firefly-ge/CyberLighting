import test from 'node:test';
import assert from 'node:assert/strict';

import { createSettings, normalizeSettings } from '../src/settings.js';

test('creates a calm default breathing-light scene', () => {
  assert.deepEqual(createSettings(), {
    color: '#7CFFB2',
    brightness: 72,
    duration: 5,
    lowStimulation: true,
  });
});

test('clamps a custom scene to safe brightness and breathing limits', () => {
  assert.deepEqual(
    normalizeSettings({
      color: '#f2613c',
      brightness: 140,
      duration: 0.4,
      lowStimulation: true,
    }),
    {
      color: '#F2613C',
      brightness: 82,
      duration: 2.5,
      lowStimulation: true,
    },
  );
});

test('permits a faster cycle only when low-stimulation mode is off', () => {
  assert.equal(
    normalizeSettings({ duration: 0.4, lowStimulation: false }).duration,
    1.2,
  );
});
