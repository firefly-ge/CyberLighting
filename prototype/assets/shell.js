const LOCALE_KEY = 'cyberlighting.prototype.locale';

export function showPrototypeToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showPrototypeToast.timer);
  showPrototypeToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2200);
}

export async function safeRequestFullscreen(element) {
  if (!element?.requestFullscreen) return false;
  try {
    await element.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export function initShell() {
  const select = document.querySelector('[data-locale-select]');
  const stored = localStorage.getItem(LOCALE_KEY) || 'en';
  document.documentElement.lang = stored;
  if (select) select.value = stored;
  select?.addEventListener('change', () => {
    localStorage.setItem(LOCALE_KEY, select.value);
    document.documentElement.lang = select.value;
  });

  const menu = document.querySelector('[data-mobile-menu]');
  const navigation = document.querySelector('[data-navigation]');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    navigation?.toggleAttribute('data-open', !open);
  });
}

initShell();

