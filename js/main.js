/* =========================
   VARIABLES PRINCIPALES
========================= */
let isRoot = false;
let currentRoom = null;
let users = [];
let rooms = [
  {name:"Norte", users:[]},
  {name:"Centro", users:[]},
  {name:"Sur", users:[]},
  {name:"Global", users:[]},
  {name:"Curiosidades", users:[]},
  {name:"Sala Secreta", users:[], hidden:true}
];
let globalFreeze = false;
let timeline = [];

/* =========================
   SELECTORES DE PANTALLAS
========================= */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');
const rootScreen = document.getElementById('rootScreen');

/* =========================
   SELECTORES CHAT
========================= */
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const exitChatBtn = document.getElementById('exitChatBtn');
const roomsList = document.getElementById('roomsList');
const exitRoomsListBtn = document.getElementById('exitRoomsListBtn');
const imageInput = document.getElementById('imageInput');

/* =========================
   SELECTORES ROOT
========================= */
const rootUsersList = document.getElementById('rootUsers');
const rootRoomsList = document.getElementById('rootRooms');
const rootConsole = document.getElementById('root-console');
const freezeGlobalBtn = document.getElementById('freezeGlobalBtn');
const godViewBtn = document.getElementById('godViewBtn');
const shutdownBtn = document.getElementById('shutdownBtn');

/* =========================
   EMOJIS
========================= */
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
   FUNCIONES DE PANTALLA
========================= */
function showScreen(screen){
  [landingScreen, roomsListScreen, chatScreen, rootScreen].forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

/* =========================
   BOTONES LANDING
========================= */
document.getElementById('initializeBtn').onclick = () => {
  showScreen(roomsListScreen);
  renderRooms();
};

document.getElementById('rootLoginBtn').onclick = () => {
  const nick = prompt("Usuario Root:");
  const pass = prompt("Clave Root:");
  if(nick==='root' && pass==='1234'){ // Cambiar clave aquí
    isRoot = true;
    showScreen(rootScreen);
    renderRoot();
    logRoot("Root ha iniciado sesión");
  } else alert("Credenciales incorrectas");
};

/* =========================
   BOTONES SALAS
========================= */
exitRoomsListBtn.onclick = () => showScreen(landingScreen);

/* =========================
   RENDER DE SALAS
========================= */
function renderRooms(){
  roomsList.innerHTML='';
  rooms.forEach((room,i)=>{
    if(room.hidden && !isRoot) return;
    const div = document.createElement('div');
    div.textContent = `${room.name} (${room.users.length} usuarios)`;
    div.style.cursor = 'pointer';
    div.onclick = () => enterRoom(i);
    roomsList.appendChild(div);
  });
}

function enterRoom(i){
  currentRoom = i;
  chatMessages.innerHTML='';
  const userName = isRoot ? 'Root' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  renderRooms();
  showScreen(chatScreen);
}

/* =========================
   CHAT
========================= */
sendBtn.onclick = () => {
  if(globalFreeze) return alert("¡Chat congelado!");
  if(currentRoom===null) return;
  const msg = chatInput.value.trim();
  if(!msg) return;
  const user = isRoot ? 'Root' : 'User'+Math.floor(Math.random()*1000);
  const data = {user, msg, room:rooms[currentRoom].name, time:new Date()};
  timeline.push(data);
  appendMessage(data);
  chatInput.value='';
};

exitChatBtn.onclick = () => {
  // Salir de chat vuelve a la lista de salas
  currentRoom = null;
  showScreen(roomsListScreen);
};

function appendMessage(data){
  const div = document.createElement('div');
  div.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  logRoot(`[MSG] ${data.user} -> ${data.msg}`);
}

/* =========================
   ENVIO DE IMAGENES
========================= */
imageInput.onchange = e => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = ev.target.result;
    img.style.maxWidth = "150px";
    img.style.display = "block";
    imgDiv.appendChild(img);
    chatMessages.appendChild(imgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  reader.readAsDataURL(file);
  imageInput.value = "";
}

/* =========================
   ROOT DASHBOARD
========================= */
function renderRoot(){
  renderRootUsers();
  renderRootRooms();
}

function renderRootUsers(){
  rootUsersList.innerHTML='';
  let allUsers=[];
  rooms.forEach(r=>allUsers.push(...r.users));
  allUsers = [...new Set(allUsers)];
  allUsers.forEach(u=>{
    const li = document.createElement('li');
    li.textContent = u;
    const shadowBtn = document.createElement('button');
    shadowBtn.textContent = 'Shadowban';
    shadowBtn.onclick = () => shadowUser(u);
    li.appendChild(shadowBtn);
    rootUsersList.appendChild(li);
  });
}

function renderRootRooms(){
  rootRoomsList.innerHTML='';
  rooms.forEach((r,i)=>{
    const li = document.createElement('li');
    li.textContent = r.name;
    const freezeBtn = document.createElement('button');
    freezeBtn.textContent = 'Freeze';
    freezeBtn.onclick = () => toggleFreezeRoom(i);
    li.appendChild(freezeBtn);
    const hideBtn = document.createElement('button');
    hideBtn.textContent = r.hidden ? 'Mostrar' : 'Ocultar';
    hideBtn.onclick = () => toggleRoomVisibility(i);
    li.appendChild(hideBtn);
    rootRoomsList.appendChild(li);
  });
}

/* =========================
   FUNCIONES ROOT
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

freezeGlobalBtn.onclick = () => {
  globalFreeze = !globalFreeze;
  logRoot(`Freeze global: ${globalFreeze}`);
  alert(`Freeze global: ${globalFreeze}`);
}

godViewBtn.onclick = () => alert("God View activado (visual completo de todas las salas y usuarios)");

shutdownBtn.onclick = () => {
  logRoot("Umbrala se apagará en 5 segundos...");
  setTimeout(()=>{ location.reload(); },5000);
}

/* =========================
   TIMELINE ROOT
========================= */
function logRoot(msg){
  const div = document.createElement('div');
  div.textContent = `[ROOT] ${msg}`;
  div.className='glow';
  rootConsole.appendChild(div);
  rootConsole.scrollTop = rootConsole.scrollHeight;
}

/* =========================
   TITULO CLICK LANDING
========================= */
document.querySelectorAll('.clickable-title').forEach(title=>{
  title.onclick = () => { if(!isRoot) showScreen(landingScreen); };
});

/* =========================
   INICIALIZAR
========================= */
renderRooms();
