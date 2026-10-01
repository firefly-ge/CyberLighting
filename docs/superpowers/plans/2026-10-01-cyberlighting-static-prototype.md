# CyberLighting Static Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated, responsive, clickable eight-page CyberLighting prototype that demonstrates the product flow and live visual effects without replacing the existing production homepage.

**Architecture:** Add a dependency-free `prototype/` site beside the current application. Eight HTML entry points share one design system, navigation controller, scene catalog, and Canvas renderer, while focused page controllers provide simulated interactions. The prototype uses real-time Canvas effects where they materially communicate the product and mock data for backend-dependent features.

**Tech Stack:** Semantic HTML5, CSS custom properties, native ES modules, Canvas 2D, Node.js built-in test runner, existing GitHub Pages workflow.

**Spec:** `docs/superpowers/specs/2026-10-01-cyberlighting-product-design.md`

## Global Constraints

- Preserve the current `index.html`, `src/`, and existing demos.
- Do not add framework, build, runtime, font, analytics, account, API, or backend dependencies.
- Keep prototype pages under `prototype/` so the current product remains available.
- Support English, simplified Chinese, and traditional Chinese in the shared shell.
- Use dark, clean surfaces without blurred decorative orbs or meaningless diagonal ornaments.
- Treat grid density as adaptive; the prototype may show named density styles and custom controls but must not present a fixed product maximum.
- Default animations must avoid high-frequency flashing and respect `prefers-reduced-motion`.
- Backend-only actions must visibly identify themselves as prototype previews instead of pretending to persist or synchronize data.

## Review Focus

- Directly opening any nested HTML file must resolve shared assets and links using relative paths.
- A narrow mobile viewport must preserve the preview and keep the primary action reachable without horizontal scrolling.
- Missing or malformed scene query parameters must fall back to a safe default scene.
- Reduced-motion users must see a stable representative frame rather than continuous motion.
- Unsupported fullscreen, clipboard, upload, and QR actions must produce clear inline prototype feedback instead of uncaught errors.

## File Structure

```text
prototype/
├── index.html                 # landing page and instant live preview
├── explore.html               # template catalog and filters
├── create.html                # quick template customization
├── player.html                # immersive playback and share overlay
├── library.html               # local-work mock and empty state
├── pixelize.html              # photo-to-pixel workflow preview
├── studio.html                # advanced editor preview
├── rooms.html                 # multi-screen room preview
├── assets/
│   ├── prototype.css          # tokens, layout, components, responsive states
│   ├── shell.js               # navigation, locale, toasts, safe browser APIs
│   ├── catalog.js             # scene metadata and category data
│   ├── renderer.js            # Canvas scene renderer and lifecycle
│   └── pages/
│       ├── home.js
│       ├── explore.js
│       ├── create.js
│       ├── player.js
│       ├── library.js
│       ├── pixelize.js
│       ├── studio.js
│       └── rooms.js
test/
├── prototype-pages.test.js    # page structure, navigation, accessibility hooks
├── prototype-catalog.test.js  # catalog schema and category coverage
└── prototype-renderer.test.js # input normalization and safe fallbacks
```

---

### Task 1: Shared prototype shell and design system

**Files:**
- Create: `prototype/assets/prototype.css`
- Create: `prototype/assets/shell.js`
- Create: `prototype/index.html`
- Create: `test/prototype-pages.test.js`

**Interfaces:**
- Produces: `initShell(): void`, `showPrototypeToast(message: string): void`, `safeRequestFullscreen(element: HTMLElement): Promise<boolean>`.
- Produces: reusable `.site-header`, `.page-shell`, `.button`, `.panel`, `.canvas-frame`, `.bottom-dock`, and `.prototype-badge` components.

- [ ] **Step 1: Write the failing shell test**

```js
test('prototype landing page loads relative shared assets and exposes primary navigation', async () => {
  const html = await readFile(new URL('../prototype/index.html', import.meta.url), 'utf8');
  assert.match(html, /href="\.\/assets\/prototype\.css"/);
  assert.match(html, /src="\.\/assets\/shell\.js"/);
  for (const href of ['./explore.html', './create.html', './library.html']) {
    assert.match(html, new RegExp(`href="${href.replace('.', '\\\.')}`));
  }
  assert.match(html, /data-locale-select/);
  assert.match(html, /data-primary-action/);
});
```

- [ ] **Step 2: Run the shell test and verify it fails**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL because `prototype/index.html` does not exist.

- [ ] **Step 3: Create the semantic landing shell and shared tokens**

Build the page with a skip link, brand, Explore/Create/My Screens navigation, locale select, `<main>`, live-preview region, and footer. Define neutral surfaces and one electric accent in CSS; use system font stacks with Chinese-specific fallbacks. Keep all asset and page URLs relative.

Use this module boundary in `shell.js`:

```js
const LOCALE_KEY = 'cyberlighting.prototype.locale';

export function showPrototypeToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 2200);
}

export async function safeRequestFullscreen(element) {
  if (!element?.requestFullscreen) return false;
  try { await element.requestFullscreen(); return true; } catch { return false; }
}

export function initShell() {
  const select = document.querySelector('[data-locale-select]');
  const stored = localStorage.getItem(LOCALE_KEY) || 'en';
  if (select) select.value = stored;
  select?.addEventListener('change', () => localStorage.setItem(LOCALE_KEY, select.value));
}

initShell();
```

- [ ] **Step 4: Run the shell test and the full suite**

Run: `npm test`

Expected: all existing tests plus the new shell test PASS.

- [ ] **Step 5: Commit the shared shell**

```bash
git add prototype/index.html prototype/assets/prototype.css prototype/assets/shell.js test/prototype-pages.test.js
git commit -m "feat: add static prototype shell"
```

### Task 2: Scene catalog and adaptive Canvas renderer

**Files:**
- Create: `prototype/assets/catalog.js`
- Create: `prototype/assets/renderer.js`
- Create: `test/prototype-catalog.test.js`
- Create: `test/prototype-renderer.test.js`
- Modify: `prototype/index.html`

**Interfaces:**
- Produces: `SCENES: ReadonlyArray<SceneSummary>` and `getScene(id: string): SceneSummary`.
- Produces: `normalizeRenderOptions(input): RenderOptions` and `createSceneRenderer(canvas, scene, options): { start, stop, resize, update, drawFrame }`.
- Consumes: a `<canvas data-scene-canvas>` element from each visual page.

- [ ] **Step 1: Write failing catalog and normalization tests**

```js
test('catalog covers launch categories and every scene has two colors', () => {
  const categories = new Set(SCENES.map((scene) => scene.category));
  for (const expected of ['love', 'ambient', 'party', 'focus', 'stream', 'text']) {
    assert.equal(categories.has(expected), true);
  }
  assert.equal(SCENES.every((scene) => /^#[0-9A-F]{6}$/i.test(scene.colors[0]) && /^#[0-9A-F]{6}$/i.test(scene.colors[1])), true);
});

test('renderer falls back safely without fixing a maximum grid size', () => {
  assert.deepEqual(normalizeRenderOptions({ density: 'unknown', speed: -4 }), {
    density: 'adaptive', speed: 0.6, brightness: 0.72, reducedMotion: false,
  });
});
```

- [ ] **Step 2: Run both tests and verify they fail**

Run: `node --test test/prototype-catalog.test.js test/prototype-renderer.test.js`

Expected: FAIL because the catalog and renderer modules do not exist.

- [ ] **Step 3: Implement catalog data and renderer lifecycle**

Create at least twelve scene records. Each record contains `id`, `title`, `category`, `engine`, `colors`, `description`, and optional `text`.

The Canvas renderer must:

- size backing pixels from the element rectangle and device pixel ratio;
- derive visual cell size from `adaptive`, `coarse`, `balanced`, `fine`, or `custom` mode without exposing a fixed maximum;
- draw breathing, wave, heart, flower, text-board, and progressive-light preview engines;
- stop its animation loop when `document.hidden` is true;
- render one stable frame when reduced motion is enabled;
- expose `update()` so create-page controls can change color, speed, brightness, density, and text.

- [ ] **Step 4: Attach a real scene canvas to the homepage hero**

Add `<canvas data-scene-canvas aria-label="Live CyberLighting scene preview"></canvas>` and initialize it from `prototype/assets/pages/home.js`. The primary actions must link to `create.html?scene=heart` and `player.html?scene=heart`.

- [ ] **Step 5: Run focused and full tests**

Run: `node --test test/prototype-catalog.test.js test/prototype-renderer.test.js`

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 6: Commit the visual foundation**

```bash
git add prototype/assets/catalog.js prototype/assets/renderer.js prototype/assets/pages/home.js prototype/index.html test/prototype-catalog.test.js test/prototype-renderer.test.js
git commit -m "feat: add prototype scene renderer"
```

### Task 3: Template discovery experience

**Files:**
- Create: `prototype/explore.html`
- Create: `prototype/assets/pages/explore.js`
- Modify: `prototype/assets/prototype.css`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Consumes: `SCENES`, `getScene()`, and `createSceneRenderer()`.
- Produces: category-filtered template cards linking to `create.html?scene=<id>` and `player.html?scene=<id>`.

- [ ] **Step 1: Add a failing Explore structure test**

```js
test('explore page exposes filters and reusable template actions', async () => {
  const html = await readFile(new URL('../prototype/explore.html', import.meta.url), 'utf8');
  assert.match(html, /data-category-filters/);
  assert.match(html, /data-template-grid/);
  assert.match(html, /data-template-card/);
  assert.match(html, /Use template/);
  assert.match(html, /Fullscreen/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL because `explore.html` does not exist.

- [ ] **Step 3: Build the responsive catalog**

Render category chips and twelve template cards. Use lightweight card canvases that animate only while visible via `IntersectionObserver`; stop them when hidden. Preserve category selection in the query string so links can be shared during review.

- [ ] **Step 4: Test filters manually and run the suite**

Run: `npm test`

Manual check: select Love, Party, and Stream; confirm cards update and every action resolves to a working relative URL.

- [ ] **Step 5: Commit template discovery**

```bash
git add prototype/explore.html prototype/assets/pages/explore.js prototype/assets/prototype.css test/prototype-pages.test.js
git commit -m "feat: add prototype template explorer"
```

### Task 4: Quick Create and immersive Player flow

**Files:**
- Create: `prototype/create.html`
- Create: `prototype/player.html`
- Create: `prototype/assets/pages/create.js`
- Create: `prototype/assets/pages/player.js`
- Modify: `prototype/assets/prototype.css`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Consumes: `getScene()`, `createSceneRenderer()`, `safeRequestFullscreen()`, and `showPrototypeToast()`.
- Produces: query-based scene editing and `player.html?scene=<id>&primary=<hex>&secondary=<hex>&speed=<number>&density=<mode>&text=<value>`.

- [ ] **Step 1: Add failing Create and Player tests**

```js
test('create page exposes the quick customization contract', async () => {
  const html = await readFile(new URL('../prototype/create.html', import.meta.url), 'utf8');
  for (const control of ['primary', 'secondary', 'speed', 'brightness', 'density']) {
    assert.match(html, new RegExp(`name="${control}"`));
  }
  assert.match(html, /data-save-scene/);
  assert.match(html, /data-open-player/);
});

test('player has an accessible auto-hiding control surface', async () => {
  const html = await readFile(new URL('../prototype/player.html', import.meta.url), 'utf8');
  assert.match(html, /data-player-controls/);
  assert.match(html, /aria-label="Pause animation"/);
  assert.match(html, /data-share-scene/);
  assert.match(html, /Remix this scene/);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL because both pages are missing.

- [ ] **Step 3: Build Quick Create**

Use a large live canvas and compact properties panel. Controls update the renderer immediately. Density options are `Auto`, `Bold pixels`, `Balanced`, `Fine detail`, and `Custom`; the Custom state shows row and column inputs plus “Performance depends on this device,” with no hard-coded maximum claim.

Save stores a compact mock scene in `localStorage` under `cyberlighting.prototype.scenes`. Open Player serializes the visible settings into the player query string.

- [ ] **Step 4: Build Player**

Fill the viewport with the scene. Show controls after pointer, touch, focus, or key input; hide them after four seconds of inactivity unless focus remains within the controls. Implement play/pause, safe fullscreen, edit link, mock share link copy, and Remix. Invalid query values use catalog defaults and show a non-blocking recovery message.

- [ ] **Step 5: Run tests and manual interaction checks**

Run: `npm test`

Manual check: change colors and speed, open Player, pause, enter fullscreen, reveal controls with the keyboard, and return to edit without losing query state.

- [ ] **Step 6: Commit the core creation loop**

```bash
git add prototype/create.html prototype/player.html prototype/assets/pages/create.js prototype/assets/pages/player.js prototype/assets/prototype.css test/prototype-pages.test.js
git commit -m "feat: prototype create and player flow"
```

### Task 5: My Screens and image pixelization preview

**Files:**
- Create: `prototype/library.html`
- Create: `prototype/pixelize.html`
- Create: `prototype/assets/pages/library.js`
- Create: `prototype/assets/pages/pixelize.js`
- Modify: `prototype/assets/prototype.css`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Consumes: local prototype scene records and Canvas renderer.
- Produces: local scene cards and an in-browser image-to-pixel preview with adaptive density controls.

- [ ] **Step 1: Add failing page-contract tests**

```js
test('library and pixelize pages expose their primary states', async () => {
  const library = await readFile(new URL('../prototype/library.html', import.meta.url), 'utf8');
  const pixelize = await readFile(new URL('../prototype/pixelize.html', import.meta.url), 'utf8');
  assert.match(library, /data-library-grid/);
  assert.match(library, /data-library-empty/);
  assert.match(pixelize, /type="file"[^>]+accept="image\/\*"/);
  assert.match(pixelize, /data-density-mode/);
  assert.match(pixelize, /data-pixel-preview/);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL because the new pages are missing.

- [ ] **Step 3: Build My Screens**

Render three polished sample scene cards plus saved local mock scenes. Provide Play, Edit, Duplicate, Rename, and Delete controls. Destructive actions affect prototype-local data only and use an inline confirmation. Include a designed empty state that links to three suggested templates.

- [ ] **Step 4: Build Pixelize**

Use `FileReader` and an offscreen canvas to preview a selected local image. Provide Auto, Bold pixels, Balanced, Fine detail, and Custom density modes; custom row and column inputs demonstrate flexibility without prescribing a final supported maximum. Add mock animation choices and a clear “Processed on this device” notice.

- [ ] **Step 5: Run tests and manual upload checks**

Run: `npm test`

Manual check: upload a small JPG/PNG, switch density styles, choose a breathing animation, and confirm canceling the file picker produces no error.

- [ ] **Step 6: Commit the personal-library flow**

```bash
git add prototype/library.html prototype/pixelize.html prototype/assets/pages/library.js prototype/assets/pages/pixelize.js prototype/assets/prototype.css test/prototype-pages.test.js
git commit -m "feat: prototype library and pixelizer"
```

### Task 6: Advanced Studio and multi-screen Rooms preview

**Files:**
- Create: `prototype/studio.html`
- Create: `prototype/rooms.html`
- Create: `prototype/assets/pages/studio.js`
- Create: `prototype/assets/pages/rooms.js`
- Modify: `prototype/assets/prototype.css`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Consumes: Canvas renderer, catalog scenes, and shared shell feedback.
- Produces: a simulated editor workspace and a simulated controller/display room flow.

- [ ] **Step 1: Add failing Studio and Rooms structure tests**

```js
test('advanced pages communicate editor and room concepts', async () => {
  const studio = await readFile(new URL('../prototype/studio.html', import.meta.url), 'utf8');
  const rooms = await readFile(new URL('../prototype/rooms.html', import.meta.url), 'utf8');
  assert.match(studio, /data-tool="brush"/);
  assert.match(studio, /data-layer-list/);
  assert.match(studio, /data-density-mode/);
  assert.match(rooms, /data-room-code/);
  assert.match(rooms, /data-device-list/);
  assert.match(rooms, /Create a room/);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL because both pages are missing.

- [ ] **Step 3: Build Studio as an interaction prototype**

Create a responsive editor with toolbar, canvas, layers, properties, animation strip, and density selector. Brush, eraser, fill, select, undo, and layer selection may update local UI state; the canvas must visibly respond to at least brush and fill. Label the page “Advanced preview” so it is not mistaken for a completed production editor.

- [ ] **Step 4: Build Rooms as a staged simulation**

Show Create/Join states, a mock QR panel, room code, device cards, controller controls, and screen-layout preview. Clicking Create generates a local display code and adds sample devices after brief staged delays; clearly label synchronization as simulated.

- [ ] **Step 5: Run tests and review both responsive layouts**

Run: `npm test`

Manual check: verify Studio remains usable in desktop layout and shows a rotate-device recommendation on narrow portrait screens; verify Rooms has understandable host and display roles.

- [ ] **Step 6: Commit advanced concept pages**

```bash
git add prototype/studio.html prototype/rooms.html prototype/assets/pages/studio.js prototype/assets/pages/rooms.js prototype/assets/prototype.css test/prototype-pages.test.js
git commit -m "feat: prototype studio and multi-screen rooms"
```

### Task 7: Internationalization, accessibility, and cross-page polish

**Files:**
- Create: `prototype/assets/i18n.js`
- Modify: all `prototype/*.html`
- Modify: `prototype/assets/shell.js`
- Modify: `prototype/assets/prototype.css`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Produces: `normalizePrototypeLocale(locale): 'en' | 'zh-CN' | 'zh-TW'`, `getPrototypeCopy(locale): Record<string, string>`, and `applyPrototypeLocale(locale): void`.
- Consumes: elements marked with `data-i18n` and `data-i18n-aria`.

- [ ] **Step 1: Add failing locale and accessibility tests**

```js
test('every prototype page has landmarks, locale control, title, and reduced-motion-ready canvas', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(`../prototype/${page}`, import.meta.url), 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<main/);
    assert.match(html, /data-locale-select/);
    assert.match(html, /data-toast/);
  }
});
```

- [ ] **Step 2: Run the focused test and verify gaps fail**

Run: `node --test test/prototype-pages.test.js`

Expected: FAIL for pages missing one or more shared accessibility hooks.

- [ ] **Step 3: Add shared locale application and accessibility behavior**

Translate navigation, page headings, primary actions, prototype notices, and safety copy into all three locales. Preserve product/template names when translation would reduce recognition. Add focus-visible states, useful canvas labels, keyboard access, `aria-live` toast feedback, sufficient contrast, and reduced-motion CSS/renderer behavior.

- [ ] **Step 4: Complete responsive polish**

Check widths around 360, 768, 1024, and 1440 CSS pixels. Ensure no page has horizontal overflow, primary actions remain visible, dense editors switch to an intentional mobile state, and Chinese typography does not collapse controls.

- [ ] **Step 5: Run the complete suite**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 6: Commit product-wide polish**

```bash
git add prototype test/prototype-pages.test.js
git commit -m "feat: polish prototype accessibility and locales"
```

### Task 8: Final verification, documentation, and preview handoff

**Files:**
- Modify: `README.md`
- Modify: `test/prototype-pages.test.js`

**Interfaces:**
- Produces: a documented local and GitHub Pages entry URL for the prototype.

- [ ] **Step 1: Add a failing link-integrity test**

```js
test('all internal prototype page links resolve to files', async () => {
  for (const page of PAGES) {
    const html = await readFile(new URL(`../prototype/${page}`, import.meta.url), 'utf8');
    for (const match of html.matchAll(/href="\.\/([^"?#]+\.html)/g)) {
      await access(new URL(`../prototype/${match[1]}`, import.meta.url));
    }
  }
});
```

- [ ] **Step 2: Run the integrity test**

Run: `node --test test/prototype-pages.test.js`

Expected: PASS only after every linked page exists.

- [ ] **Step 3: Document prototype access**

Add a README section with:

```markdown
## Product prototype

Open `prototype/index.html` through a static HTTP server. The prototype is isolated from the current breathing-light homepage and demonstrates the proposed eight-page product flow.
```

- [ ] **Step 4: Run final automated verification**

Run: `npm test`

Expected: all tests PASS with no skipped or failing tests.

- [ ] **Step 5: Run final browser verification**

Serve the repository over HTTP and inspect all eight pages on desktop and mobile widths. Verify live animations, navigation, Create-to-Player state transfer, local library behavior, image upload preview, Studio interactions, Rooms simulation, locale switching, reduced-motion rendering, and absence of console errors.

- [ ] **Step 6: Commit verification documentation**

```bash
git add README.md test/prototype-pages.test.js
git commit -m "docs: add CyberLighting prototype preview"
```

- [ ] **Step 7: Push and verify GitHub Pages only after the local review passes**

Run: `git push origin feature/v1-breathing-light`

Expected: the existing Pages workflow deploys the new `prototype/` files while preserving the current homepage.

