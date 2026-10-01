import { SCENES, getCategories } from '../catalog.js';
import { createSceneRenderer } from '../renderer.js';

const filters = document.querySelector('[data-category-filters]');
const grid = document.querySelector('[data-template-grid]');
const params = new URLSearchParams(location.search);
let activeCategory = params.get('category') || 'all';
let activeCards = [];

function makeFilter(category) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'filter-chip';
  button.textContent = category === 'all' ? 'All scenes' : category;
  button.toggleAttribute('data-active', category === activeCategory);
  button.addEventListener('click', () => {
    activeCategory = category;
    const url = new URL(location.href);
    if (category === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', category);
    history.replaceState({}, '', url);
    renderCatalog();
  });
  return button;
}

function renderCatalog() {
  activeCards.forEach(({ renderer, observer }) => { observer.disconnect(); renderer.destroy(); });
  activeCards = [];
  filters.replaceChildren(...['all', ...getCategories()].map(makeFilter));
  const scenes = activeCategory === 'all' ? SCENES : SCENES.filter((scene) => scene.category === activeCategory);
  const cards = scenes.map((scene, index) => {
    const card = document.createElement('article');
    card.className = 'template-card panel';
    card.dataset.templateCard = '';
    card.innerHTML = `
      <div class="template-visual"><canvas aria-label="${scene.title} animated preview"></canvas><span>${String(index + 1).padStart(2, '0')} / ${scene.category}</span></div>
      <div class="template-copy"><div><h2>${scene.title}</h2><p>${scene.description}</p></div><div class="template-actions"><a class="button button-small" href="./create.html?scene=${scene.id}">Use template</a><a class="text-link" href="./player.html?scene=${scene.id}">Fullscreen ↗</a></div></div>`;
    return { card, scene };
  });
  grid.replaceChildren(...cards.map(({ card }) => card));
  cards.forEach(({ card, scene }) => {
    const canvas = card.querySelector('canvas');
    const renderer = createSceneRenderer(canvas, scene, { density: 'coarse', speed: .72, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches });
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? renderer.start() : renderer.stop(), { rootMargin: '80px' });
    observer.observe(card);
    activeCards.push({ renderer, observer });
  });
}

renderCatalog();
