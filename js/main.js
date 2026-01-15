document.addEventListener('DOMContentLoaded', () => {

/* ===============================
   CONFIGURACIÓN ROOT
================================ */
const ROOT = { nick:'root', password:'1234' };
const SHUTDOWN_SECONDS = 5;
const rootSpectator = true; // Root no escribe
const roomsHidden = ['VIP Oculta','Sala Secreta'];
let freezeGlobal = false;

/* ===============================
   ESTADO GLOBAL
================================ */
let currentUser = 'User'+Math.floor(Math.random()*1000);
let currentRoom = '';
let isRoot = false;

const rooms = ['General','Norte','Sur','La Serena'];
let usersByRoom = {};
let messagesByRoom = {};
let privateMessages = {};

let bans = JSON.parse(localStorage.getItem('bans')) || [];
let shadowBans = JSON.parse(localStorage.getItem('shadowBans')) || [];
let rootLog = JSON.parse(localStorage.getItem('rootLog')) || [];

/* ===============================
   ELEMENTOS DOM
================================ */
const landing = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const rootLogin = document.getElementById('root-login');

const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const chatRoomName = document.getElementById('chat-room-name');
const sendBtn = document.getElementById('send-btn');
const chatFile = document.getElementById('chat-file');
const sendFileBtn = document.getElementById('send-file-btn');
const exitRoomBtn = document.getElementById('exit-room');

const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');

const rootBtn = document.getElementById('root-btn');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootError = document.getElementById('root-error');

const initBtn = document.getElementById('init-btn');
const homeBtn = document.querySelectorAll('#home-btn');

/* ===============================
   UTILIDADES
================================ */
function logRoot(action){ 
  rootLog.push(`[${new Date().toLocaleTimeString()}] ROOT → ${action}`);
  localStorage.setItem('rootLog',JSON.stringify(rootLog));
}
function systemMessage(text){
  messagesByRoom[currentRoom].push({user:'[SISTEMA]',text});
}

/* ===============================
   SALAS
================================ */
function showRooms(){
  roomsList.innerHTML='';
  rooms.concat(isRoot?roomsHidden:[]).forEach(r=>{
    if(!usersByRoom[r]) usersByRoom[r]=[];
    if(!messagesByRoom[r]) messagesByRoom[r]=[];

    const div = document.createElement('div');
    div.innerHTML = `<strong>${r}</strong><br>
      Usuarios: ${usersByRoom[r].length}
      <button onclick="enterRoom('${r}')">Entrar</button>`;
    roomsList.appendChild(div);
  });
}
window.enterRoom = room=>{
  if(bans.includes(currentUser)) return;
  currentRoom=room;
  chatRoomName.textContent=room;
  if(!usersByRoom[room].includes(currentUser) && !isRoot) usersByRoom[room].push(currentUser);
  landing.style.display='none';
  roomsScreen.style.display='none';
  chatScreen.style.display='block';
  renderChat();
  renderUsers();
};

/* ===============================
   CHAT
================================ */
function renderChat(){
  chatContainer.innerHTML='';
  messagesByRoom[currentRoom].forEach(m=>{
    if(shadowBans.includes(m.user) && m.user!==currentUser && !isRoot) return;

    const div=document.createElement('div');
    div.className='user new-msg';
    if(m.file){
      div.textContent=`${m.user}: `;
      if(m.type.startsWith('image')){
        const img=document.createElement('img');
        img.src=m.file;
        img.style.maxWidth='200px';
        div.appendChild(img);
      }else{
        const vid=document.createElement('video');
        vid.src=m.file;
        vid.controls=true;
        vid.style.maxWidth='240px';
        div.appendChild(vid);
      }
    }else{
      div.textContent=`${m.user}: ${m.text}`;
    }
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop=chatContainer.scrollHeight;
}

function renderUsers(){
  usersList.innerHTML='';
  usersByRoom[currentRoom]?.forEach(u=>{
    if(u==='root' && rootSpectator) return;
    const li=document.createElement('li'); li.textContent=u;
    if(u==='root') li.style.color='#ff00ff';
    usersList.appendChild(li);
  });
  userCount.textContent=usersByRoom[currentRoom]?.length || 0;
}

/* ===============================
   COMANDOS ROOT
================================ */
function handleCommand(text){
  const parts=text.split(' '); const cmd=parts[0]; const target=parts[1];
  switch(cmd){
    case '/ban': bans.push(target); localStorage.setItem('bans',JSON.stringify(bans));
      usersByRoom[currentRoom]=usersByRoom[currentRoom].filter(u=>u!==target);
      logRoot(`ban ${target}`); break;

    case '/shadow': shadowBans.push(target); localStorage.setItem('shadowBans',JSON.stringify(shadowBans));
      logRoot(`shadow ${target}`); break;

    case '/unban': bans=bans.filter(u=>u!==target); localStorage.setItem('bans',JSON.stringify(bans));
      logRoot(`unban ${target}`); break;

    case '/unshadow': shadowBans=shadowBans.filter(u=>u!==target); localStorage.setItem('shadowBans',JSON.stringify(shadowBans));
      logRoot(`unshadow ${target}`); break;

    case '/clear': messagesByRoom[currentRoom]=[]; systemMessage('La sala fue purgada.');
      logRoot(`clear ${currentRoom}`); break;

    case '/shutdown': logRoot('shutdown'); shutdownSequence(); break;

    case '/panel': toggleRootPanel(); logRoot('open panel'); break;
    case '/timeline': renderTimeline(); logRoot('timeline opened'); break;
    case '/freeze': toggleFreeze(); logRoot('freeze toggled'); break;
  }
}

/* ===============================
   ENVÍO MENSAJES
================================ */
sendBtn.onclick=()=>{
  const text=chatInput.value.trim(); if(!text) return;
  if(isRoot && rootSpectator) return;
  if(isRoot && text.startsWith('/')) handleCommand(text);
  else if(!freezeGlobal) messagesByRoom[currentRoom].push({user:currentUser,text});
  renderChat(); if(isRoot) renderTimeline();
};

sendFileBtn.onclick=()=>{
  const f=chatFile.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=e=>{
    messagesByRoom[currentRoom].push({user:currentUser,file:e.target.result,type:f.type});
    renderChat(); if(isRoot) renderTimeline();
  };
  reader.readAsDataURL(f);
};

/* ===============================
   SHUTDOWN
================================ */
function shutdownSequence(){
  let count=SHUTDOWN_SECONDS;
  const interval=setInterval(()=>{
    messagesByRoom[currentRoom].push({user:'[SISTEMA]',text:`UMBRALA SE CIERRA EN ${count}…`});
    renderChat(); if(isRoot) renderTimeline();
    count--; if(count<0){ clearInterval(interval); location.reload(); }
  },1000);
}

/* ===============================
   LOGIN ROOT
================================ */
rootBtn.onclick=()=>{ landing.style.display='none'; rootLogin.style.display='block'; };

rootLoginBtn.onclick=()=>{
  if(rootNickInput.value===ROOT.nick && rootPassInput.value===ROOT.password){
    currentUser=ROOT.nick; isRoot=true; rootLogin.style.display='none'; roomsScreen.style.display='block'; showRooms();
  } else { rootError.textContent='Credenciales incorrectas'; }
};

/* ===============================
   NAVEGACIÓN
================================ */
initBtn.onclick=()=>{ landing.style.display='none'; roomsScreen.style.display='block'; showRooms(); };
homeBtn.forEach(btn=>btn.onclick=()=>location.reload());
exitRoomBtn.onclick=()=>{
  if(!isRoot) usersByRoom[currentRoom]=usersByRoom[currentRoom].filter(u=>u!==currentUser);
  chatScreen.style.display='none'; roomsScreen.style.display='block'; showRooms();
};

/* ===============================
   PANEL ROOT OCULTO
================================ */
let rootPanelVisible=false, rootPanel;
function createRootPanel(){
  rootPanel=document.createElement('div'); rootPanel.id='root-panel';
  rootPanel.innerHTML=`
    <div class="root-header">ROOT PANEL</div>
    <div class="root-section"><strong>Usuarios en sala</strong><ul id="root-users"></ul></div>
    <div class="root-section"><strong>Bans</strong><div id="root-bans"></div></div>
    <div class="root-section"><strong>Shadowbans</strong><div id="root-shadow"></div></div>
    <div class="root-section"><strong>Log Root</strong><div id="root-log"></div></div>
    <button id="root-shutdown">APAGAR UMBRALA</button>`;
  document.body.appendChild(rootPanel);
  document.getElementById('root-shutdown').onclick=shutdownSequence;
}

function updateRootPanel(){
  if(!rootPanel) return;
  const usersEl=document.getElementById('root-users');
  const bansEl=document.getElementById('root-bans');
  const shadowEl=document.getElementById('root-shadow');
  const logEl=document.getElementById('root-log');
  usersEl.innerHTML=''; usersByRoom[currentRoom]?.forEach(u=>{ if(u==='root'&&rootSpectator) return; const li=document.createElement('li'); li.textContent=u; usersEl.appendChild(li); });
  bansEl.textContent=bans.join(', ')||'—'; shadowEl.textContent=shadowBans.join(', ')||'—'; logEl.innerHTML=rootLog.slice(-10).join('<br>');
}

function toggleRootPanel(){
  if(!isRoot) return;
  if(!rootPanel) createRootPanel();
  rootPanelVisible=!rootPanelVisible; rootPanel.style.display=rootPanelVisible?'block':'none';
  updateRootPanel();
}
document.addEventListener('keydown',e=>{ if(e.ctrlKey&&e.shiftKey&&e.key==='R') toggleRootPanel(); });

/* ===============================
   TIMELINE DIOS VIEW
================================ */
function renderTimeline(){
  if(!isRoot) return;
  let timeline=document.getElementById('root-timeline'); 
  if(!timeline){ timeline=document.createElement('div'); timeline.id='root-timeline'; timeline.style.cssText='position:fixed;top:80px;left:20px;width:350px;height:400px;overflow:auto;background:rgba(0,0,0,0.9);color:#0ff;border:1px solid #0ff;z-index:9999;padding:10px;'; document.body.appendChild(timeline); }
  timeline.innerHTML='';
  Object.keys(messagesByRoom).forEach(room=>{
    messagesByRoom[room].forEach(m=>{
      const div=document.createElement('div');
      div.textContent=`[${room}] ${m.user}: ${m.text||'[archivo]'}`;
      timeline.appendChild(div);
    });
  });
}

/* ===============================
   FREEZE GLOBAL
================================ */
function toggleFreeze(){
  freezeGlobal=!freezeGlobal;
  chatInput.disabled=freezeGlobal;
  sendBtn.disabled=freezeGlobal;
  systemMessage(`[SISTEMA] Chat ${freezeGlobal?'congelado':'descongelado'} por ROOT`);
  renderChat();
}

/* ===============================
   INIT
================================ */
showRooms();

});
