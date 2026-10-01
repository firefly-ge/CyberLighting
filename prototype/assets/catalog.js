export const SCENES = Object.freeze([
  { id: 'heart', title: 'Heart Signal', category: 'love', engine: 'heart', colors: ['#18050A', '#FF476F'], description: 'A whole heart grows and softens in one breath.' },
  { id: 'love-note', title: 'Love Note', category: 'text', engine: 'text', colors: ['#15070F', '#FF86C8'], description: 'A small message with a large glow.', text: 'I LOVE YOU' },
  { id: 'aurora', title: 'Electric Aurora', category: 'ambient', engine: 'wave', colors: ['#071A18', '#71FFD2'], description: 'Slow bands of cold light drift across the screen.' },
  { id: 'sunset', title: 'Afterglow', category: 'ambient', engine: 'breathe', colors: ['#26100D', '#FF885D'], description: 'A warm, low-stimulation sunset pulse.' },
  { id: 'acid-wave', title: 'Acid Wave', category: 'party', engine: 'wave', colors: ['#111500', '#D6FF33'], description: 'High-contrast waves built for a dark room.' },
  { id: 'pulse-grid', title: 'Pulse Grid', category: 'party', engine: 'progressive', colors: ['#0E0720', '#935CFF'], description: 'Rows of light travel through an adaptive grid.' },
  { id: 'deep-focus', title: 'Deep Focus', category: 'focus', engine: 'breathe', colors: ['#06131A', '#50C8FF'], description: 'A patient blue signal for quiet work.' },
  { id: 'do-not-disturb', title: 'Do Not Disturb', category: 'focus', engine: 'text', colors: ['#121314', '#C8FF32'], description: 'A clear status screen for your desk.', text: 'FOCUS MODE' },
  { id: 'starting-soon', title: 'Starting Soon', category: 'stream', engine: 'text', colors: ['#090B12', '#61E7FF'], description: 'A confident standby screen for creators.', text: 'STARTING SOON' },
  { id: 'brb', title: 'Be Right Back', category: 'stream', engine: 'text', colors: ['#130B08', '#FF784F'], description: 'Keep the screen alive between scenes.', text: 'BE RIGHT BACK' },
  { id: 'birthday', title: 'Birthday Pixels', category: 'text', engine: 'progressive', colors: ['#160E1F', '#FFCF4A'], description: 'A celebratory pixel field for any name.', text: 'HAPPY BIRTHDAY' },
  { id: 'flower', title: 'Bloom Cycle', category: 'ambient', engine: 'flower', colors: ['#07160F', '#FF7BB4'], description: 'A flower opens and closes as one living shape.' },
  { id: 'rain', title: 'Night Rain', category: 'ambient', engine: 'progressive', colors: ['#050A11', '#4B8BFF'], description: 'Cool light falls in offset columns.' },
  { id: 'signal', title: 'Open Signal', category: 'text', engine: 'text', colors: ['#0C0E0E', '#C8FF32'], description: 'A direct message made for the full screen.', text: 'COME IN' },
]);

export function getScene(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}

export function getCategories() {
  return [...new Set(SCENES.map((scene) => scene.category))];
}

