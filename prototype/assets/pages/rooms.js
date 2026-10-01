import { showPrototypeToast } from '../shell.js';
const code = document.querySelector('[data-room-code]'); const devices = document.querySelector('[data-device-list]');
document.querySelector('[data-create-room]').addEventListener('click',()=>{ code.textContent=String(Math.floor(100000+Math.random()*900000)).replace(/(...)/,'$1 '); devices.innerHTML='<div><b></b>Host controller <span>connected</span></div>'; showPrototypeToast('Prototype room created locally.'); setTimeout(()=>{devices.insertAdjacentHTML('beforeend','<div><b></b>Display 02 <span>simulated</span></div>');},700); setTimeout(()=>{devices.insertAdjacentHTML('beforeend','<div><b></b>Display 03 <span>simulated</span></div>');},1400);});
document.querySelector('[data-room-play]').addEventListener('click',(event)=>{ const paused=event.currentTarget.textContent.includes('Pause'); event.currentTarget.textContent=paused?'▶ Play':'Ⅱ Pause'; showPrototypeToast(paused?'Simulation paused.':'Simulation playing.');});

