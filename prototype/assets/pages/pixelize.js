import { showPrototypeToast } from '../shell.js';

const input = document.querySelector('[data-image-upload]');
const canvas = document.querySelector('[data-pixel-preview] canvas');
const context = canvas.getContext('2d');
const prompt = document.querySelector('[data-upload-prompt]');
const readout = document.querySelector('[data-pixel-readout]');
const custom = document.querySelector('[data-pixel-custom]');
let image = null;
let density = 'auto';

function targetColumns(width) {
  if (density === 'bold') return 24;
  if (density === 'balanced') return 52;
  if (density === 'fine') return 104;
  if (density === 'custom') return Math.max(1, Number(document.querySelector('[data-columns]').value) || 1);
  return Math.max(28, Math.round(width / 12));
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));
  context.fillStyle = '#060808'; context.fillRect(0, 0, canvas.width, canvas.height);
  if (!image) return;
  const columns = targetColumns(canvas.width);
  const rows = density === 'custom' ? Math.max(1, Number(document.querySelector('[data-rows]').value) || 1) : Math.max(1, Math.round(columns * canvas.height / canvas.width));
  const sample = document.createElement('canvas'); sample.width = columns; sample.height = rows;
  sample.getContext('2d').drawImage(image, 0, 0, columns, rows);
  context.imageSmoothingEnabled = false;
  context.drawImage(sample, 0, 0, canvas.width, canvas.height);
  readout.textContent = `${density === 'auto' ? 'Auto fit' : density} / ${columns} × ${rows} preview`;
}

input.addEventListener('change', () => {
  const file = input.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => { const next = new Image(); next.onload = () => { image = next; prompt.hidden = true; draw(); }; next.src = reader.result; });
  reader.readAsDataURL(file);
});
document.querySelectorAll('[data-density]').forEach((button) => button.addEventListener('click', () => {
  density = button.dataset.density;
  document.querySelectorAll('[data-density]').forEach((item) => item.toggleAttribute('data-active', item === button));
  custom.hidden = density !== 'custom'; draw();
}));
custom.addEventListener('input', draw);
document.querySelector('[data-reset-image]').addEventListener('click', () => { image = null; input.value = ''; prompt.hidden = false; readout.textContent = 'Auto density / awaiting image'; draw(); });
document.querySelector('[data-pixel-continue]').addEventListener('click', () => showPrototypeToast('Static preview: this would open Quick Create.'));
window.addEventListener('resize', draw);
draw();

