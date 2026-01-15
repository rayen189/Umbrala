// ==========================================
// UMBRALA MAIN.JS — FULL ROOT CYBERPUNK
// ==========================================

/* =====================
   VARIABLES GLOBALES
===================== */
const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const rootLoginScreen = document.getElementById('root-login');
const rootTerminalScreen = document.getElementById('root-terminal');

const siteTitle = document.getElementById('site-title');
const initBtn = document.getElementById('init-btn');
const rootBtn = document.getElementById('root-btn');
const homeBtns = document.querySelectorAll('#home-btn, #home-btn-2');

const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const sendFileBtn = document.getElementById('send-file-btn');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const exitRoomBtn = document.getElementById('exit-room');

const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootError = document.getElementById('root-error');

const rootConsole = document.getElementById('root-console');
const rootCommandInput = document.getElementById('root-command');
const rootExecBtn = document.getElementById('root-exec');
const rootExitBtn = document.getElementById('root-exit');

/* =====================
   DATOS DEL SISTEMA
===================== */
let rooms = ['Norte de Chile','Sur de Chile','La Serena','Chile Central','Chile Austral'];
let hiddenRooms = ['Sala Secreta 1','Sala Secreta 2'];
let usersByRoom = {};
let messagesByRoom = {};
let shadowBanned = [];
let freezeGlobal = false;
let currentRoom = null;

// Root
const ROOT = {nick:'root', primary:'root123', secondary:'umbralaSecret'};
let isRoot = false;
let rootSecured = false;
let mapInterval = null;

/* =====================
   UTILIDADES
===================== */
function showScreen(screen){
  [landingScreen, roomsScreen, chatScreen, rootLoginScreen, rootTerminalScreen].forEach(s => s.style.display='none');
  screen.style.display='flex';
}

function updateRoomsList(){
  roomsList.innerHTML='';
  rooms.concat(hiddenRooms).forEach(r => {
    const div = document.createElement('div');
    div.textContent = r + ` (${(usersByRoom[r]||[]).length})`;
    div.onclick = () => enterRoom(r);
    roomsList.appendChild(div);
  });
}

function updateUsersList(){
  usersList.innerHTML='';
  (usersByRoom[currentRoom]||[]).forEach(u => {
    const li = document.createElement('li');
    li.textContent = u + (shadowBanned.includes(u)? ' 🔒' : '');
    li.onclick = () => {
      if(isRoot) rootPrint(`Abriste chat 1:1 con ${u}`);
    };
    usersList.appendChild(li);
  });
  userCount.textContent=`Usuarios: ${(usersByRoom[currentRoom]||[]).length}`;
}

function enterRoom(room){
  currentRoom = room;
  showScreen(chatScreen);
  document.getElementById('chat-room-name').textContent = room;
  updateUsersList();
  chatContainer.innerHTML='';
}

/* =====================
   CHAT
===================== */
sendBtn.onclick = () => {
  if(freezeGlobal) return alert('Sala congelada 🔒');
  const msg = chatInput.value.trim();
  if(!msg) return;
  if(currentRoom && !shadowBanned.includes(ROOT.nick)){
    if(!messagesByRoom[currentRoom]) messagesByRoom[currentRoom]=[];
    messagesByRoom[currentRoom].push({user:isRoot?ROOT.nick:'Anon', text:msg});
    const p = document.createElement('p');
    p.textContent = `${isRoot?ROOT.nick:'Anon'}: ${msg}`;
    chatContainer.appendChild(p);
    chatInput.value='';
  }
};
exitRoomBtn.onclick = ()=>showScreen(roomsScreen);

/* =====================
   ROOT LOGIN
===================== */
rootBtn.onclick = ()=>showScreen(rootLoginScreen);
rootLoginBtn.onclick = ()=>{
  if(rootNickInput.value===ROOT.nick && rootPassInput.value===ROOT.primary){
    isRoot=true;
    rootSecured=false;
    showScreen(rootTerminalScreen);
    rootConsole.innerHTML='Bienvenido ROOT\nIngrese clave secundaria:';
  }else{
    rootError.textContent='Credenciales incorrectas';
  }
};

/* =====================
   ROOT TERMINAL
===================== */
function rootPrint(text){
  const p=document.createElement('p');
  p.textContent=text;
  rootConsole.appendChild(p);
  rootConsole.scrollTop=rootConsole.scrollHeight;
}

function execRootCommand(cmd){
  if(!rootSecured){
    if(cmd===ROOT.secondary){rootSecured=true;rootPrint('Acceso ROOT total 🔐');}
    else rootPrint('Clave secundaria incorrecta');
    return;
  }
  rootPrint('> '+cmd);

  switch(true){
    case cmd.startsWith('/help'):
      rootPrint('/map ultra | /map stop | /freeze | /timeline | /shadowban nick | /unshadow nick | /hide room | /unhide room | /shutdown');
      break;

    case cmd.startsWith('/map ultra'):
      showMapLive();
      break;

    case cmd.startsWith('/map stop'):
      stopMapLive();
      break;

    case cmd.startsWith('/freeze'):
      freezeGlobal=!freezeGlobal;
      rootPrint(`Freeze Global: ${freezeGlobal?'ACTIVADO':'DESACTIVADO'}`);
      break;

    case cmd.startsWith('/shadowban'):
      const sbNick=cmd.split(' ')[1];
      if(sbNick && !shadowBanned.includes(sbNick)) shadowBanned.push(sbNick);
      rootPrint(`${sbNick} shadowbaneado`);
      break;

    case cmd.startsWith('/unshadow'):
      const usNick=cmd.split(' ')[1];
      shadowBanned=shadowBanned.filter(u=>u!==usNick);
      rootPrint(`${usNick} liberado de shadowban`);
      break;

    case cmd.startsWith('/hide room'):
      const hr=cmd.split(' ')[2];
      if(hr && rooms.includes(hr)){
        rooms=rooms.filter(r=>r!==hr);
        hiddenRooms.push(hr);
        updateRoomsList();
        rootPrint(`Sala ${hr} oculta`);
      }
      break;

    case cmd.startsWith('/unhide room'):
      const uh=cmd.split(' ')[2];
      if(uh && hiddenRooms.includes(uh)){
        hiddenRooms=hiddenRooms.filter(r=>r!==uh);
        rooms.push(uh);
        updateRoomsList();
        rootPrint(`Sala ${uh} visible`);
      }
      break;

    case cmd.startsWith('/shutdown'):
      rootPrint('Apagando Umbrala...');
      setTimeout(()=>{document.body.innerHTML='<h1 style="color:#0ff;text-align:center">UMBRALA OFF</h1>';},2000);
      break;

    case cmd.startsWith('/timeline'):
      rootPrint('--- Timeline ---');
      Object.keys(messagesByRoom).forEach(r=>{
        (messagesByRoom[r]||[]).forEach(m=>{
          rootPrint(`[${r}] ${m.user}: ${m.text||'[archivo]'}`);
        });
      });
      break;

    default:
      rootPrint('Comando no reconocido. /help');
  }
}

rootExecBtn.onclick=()=>execRootCommand(rootCommandInput.value.trim());
rootExitBtn.onclick=()=>{
  isRoot=false; rootSecured=false;
  showScreen(landingScreen);
};

/* =====================
   GOD VIEW
===================== */
function showMapLive(){
  if(mapInterval) clearInterval(mapInterval);
  rootPrint('--- GOD VIEW ACTIVADO ---');

  mapInterval=setInterval(()=>{
    rootConsole.innerHTML='';
    rootPrint('--- UMBRALA :: GOD VIEW ---');
    rooms.concat(hiddenRooms).forEach(r=>{
      const users=usersByRoom[r]||[];
      rootPrint(`[${r}] -> ${users.length} usuario(s)`);
      users.forEach(u=>{
        const last=messagesByRoom[r]?.filter(m=>m.user===u).slice(-1)[0];
        if(last) rootPrint(`   • ${u} ultimo msg: ${last.text||'[archivo]'}`);
      });
    });
  },2000);
}

function stopMapLive(){
  if(mapInterval){
    clearInterval(mapInterval);
    mapInterval=null;
    rootPrint('--- GOD VIEW DESACTIVADO ---');
  }
}

/* =====================
   EVENTOS INICIALES
===================== */
siteTitle.onclick = ()=>showScreen(landingScreen);
initBtn.onclick = ()=>{ showScreen(roomsScreen); updateRoomsList(); };
homeBtns.forEach(b=>b.onclick=()=>showScreen(landingScreen));
