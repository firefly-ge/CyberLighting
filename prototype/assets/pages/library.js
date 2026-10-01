import { getScene } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';
import { showPrototypeToast } from '../shell.js';

const STORAGE_KEY = 'cyberlighting.prototype.scenes';
const samples = [
  { scene: 'heart', title: 'Heart Signal / sample', primary: '#18050A', secondary: '#FF476F', density: 'balanced', speed: '.8', brightness: '72' },
  { scene: 'aurora', title: 'Electric Aurora / sample', primary: '#071A18', secondary: '#71FFD2', density: 'coarse', speed: '.7', brightness: '72' },
  { scene: 'starting-soon', title: 'Starting Soon / sample', primary: '#090B12', secondary: '#61E7FF', density: 'adaptive', speed: '.8', brightness: '72', text: 'STARTING SOON' },
];
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let entries = [...saved, ...samples];
const grid = document.querySelector('[data-library-grid]');
const empty = document.querySelector('[data-library-empty]');

function queryFor(entry) { return new URLSearchParams(entry).toString(); }

function render() {
  grid.replaceChildren(...entries.map((entry, index) => {
    const scene = getScene(entry.scene);
    const card = document.createElement('article');
    card.className = 'saved-card panel';
    card.innerHTML = `<div class="saved-visual"><canvas aria-label="${entry.title}"></canvas></div><div class="saved-copy"><span class="micro-label">${saved.includes(entry) ? 'Saved locally' : 'Example scene'}</span><h2>${entry.title}</h2><div class="saved-actions"><a href="./player.html?${queryFor(entry)}">Play</a><a href="./create.html?${queryFor(entry)}">Edit</a><button type="button" data-duplicate>Duplicate</button><button type="button" data-delete>Delete</button></div></div>`;
    createSceneRenderer(card.querySelector('canvas'), { ...scene, colors: [entry.primary, entry.secondary] }, { density: entry.density, speed: entry.speed, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, text: entry.text }).start();
    card.querySelector('[data-duplicate]').addEventListener('click', () => { entries.splice(index + 1, 0, { ...entry, title: `${entry.title} copy` }); showPrototypeToast('Prototype copy created.'); render(); });
    card.querySelector('[data-delete]').addEventListener('click', () => { entries.splice(index, 1); showPrototypeToast('Removed from this prototype view.'); render(); });
    return card;
  }));
  empty.hidden = entries.length > 0;
}
render();

