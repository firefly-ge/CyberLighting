import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImageFile } from '../prototype/assets/image-utils.js';

test('image upload validation rejects missing and unsupported files with readable feedback', () => {
  assert.equal(validateImageFile(null), 'Choose an image file first.');
  assert.equal(validateImageFile({ type: 'text/plain', size: 20 }), 'That file is not a supported image.');
  assert.equal(validateImageFile({ type: 'image/png', size: 1024 }), '');
});

