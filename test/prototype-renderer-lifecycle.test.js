import test from 'node:test';
import assert from 'node:assert/strict';
import { blendWithBrightness, createSceneRenderer } from '../prototype/assets/renderer.js';

test('brightness scales the final color for every renderer engine', () => {
  assert.deepEqual(blendWithBrightness([100, 50, 0], [200, 100, 50], .5, .5), [75, 38, 13]);
  assert.notDeepEqual(blendWithBrightness([100, 50, 0], [200, 100, 50], .5, .1), blendWithBrightness([100, 50, 0], [200, 100, 50], .5, 1));
});

test('renderer resizes after attachment, preserves manual pause, and destroys observers', () => {
  const original = { window: globalThis.window, document: globalThis.document, ResizeObserver: globalThis.ResizeObserver, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
  let rect = { width: 1, height: 1 };
  let observerCallback;
  let disconnected = false;
  let rafCount = 0;
  const documentHandlers = new Map();
  const windowHandlers = new Map();
  globalThis.window = { devicePixelRatio: 1, addEventListener: (name, fn) => windowHandlers.set(name, fn), removeEventListener: (name) => windowHandlers.delete(name) };
  globalThis.document = { hidden: false, addEventListener: (name, fn) => documentHandlers.set(name, fn), removeEventListener: (name) => documentHandlers.delete(name) };
  globalThis.ResizeObserver = class { constructor(callback) { observerCallback = callback; } observe() {} disconnect() { disconnected = true; } };
  globalThis.requestAnimationFrame = () => ++rafCount;
  globalThis.cancelAnimationFrame = () => {};
  const context = { fillStyle: '', fillRect() {}, setTransform() {} };
  const canvas = { width: 0, height: 0, getContext: () => context, getBoundingClientRect: () => rect };
  try {
    const renderer = createSceneRenderer(canvas, { engine: 'breathe', colors: ['#000000', '#FFFFFF'] });
    rect = { width: 320, height: 180 };
    observerCallback();
    assert.equal(canvas.width, 320);
    assert.equal(canvas.height, 180);
    renderer.start();
    renderer.stop();
    const pausedAt = rafCount;
    globalThis.document.hidden = true;
    documentHandlers.get('visibilitychange')();
    globalThis.document.hidden = false;
    documentHandlers.get('visibilitychange')();
    assert.equal(rafCount, pausedAt);
    renderer.destroy();
    assert.equal(disconnected, true);
    assert.equal(documentHandlers.has('visibilitychange'), false);
    assert.equal(windowHandlers.has('resize'), false);
  } finally {
    Object.assign(globalThis, original);
  }
});

