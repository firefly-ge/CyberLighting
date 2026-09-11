import test from 'node:test';
import assert from 'node:assert/strict';

import { createSettings, normalizeSettings } from '../src/settings.js';

test('creates a calm default breathing-light scene', () => {
  assert.deepEqual(createSettings(), {
    inhaleColor: '#0D2C32',
    exhaleColor: '#72F3D0',
    brightness: 72,
    duration: 5,
    lowStimulation: true,
  });
});

test('clamps a custom scene to safe brightness and breathing limits', () => {
  assert.deepEqual(
    normalizeSettings({
      inhaleColor: '#041118',
      exhaleColor: '#f2613c',
      brightness: 140,
      duration: 0.4,
      lowStimulation: true,
    }),
    {
      inhaleColor: '#041118',
      exhaleColor: '#F2613C',
      brightness: 82,
      duration: 2.5,
      lowStimulation: true,
    },
  );
});

test('falls back independently when either endpoint colour is invalid', () => {
  assert.deepEqual(
    normalizeSettings({ inhaleColor: 'not-a-colour', exhaleColor: '#6dcaff' }),
    {
      inhaleColor: '#0D2C32',
      exhaleColor: '#6DCAFF',
      brightness: 72,
      duration: 5,
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
