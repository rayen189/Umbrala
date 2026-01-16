// ============================
// UMBRALA MAIN.JS
// Full Root / Dashboard Visual / Chat / Emojis / Salas
// ============================

/* =========================
   Variables principales
========================= */
let isRoot = false;
let currentRoom = null;
let users = [];
let rooms = [
  {name:"Sala 1", users:[]},
  {name:"Sala 2", users:[]},
  {name:"Sala 3", users:[]},
  {name:"Sala 4", users:[]},
  {name:"Sala 5", users:[]},
  {name:"Sala Secreta 1", users:[], hidden:true},
  {name:"Sala Secreta 2", users:[], hidden:true}
];
let globalFreeze = false;
let timeline = [];

const landingScreen = document.getElementById('landingScreen');
const roomsScreen = document.getElementById('roomsScreen');
const rootScreen = document.getElementById('rootScreen');

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const exitRoomBtn = document.getElementById('exitRoomBtn');
const roomsList = document.getElementById('roomsList');

const rootUsersList = document.getElementById('rootUsers');
const rootRoomsList = document.getElementById('rootRooms');
const rootConsole = document.getElementById('root-console');
const freezeGlobalBtn = document.getElementById('freezeGlobalBtn');
const godViewBtn = document.getElementById('godViewBtn');
const shutdownBtn = document.getElementById('shutdownBtn');

const emojiPicker = document.getElementById('emoji-picker');
const emojiList = ["😎","🔥","💀","✨","🕳️","💻","⚡"];
emojiList.forEach(e=>{
  const span = document.createElement('span');
  span.className='emoji';
  span.textContent=e;
  span.onclick=()=> { chatInput.value+=e; chatInput.focus(); };
  emojiPicker.appendChild(span);
});

/* =========================
   Pantallas
========================= */
function showScreen(screen){
  landingScreen.style.display = 'none';
  roomsScreen.style.display = 'none';
  rootScreen.style.display = 'none';
  screen.style.display = 'flex';
}

/* =========================
   Botones principales
========================= */
document.getElementById('initializeBtn').onclick=()=>{
  showScreen(roomsScreen);
  renderRooms();
};

document.getElementById('rootLoginBtn').onclick=()=>{
  const nick = prompt("Usuario Root:");
  const pass = prompt("Clave Root:");
  if(nick==='root' && pass==='1234'){  // Cambiar clave aquí si quieres
    isRoot=true;
    showScreen(rootScreen);
    renderRoot();
    logRoot("Root ha iniciado sesión");
  } else alert("Credenciales incorrectas");
};

/* =========================
   Render de salas
========================= */
function renderRooms(){
  roomsList.innerHTML='';
  rooms.forEach((room,i)=>{
    if(room.hidden && !isRoot) return; // Solo root ve salas ocultas
    const div = document.createElement('div');
    div.textContent=`${room.name} (${room.users.length} usuarios)`;
    div.style.cursor='pointer';
    div.onclick=()=> enterRoom(i);
    roomsList.appendChild(div);
  });
}

function enterRoom(i){
  currentRoom=i;
  chatMessages.innerHTML='';
  rooms[i].users.push(isRoot?'Root':'User'+Math.floor(Math.random()*1000));
  renderRooms();
}

/* =========================
   Chat
========================= */
sendBtn.onclick=()=>{
  if(globalFreeze) return alert("¡Chat congelado!");
  if(currentRoom===null) return;
  const msg = chatInput.value.trim();
  if(!msg) return;
  const user = isRoot?'Root':'User'+Math.floor(Math.random()*1000);
  rooms[currentRoom].users.push(user);
  const data = {user,msg,room:rooms[currentRoom].name,time:new Date()};
  timeline.push(data);
  appendMessage(data);
  chatInput.value='';
};

exitRoomBtn.onclick=()=>{
  currentRoom=null;
  showScreen(landingScreen);
};

function appendMessage(data){
  const div = document.createElement('div');
  div.textContent=`[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
  logRoot(`[MSG] ${data.user} -> ${data.msg}`);
}

/* =========================
   Root Dashboard
========================= */
function renderRoot(){
  renderRootUsers();
  renderRootRooms();
}

function renderRootUsers(){
  rootUsersList.innerHTML='';
  let allUsers=[];
  rooms.forEach(r=>allUsers.push(...r.users));
  allUsers=[...new Set(allUsers)];
  allUsers.forEach(u=>{
    const li = document.createElement('li');
    li.textContent=u;
    const shadowBtn=document.createElement('button');
    shadowBtn.textContent='Shadowban';
    shadowBtn.onclick=()=> shadowUser(u);
    li.appendChild(shadowBtn);
    rootUsersList.appendChild(li);
  });
}

function renderRootRooms(){
  rootRoomsList.innerHTML='';
  rooms.forEach((r,i)=>{
    const li=document.createElement('li');
    li.textContent=r.name;
    const freezeBtn=document.createElement('button');
    freezeBtn.textContent='Freeze';
    freezeBtn.onclick=()=> toggleFreezeRoom(i);
    li.appendChild(freezeBtn);
    const hideBtn=document.createElement('button');
    hideBtn.textContent=r.hidden?'Mostrar':'Ocultar';
    hideBtn.onclick=()=> toggleRoomVisibility(i);
    li.appendChild(hideBtn);
    rootRoomsList.appendChild(li);
  });
}

/* =========================
   Root funciones
========================= */
function shadowUser(user){
  timeline.push({user:'Root',msg:`Shadowban a ${user}`,time:new Date()});
  logRoot(`Shadowban aplicado a ${user}`);
  alert(`Shadowban aplicado a ${user}`);
}

function toggleFreezeRoom(i){
  rooms[i].freeze = !rooms[i].freeze;
  logRoot(`${rooms[i].name} freeze: ${rooms[i].freeze}`);
}

function toggleRoomVisibility(i){
  rooms[i].hidden = !rooms[i].hidden;
  logRoot(`${rooms[i].name} hidden: ${rooms[i].hidden}`);
  renderRooms();
}

freezeGlobalBtn.onclick=()=>{
  globalFreeze=!globalFreeze;
  logRoot(`Freeze global: ${globalFreeze}`);
  alert(`Freeze global: ${globalFreeze}`);
};

godViewBtn.onclick=()=> alert("God View activado (visual completo de todas las salas y usuarios)");

shutdownBtn.onclick=()=> {
  logRoot("Umbrala se apagará en 5 segundos...");
  setTimeout(()=>{ location.reload(); },5000);
};

/* =========================
   Timeline root
========================= */
function logRoot(msg){
  const div=document.createElement('div');
  div.textContent=`[ROOT] ${msg}`;
  div.className='glow';
  rootConsole.appendChild(div);
  rootConsole.scrollTop=rootConsole.scrollHeight;
}

/* =========================
   Titulo click a landingScreen
========================= */
document.querySelectorAll('.clickable-title').forEach(title=>{
  title.onclick=()=> { if(!isRoot) showScreen(landingScreen); };
});

/* =========================
   Iniciar render inicial
========================= */
renderRooms();
