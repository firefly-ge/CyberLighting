const COPY = {
  en: { explore: 'Explore', create: 'Create', myScreens: 'My Screens', studio: 'Studio', rooms: 'Rooms', language: 'Language', createScreen: 'Create a screen', makeAlive: 'Make your screen alive.', productPrototype: 'Product prototype', findSignal: 'Find a signal for the moment.', makeYours: 'Make it yours.', liveScene: 'Live scene', pause: 'Pause', share: 'Share', remix: 'Remix this scene', localCollection: 'Local collection', pixelizeTitle: 'Drop an image into light.', localProcessing: 'Processed locally on this device.', chooseImage: 'Choose image', shapePixels: 'Shape the pixels.', advancedPreview: 'Advanced preview', preview: 'Preview', exit: 'Exit', multiScreen: 'Multi-screen concept', oneRoom: 'One room. Every screen.', createRoom: 'Create a room →' },
  'zh-CN': { explore: '探索', create: '创作', myScreens: '我的画面', studio: '像素工作室', rooms: '多屏房间', language: '语言', createScreen: '创建一个画面', makeAlive: '让你的屏幕活起来。', productPrototype: '产品原型', findSignal: '为此刻选择一种光。', makeYours: '把它变成你的。', liveScene: '动态画面', pause: '暂停', share: '分享', remix: '创作我的版本', localCollection: '本地作品集', pixelizeTitle: '把图片变成像素灯光。', localProcessing: '仅在当前设备本地处理。', chooseImage: '选择图片', shapePixels: '塑造像素效果。', advancedPreview: '高级功能预览', preview: '预览', exit: '退出', multiScreen: '多屏概念预览', oneRoom: '一个房间，所有屏幕。', createRoom: '创建房间 →' },
  'zh-TW': { explore: '探索', create: '創作', myScreens: '我的畫面', studio: '像素工作室', rooms: '多螢幕房間', language: '語言', createScreen: '建立一個畫面', makeAlive: '讓你的螢幕活起來。', productPrototype: '產品原型', findSignal: '為此刻選擇一種光。', makeYours: '把它變成你的。', liveScene: '動態畫面', pause: '暫停', share: '分享', remix: '創作我的版本', localCollection: '本機作品集', pixelizeTitle: '把圖片變成像素燈光。', localProcessing: '僅在目前裝置本機處理。', chooseImage: '選擇圖片', shapePixels: '塑造像素效果。', advancedPreview: '進階功能預覽', preview: '預覽', exit: '退出', multiScreen: '多螢幕概念預覽', oneRoom: '一個房間，所有螢幕。', createRoom: '建立房間 →' },
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
