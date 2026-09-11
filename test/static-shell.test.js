import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('loads the stylesheet directly for a static-hosted preview', async () => {
  const document = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(document, /<link rel="stylesheet" href="\/src\/styles\.css"\s*\/>/);
});
