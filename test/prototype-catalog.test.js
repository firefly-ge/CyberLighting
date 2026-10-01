import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, getScene } from '../prototype/assets/catalog.js';

test('catalog covers launch categories and every scene has two valid colors', () => {
  const categories = new Set(SCENES.map((scene) => scene.category));
  for (const expected of ['love', 'ambient', 'party', 'focus', 'stream', 'text']) {
    assert.equal(categories.has(expected), true);
  }
  assert.equal(SCENES.length >= 12, true);
  assert.equal(SCENES.every((scene) => /^#[0-9A-F]{6}$/i.test(scene.colors[0]) && /^#[0-9A-F]{6}$/i.test(scene.colors[1])), true);
});

test('catalog returns the heart scene when a requested scene is missing', () => {
  assert.equal(getScene('missing').id, 'heart');
});

