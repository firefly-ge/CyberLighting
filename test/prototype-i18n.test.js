import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrototypeLocale, getPrototypeCopy } from '../prototype/assets/i18n.js';

test('prototype locale normalization covers all supported Chinese variants', () => {
  assert.equal(normalizePrototypeLocale('zh-HK'), 'zh-TW');
  assert.equal(normalizePrototypeLocale('zh-SG'), 'zh-CN');
  assert.equal(normalizePrototypeLocale('de-DE'), 'en');
});

test('prototype copy translates shared navigation and primary actions', () => {
  assert.equal(getPrototypeCopy('zh-CN').explore, '探索');
  assert.equal(getPrototypeCopy('zh-TW').myScreens, '我的畫面');
  assert.equal(getPrototypeCopy('en').create, 'Create');
});
