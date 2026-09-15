import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_LOCALE, getCopy, normalizeLocale } from '../src/i18n.js';

test('defaults to English and recognizes English, simplified, and traditional Chinese', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
  assert.equal(normalizeLocale('zh'), 'zh-CN');
  assert.equal(normalizeLocale('zh-CN'), 'zh-CN');
  assert.equal(normalizeLocale('zh-SG'), 'zh-CN');
  assert.equal(normalizeLocale('zh-TW'), 'zh-TW');
  assert.equal(normalizeLocale('zh-HK'), 'zh-TW');
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('fr'), 'en');
});

test('returns complete simplified Chinese copy for the breathing-light controls', () => {
  const copy = getCopy('zh-CN');
  assert.equal(copy.heroTitle, '让闲置的屏幕呼吸。');
  assert.equal(copy.inhale, '吸气色');
  assert.equal(copy.exhale, '呼气色');
  assert.equal(copy.enterLightMode, '进入灯光模式');
  assert.equal(copy.language, '语言');
});

test('returns traditional Chinese copy for the breathing-light controls', () => {
  const copy = getCopy('zh-TW');
  assert.equal(copy.heroTitle, '讓閒置的螢幕呼吸。');
  assert.equal(copy.inhale, '吸氣色');
  assert.equal(copy.exhale, '呼氣色');
  assert.equal(copy.enterLightMode, '進入燈光模式');
  assert.equal(copy.language, '語言');
});
