import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_LOCALE, getCopy, normalizeLocale } from '../src/i18n.js';

test('defaults to English and accepts Chinese as a supported locale', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(normalizeLocale('zh-CN'), 'zh');
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('fr'), 'en');
});

test('returns complete Chinese copy for the breathing-light controls', () => {
  const copy = getCopy('zh');
  assert.equal(copy.heroTitle, '让闲置的屏幕呼吸。');
  assert.equal(copy.inhale, '吸气色');
  assert.equal(copy.exhale, '呼气色');
  assert.equal(copy.enterLightMode, '进入灯光模式');
});
