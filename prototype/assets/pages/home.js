import { getScene } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';

const canvas = document.querySelector('[data-scene-canvas]');
if (canvas) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  createSceneRenderer(canvas, getScene('heart'), { density: 'balanced', speed: .72, reducedMotion }).start();
}

