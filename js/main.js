/* =========================
   VARIABLES GLOBALES
========================= */
let isStalkerless = false;
let currentRoom = null;
let activePrivateChat = null;

let users = [];
let rooms = [
  {name:"Norte de Chile 🌵", users:[]},
  {name:"Sur de Chile 🗻", users:[]},
  {name:"Centro 🌃", users:[]},
  {name:"Global 🌎", users:[]},
  {name:"Curiosidades 🧠", users:[]},
  {name:"Directo al 🕳️", users:[], hidden:true}
];

let globalFreeze = false;
let timeline = [];
let privateTimeline = [];

/* =========================
   ELEMENTOS HTML
========================= */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const exitRoomBtn = document.getElementById('exitRoomBtn');
const roomsList = document.getElementById('roomsList');

const rootBar = document.getElementById('rootBar');
const shadowBtn = document.getElementById('shadowBtn');
const viewMapBtn = document.getElementById('viewMapBtn');
const freezeBtn = document.getElementById('freezeBtn');
const godViewBtn = document.getElementById('godViewBtn');
const vanishBtn = document.getElementById('vanishBtn');

const connectedUsersList = document.getElementById('connectedUsers');
const totalUsersCounter = document.getElementById('totalUsersCounter');

/* =========================
   FUNCIONES PRINCIPALES
========================= */
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

function updateTotalUsers(){
  let allUsers = [];
  rooms.forEach(r => allUsers.push(...r.users));
  const uniqueUsers = [...new Set(allUsers)];
  totalUsersCounter.textContent = `Usuarios conectados: ${uniqueUsers.length}`;
}

function renderRooms(){
  roomsList.innerHTML = '';
  rooms.forEach((r,i)=>{
    if(r.hidden && !isStalkerless) return;
    const btn = document.createElement('button');
    btn.textContent = `${r.name} (${r.users.length})`;
    btn.className='portal-btn';
    btn.onclick = ()=> enterRoom(i);
    roomsList.appendChild(btn);
  });
  updateTotalUsers();
}

function enterRoom(i){
  currentRoom = i;
  chatMessages.innerHTML='';
  const userName = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  renderRooms();
  showScreen(chatScreen);
  renderConnectedUsers();
}

/* =========================
   CHAT
========================= */
sendBtn.onclick = () => {
  if(globalFreeze) return alert("¡Chat congelado!");
  if(currentRoom === null && !activePrivateChat) return;

  const msg = chatInput.value.trim();
  if(!msg) return;

  const user = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);

  if(activePrivateChat){
    // Chat privado
    const data = {user, msg, privateWith: activePrivateChat, time: new Date()};
    privateTimeline.push(data);
    appendPrivateMessage(data);

    setTimeout(() => {
      const index = privateTimeline.indexOf(data);
      if(index!==-1){
        privateTimeline.splice(index,1);
        removePrivateMessageFromDOM(data);
      }
    }, 60000); // 60 segundos
  } else {
    // Sala pública
    const data = {user, msg, room: rooms[currentRoom].name, time: new Date()};
    timeline.push(data);
    appendMessage(data);

    setTimeout(() => {
      const index = timeline.indexOf(data);
      if(index!==-1){
        timeline.splice(index,1);
        removeMessageFromDOM(data);
      }
    }, 30000); // 30 segundos
  }

  chatInput.value='';
};

function appendMessage(data){
  const div = document.createElement('div');
  div.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendPrivateMessage(data){
  const div = document.createElement('div');
  div.textContent = `${data.user}: ${data.msg}`;
  div.className='glow';
  const privateContainer = document.getElementById('privateChatMessages');
  privateContainer.appendChild(div);
  privateContainer.scrollTop = privateContainer.scrollHeight;
}

function removeMessageFromDOM(data){
  const divs = document.querySelectorAll('#chatMessages div');
  divs.forEach(div=>{
    if(div.textContent.includes(`[${data.room}] ${data.user}: ${data.msg}`)){
      div.remove();
    }
  });
}

function removePrivateMessageFromDOM(data){
  const divs = document.querySelectorAll('#privateChatMessages div');
  divs.forEach(div=>{
    if(div.textContent.includes(`${data.user}: ${data.msg}`)){
      div.remove();
    }
  });
}

/* =========================
   USUARIOS CONECTADOS
========================= */
function renderConnectedUsers(){
  connectedUsersList.innerHTML='';
  rooms[currentRoom].users.forEach(u=>{
    const li = document.createElement('li');
    li.textContent = u;
    li.onclick = ()=> openPrivateChat(u);
    connectedUsersList.appendChild(li);
  });
}

function openPrivateChat(user){
  if(user=== (isStalkerless ? 'Stalkerless' : null)) return;
  activePrivateChat = user;
  document.getElementById('privateChatContainer').style.display='flex';
}

/* =========================
   BOTONES ROOT
========================= */
shadowBtn.onclick = () => alert("ShadowBan aplicado");
viewMapBtn.onclick = () => alert("Mapa activado");
freezeBtn.onclick = () => {
  globalFreeze = !globalFreeze;
  alert(`Freeze global: ${globalFreeze}`);
};
godViewBtn.onclick = () => alert("GodView activado");
vanishBtn.onclick = () => alert("Modo invisible activado");

/* =========================
   BOTONES NAVEGACIÓN
========================= */
document.getElementById("backToStartBtn").onclick = ()=>{
  showScreen(landingScreen);
  currentRoom = null;
};

document.getElementById("backToRoomsBtn").onclick = ()=>{
  showScreen(roomsListScreen);
  activePrivateChat = null;
  renderRooms();
};

/* =========================
   INICIALIZACIÓN
========================= */
renderRooms();
showScreen(landingScreen);
