import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('prototype landing page loads relative shared assets and exposes primary navigation', async () => {
  const html = await readFile(new URL('../prototype/index.html', import.meta.url), 'utf8');
  assert.match(html, /href="\.\/assets\/prototype\.css"/);
  assert.match(html, /src="\.\/assets\/shell\.js"/);
  for (const href of ['./explore.html', './create.html', './library.html']) {
    assert.match(html, new RegExp(`href="${href.replace('.', '\\.')}"`));
  }
  assert.match(html, /data-locale-select/);
  assert.match(html, /data-primary-action/);
});

test('explore page exposes filters and reusable template actions', async () => {
  const html = await readFile(new URL('../prototype/explore.html', import.meta.url), 'utf8');
  assert.match(html, /data-category-filters/);
  assert.match(html, /data-template-grid/);
  assert.match(html, /data-template-card/);
  assert.match(html, /Use template/);
  assert.match(html, /Fullscreen/);
});

test('create page exposes the quick customization contract', async () => {
  const html = await readFile(new URL('../prototype/create.html', import.meta.url), 'utf8');
  for (const control of ['primary', 'secondary', 'speed', 'brightness', 'density']) {
    assert.match(html, new RegExp(`name="${control}"`));
  }
  assert.match(html, /data-save-scene/);
  assert.match(html, /data-open-player/);
});

test('player has an accessible auto-hiding control surface', async () => {
  const html = await readFile(new URL('../prototype/player.html', import.meta.url), 'utf8');
  assert.match(html, /data-player-controls/);
  assert.match(html, /aria-label="Pause animation"/);
  assert.match(html, /data-share-scene/);
  assert.match(html, /Remix this scene/);
});

test('library and pixelize pages expose their primary states', async () => {
  const library = await readFile(new URL('../prototype/library.html', import.meta.url), 'utf8');
  const pixelize = await readFile(new URL('../prototype/pixelize.html', import.meta.url), 'utf8');
  assert.match(library, /data-library-grid/);
  assert.match(library, /data-library-empty/);
  assert.match(pixelize, /type="file"[^>]+accept="image\/\*"/);
  assert.match(pixelize, /data-density-mode/);
  assert.match(pixelize, /data-pixel-preview/);
});
