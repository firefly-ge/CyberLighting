const COPY = {
  en: { explore: 'Explore', create: 'Create', myScreens: 'My Screens', studio: 'Studio', rooms: 'Rooms', language: 'Language', createScreen: 'Create a screen', makeAlive: 'Make your screen alive.', productPrototype: 'Product prototype' },
  'zh-CN': { explore: '探索', create: '创作', myScreens: '我的画面', studio: '像素工作室', rooms: '多屏房间', language: '语言', createScreen: '创建一个画面', makeAlive: '让你的屏幕活起来。', productPrototype: '产品原型' },
  'zh-TW': { explore: '探索', create: '創作', myScreens: '我的畫面', studio: '像素工作室', rooms: '多螢幕房間', language: '語言', createScreen: '建立一個畫面', makeAlive: '讓你的螢幕活起來。', productPrototype: '產品原型' },
};

export function normalizePrototypeLocale(locale = '') {
  const value = String(locale).toLowerCase();
  if (value === 'zh-tw' || value === 'zh-hk' || value === 'zh-mo') return 'zh-TW';
  if (value === 'zh' || value === 'zh-cn' || value === 'zh-sg') return 'zh-CN';
  return 'en';
}

export function getPrototypeCopy(locale) {
  return COPY[normalizePrototypeLocale(locale)];
}

export function applyPrototypeLocale(locale) {
  const normalized = normalizePrototypeLocale(locale);
  const copy = getPrototypeCopy(normalized);
  document.documentElement.lang = normalized;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    if (copy[element.dataset.i18n]) element.textContent = copy[element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    if (copy[element.dataset.i18nAria]) element.setAttribute('aria-label', copy[element.dataset.i18nAria]);
  });
  return normalized;
}

