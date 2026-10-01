const DENSITIES = new Set(['adaptive', 'coarse', 'balanced', 'fine', 'custom']);

function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function normalizeRenderOptions(input = {}) {
  return {
    density: DENSITIES.has(input.density) ? input.density : 'adaptive',
    speed: clamp(input.speed, 0.6, 2.4, 0.6),
    brightness: clamp(input.brightness, 0.1, 1, 0.72),
    reducedMotion: Boolean(input.reducedMotion),
  };
}

function hexToRgb(hex) {
  const safe = /^#[0-9a-f]{6}$/i.test(hex) ? hex : '#C8FF32';
  const number = Number.parseInt(safe.slice(1), 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

export function blendWithBrightness(a, b, t, brightness = 1) {
  return a.map((value, index) => Math.round((value + (b[index] - value) * t) * brightness));
}

function mix(a, b, t, alpha = 1, brightness = 1) {
  const channels = blendWithBrightness(a, b, t, brightness);
  return `rgba(${channels[0]},${channels[1]},${channels[2]},${alpha})`;
}

function heartField(x, y, scale) {
  const px = x / scale;
  const py = (y + .05) / scale;
  const a = px * px + py * py - 1;
  return a * a * a - px * px * py * py * py;
}

function flowerField(x, y, scale) {
  const angle = Math.atan2(y, x);
  const radius = Math.hypot(x, y);
  const edge = (.42 + .13 * Math.cos(angle * 6)) * scale;
  return radius - edge;
}

function resolveCellSize(width, density, customCellSize) {
  if (density === 'coarse') return Math.max(18, width / 26);
  if (density === 'balanced') return Math.max(10, width / 52);
  if (density === 'fine') return Math.max(5, width / 100);
  if (density === 'custom') return clamp(customCellSize, 2, 80, 10);
  return Math.max(8, Math.min(20, width / 58));
}

export function createSceneRenderer(canvas, initialScene, initialOptions = {}) {
  if (!canvas?.getContext) throw new TypeError('A canvas element is required');
  const context = canvas.getContext('2d', { alpha: false });
  let scene = { ...initialScene };
  let options = { ...normalizeRenderOptions(initialOptions), customCellSize: initialOptions.customCellSize, text: initialOptions.text };
  let frame = 0;
  let running = false;
  let playingIntent = false;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    drawFrame(0);
  }

  function drawFrame(timestamp = 0) {
    const seconds = timestamp / 1000 * options.speed;
    const pulse = options.reducedMotion ? .58 : (Math.sin(seconds * 1.25 - Math.PI / 2) + 1) / 2;
    const colors = scene.colors?.map(hexToRgb) ?? [hexToRgb('#090B0D'), hexToRgb('#C8FF32')];
    context.fillStyle = mix(colors[0], colors[1], pulse * .12, 1, options.brightness);
    context.fillRect(0, 0, width, height);

    if (scene.engine === 'breathe') {
      context.fillStyle = mix(colors[0], colors[1], .18 + pulse * .82, 1, options.brightness);
      context.fillRect(0, 0, width, height);
    } else if (scene.engine === 'text') {
      context.fillStyle = mix(colors[0], colors[1], .18 + pulse * .82, 1, options.brightness);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = `800 ${Math.max(34, Math.min(width / 8, 110))}px ${getComputedStyle(document.body).fontFamily}`;
      context.fillText(options.text || scene.text || 'CYBERLIGHTING', width / 2, height / 2, width * .86);
    } else {
      const cell = resolveCellSize(width, options.density, options.customCellSize);
      const columns = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const gap = Math.max(1, cell * .13);
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = (column + .5) / columns * 2 - 1;
          const y = ((row + .5) / rows * 2 - 1) * (height / width);
          let energy = .035;
          if (scene.engine === 'wave') energy = .16 + .84 * ((Math.sin(column * .35 + row * .09 - seconds * 2) + 1) / 2);
          if (scene.engine === 'progressive') energy = .08 + .92 * ((Math.sin(column * .28 + row * .22 - seconds * 2.6) + 1) / 2) ** 4;
          if (scene.engine === 'heart') {
            const shape = heartField(x * 1.2, -y * 1.2, .48 + pulse * .42);
            energy = shape <= 0 ? .72 + pulse * .28 : .035;
          }
          if (scene.engine === 'flower') {
            const shape = flowerField(x, y, .74 + pulse * .25);
            energy = shape <= 0 ? .68 + pulse * .32 : .035;
          }
          context.fillStyle = mix(colors[0], colors[1], Math.min(1, energy), 1, options.brightness);
          context.fillRect(column * cell + gap, row * cell + gap, cell - gap * 2, cell - gap * 2);
        }
      }
    }
  }

  function loop(timestamp) {
    if (!running) return;
    drawFrame(timestamp);
    frame = requestAnimationFrame(loop);
  }

  function start() {
    playingIntent = true;
    if (running || document.hidden) return;
    running = true;
    if (options.reducedMotion) drawFrame(0);
    else frame = requestAnimationFrame(loop);
  }

  function stop() {
    playingIntent = false;
    running = false;
    cancelAnimationFrame(frame);
  }

  function update(nextScene = scene, nextOptions = {}) {
    scene = { ...scene, ...nextScene, colors: nextScene.colors ?? scene.colors };
    options = { ...options, ...normalizeRenderOptions({ ...options, ...nextOptions }), customCellSize: nextOptions.customCellSize ?? options.customCellSize, text: nextOptions.text ?? options.text };
    drawFrame(performance.now());
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(frame);
    } else if (playingIntent) {
      running = true;
      if (options.reducedMotion) drawFrame(0); else frame = requestAnimationFrame(loop);
    }
  }

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', resize);
  const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvas);
  resize();

  function destroy() {
    stop();
    resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', resize);
  }

  return { start, stop, resize, update, drawFrame, destroy };
}
