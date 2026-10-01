import { showPrototypeToast } from '../shell.js';
const canvas = document.querySelector('[data-studio-canvas]');
const context = canvas.getContext('2d');
const color = document.querySelector('[data-studio-color]');
let tool = 'brush';
let drawing = false;
let cells = new Set();
const size = 18;

function resize() { const rect = canvas.getBoundingClientRect(); canvas.width = rect.width; canvas.height = rect.height; draw(); }
function draw() { context.fillStyle = '#050707'; context.fillRect(0,0,canvas.width,canvas.height); const cell = Math.max(10, Math.min(24, canvas.width / 42)); for(let y=0;y<canvas.height;y+=cell) for(let x=0;x<canvas.width;x+=cell){ const key=`${Math.floor(x/cell)}:${Math.floor(y/cell)}`; context.fillStyle=cells.has(key)?color.value:'#111617'; context.fillRect(x+1,y+1,cell-2,cell-2); } }
function paint(event) { if(!drawing) return; const rect=canvas.getBoundingClientRect(); const cell=Math.max(10,Math.min(24,canvas.width/42)); const key=`${Math.floor((event.clientX-rect.left)/cell)}:${Math.floor((event.clientY-rect.top)/cell)}`; if(tool==='eraser') cells.delete(key); else if(tool==='fill'){ cells=new Set(); for(let y=0;y<canvas.height/cell;y++) for(let x=0;x<canvas.width/cell;x++) cells.add(`${x}:${y}`); } else cells.add(key); draw(); }
document.querySelectorAll('[data-tool]').forEach((button)=>button.addEventListener('click',()=>{ tool=button.dataset.tool; document.querySelectorAll('[data-tool]').forEach((item)=>item.toggleAttribute('data-active',item===button)); if(tool==='undo'){ cells=new Set(); draw(); showPrototypeToast('Prototype canvas cleared.'); }}));
canvas.addEventListener('pointerdown',(event)=>{drawing=true;canvas.setPointerCapture(event.pointerId);paint(event);}); canvas.addEventListener('pointermove',paint); canvas.addEventListener('pointerup',()=>{drawing=false;}); color.addEventListener('input',draw); window.addEventListener('resize',resize); resize();

