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
