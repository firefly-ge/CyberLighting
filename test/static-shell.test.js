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

test('uses one language select with English, simplified Chinese, and traditional Chinese', async () => {
  const document = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const script = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

  assert.match(document, /<label class="language-switch" for="locale-select">/);
  assert.match(document, /<select id="locale-select"[^>]*data-locale-select/);
  assert.match(document, /<option value="en">English<\/option>/);
  assert.match(document, /<option value="zh-CN">简体中文<\/option>/);
  assert.match(document, /<option value="zh-TW">繁體中文<\/option>/);
  assert.match(script, /localeSelect\.value = locale/);
  assert.match(script, /localeSelect\.addEventListener\('change'/);
});

test('uses Chinese-specific typography rules for Chinese locales', async () => {
  const stylesheet = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(stylesheet, /html\[lang\^='zh'\]/);
});

test('includes a local-only photo-to-pixel-light demo', async () => {
  const demo = await readFile(new URL('../pixel-demo.html', import.meta.url), 'utf8');

  assert.match(demo, /id="image-upload" type="file" accept="image\/\*"/);
  assert.match(demo, /id="pixel-canvas"/);
  assert.match(demo, /name="grid-size"/);
  assert.match(demo, /FileReader/);
  assert.match(demo, /localStorage/);
});

test('includes a looping pixel heart animation demo', async () => {
  const demo = await readFile(new URL('../heart-demo.html', import.meta.url), 'utf8');

  assert.match(demo, /id="heart-canvas"/);
  assert.match(demo, /requestAnimationFrame/);
  assert.match(demo, /function heartDistance/);
  assert.match(demo, /const GRID_SIZE = 28/);
  assert.match(demo, /const scale = \.96;/);
  assert.match(demo, /draw\(0\);/);
  assert.match(demo, /const cellTempo = 1\.2 \+ \(\(column \* 13 \+ row \* 7\) % 9\) \* \.08;/);
  assert.match(demo, /const cellPulse = \(Math\.sin\(seconds \* cellTempo \* 2\.4 \+ cellPhase\) \+ 1\) \/ 2;/);
  assert.match(demo, /const brightness = inside \? \.2 \+ cellPulse \* \.8 : \.05/);
});
