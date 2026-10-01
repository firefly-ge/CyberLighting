import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRenderOptions } from '../prototype/assets/renderer.js';

test('renderer falls back safely without fixing a maximum grid size', () => {
  assert.deepEqual(normalizeRenderOptions({ density: 'unknown', speed: -4 }), {
    density: 'adaptive', speed: 0.6, brightness: 0.72, reducedMotion: false,
  });
});

test('renderer accepts custom density and clamps unsafe numeric controls', () => {
  assert.deepEqual(normalizeRenderOptions({ density: 'custom', speed: 12, brightness: -1, reducedMotion: true }), {
    density: 'custom', speed: 2.4, brightness: 0.1, reducedMotion: true,
  });
});
