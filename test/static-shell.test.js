import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('loads the stylesheet directly for a static-hosted preview', async () => {
  const document = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(document, /<link rel="stylesheet" href="\/src\/styles\.css"\s*\/>/);
});

test('uses a single stage surface with no composited colour or texture layers', async () => {
  const document = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(document, /light-field/);
  assert.doesNotMatch(document, /precision-grid/);
});
