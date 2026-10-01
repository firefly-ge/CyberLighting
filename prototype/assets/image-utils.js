export function validateImageFile(file) {
  if (!file) return 'Choose an image file first.';
  if (!/^image\/(png|jpeg|gif|webp|avif|bmp)$/i.test(file.type || '')) return 'That file is not a supported image.';
  return '';
}

