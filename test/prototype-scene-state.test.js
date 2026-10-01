import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSceneState, serializeSceneState } from '../prototype/assets/scene-state.js';

const scene = { id: 'aurora', colors: ['#071A18', '#71FFD2'], text: '' };

test('malformed shared scene parameters recover to safe catalog defaults', () => {
  assert.deepEqual(normalizeSceneState(new URLSearchParams('density=bogus&speed=nope&brightness=-4&primary=red'), scene), {
    scene: 'aurora', primary: '#071A18', secondary: '#71FFD2', speed: '0.8', brightness: '10', density: 'adaptive', text: '',
  });
});

test('serialized scene state round-trips supported custom density intent', () => {
  const state = normalizeSceneState(new URLSearchParams('density=custom&rows=220&columns=360&text=HELLO'), scene);
  assert.equal(serializeSceneState(state), 'scene=aurora&primary=%23071A18&secondary=%2371FFD2&speed=0.8&brightness=72&density=custom&text=HELLO&rows=220&columns=360');
});

