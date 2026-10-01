import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const PAGES = ['index.html', 'explore.html', 'create.html', 'player.html', 'library.html', 'pixelize.html', 'studio.html', 'rooms.html'];

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

test('advanced pages communicate editor and room concepts', async () => {
  const studio = await readFile(new URL('../prototype/studio.html', import.meta.url), 'utf8');
  const rooms = await readFile(new URL('../prototype/rooms.html', import.meta.url), 'utf8');
  assert.match(studio, /data-tool="brush"/);
  assert.match(studio, /data-layer-list/);
  assert.match(studio, /data-density-mode/);
  assert.match(rooms, /data-room-code/);
  assert.match(rooms, /data-device-list/);
  assert.match(rooms, /Create a room/);
});

test('every prototype page has landmarks, locale control, title, and live feedback', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(`../prototype/${page}`, import.meta.url), 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<main/);
    assert.match(html, /data-locale-select/);
    assert.match(html, /data-toast/);
  }
});

test('all internal prototype page links resolve to files', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(`../prototype/${page}`, import.meta.url), 'utf8');
    for (const match of html.matchAll(/href="\.\/([^"?#]+\.html)/g)) {
      await access(new URL(`../prototype/${match[1]}`, import.meta.url));
    }
  }
});

test('homepage exposes every advanced prototype experience', async () => {
  const html = await readFile(new URL('../prototype/index.html', import.meta.url), 'utf8');
  for (const page of ['pixelize.html', 'studio.html', 'rooms.html']) assert.match(html, new RegExp(`href="\\./${page}"`));
});

test('all pages bind visible copy to the shared locale system', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(`../prototype/${page}`, import.meta.url), 'utf8');
    assert.equal((html.match(/data-i18n=/g) || []).length >= 3, true, `${page} needs shared translations`);
  }
});

test('image chooser remains keyboard focusable', async () => {
  const html = await readFile(new URL('../prototype/pixelize.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /type="file"[^>]+hidden/);
  assert.match(html, /type="file"[^>]+class="sr-only"/);
});
