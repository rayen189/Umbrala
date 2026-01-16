/* ===============================
   VARIABLES GLOBALES
=============================== */
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

let timeline = [];
let privateTimeline = [];
let globalFreeze = false;

/* ===============================
   ELEMENTOS HTML
=============================== */
const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const initializeBtn = document.getElementById('initializeBtn');
const rootLoginBtn = document.getElementById('rootLoginBtn');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const imageInput = document.getElementById('imageInput');

const roomsList = document.getElementById('roomsList');
const connectedUsersList = document.getElementById('connectedUsers');
const totalUsersCounter = document.getElementById('totalUsersCounter');
const currentRoomName = document.getElementById('currentRoomName');

const backToStartBtn = document.getElementById('backToStartBtn');
const backToRoomsBtn = document.getElementById('backToRoomsBtn');

const rootBar = document.getElementById('rootBar');
const shadowBtn = document.getElementById('shadowBtn');
const viewMapBtn = document.getElementById('viewMapBtn');
const freezeBtn = document.getElementById('freezeBtn');
const godViewBtn = document.getElementById('godViewBtn');
const vanishBtn = document.getElementById('vanishBtn');

const privateChatContainer = document.getElementById('privateChatContainer');
const privateChatName = document.getElementById('privateChatName');
const privateChatMessages = document.getElementById('privateChatMessages');
const chatMessages = document.getElementById('chatMessages');

/* ===============================
   FUNCIONES PRINCIPALES
=============================== */
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

function updateTotalUsers(){
  let allUsers=[];
  rooms.forEach(r=>allUsers.push(...r.users));
  totalUsersCounter.textContent=`Usuarios conectados: ${[...new Set(allUsers)].length}`;
}

function renderRooms(){
  roomsList.innerHTML='';
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
  currentRoom=i;
  chatMessages.innerHTML='';
  const userName = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  renderRooms();
  showScreen(chatScreen);
  renderConnectedUsers();
  currentRoomName.textContent = rooms[i].name;
}

/* ===============================
   CHAT
=============================== */
sendBtn.onclick = ()=>{
  if(globalFreeze) return alert("¡Chat congelado!");
  if(currentRoom===null && !activePrivateChat) return;

  const msg = chatInput.value.trim();
  if(!msg) return;
  const user = isStalkerless ? 'Stalkerless' : 'User'+Math.floor(Math.random()*1000);

  if(imageInput.files.length>0){
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e){
      const imgMsg = `[IMG] ${file.name}`;
      appendMessage({user, msg: imgMsg, room: rooms[currentRoom].name});
      setTimeout(()=>removeMessageFromDOM({user, msg: imgMsg, room: rooms[currentRoom].name}),30000);
    };
    reader.readAsDataURL(file);
    imageInput.value='';
  }

  if(activePrivateChat){
    const data = {user,msg,privateWith:activePrivateChat,time:new Date()};
    privateTimeline.push(data);
    appendPrivateMessage(data);
    setTimeout(()=>{ removePrivateMessageFromDOM(data); },60000);
  } else {
    const data = {user,msg,room:rooms[currentRoom].name,time:new Date()};
    timeline.push(data);
    appendMessage(data);
    setTimeout(()=>{ removeMessageFromDOM(data); },30000);
  }

  chatInput.value='';
};

function appendMessage(data){
  const div = document.createElement('div');
  div.textContent=`[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

function appendPrivateMessage(data){
  const div = document.createElement('div');
  div.textContent=`${data.user}: ${data.msg}`;
  div.className='glow';
  privateChatMessages.appendChild(div);
  privateChatMessages.scrollTop=privateChatMessages.scrollHeight;
}

function removeMessageFromDOM(data){
  const divs=document.querySelectorAll('#chatMessages div');
  divs.forEach(d=>{ if(d.textContent.includes(`[${data.room}] ${data.user}: ${data.msg}`)) d.remove(); });
}
function removePrivateMessageFromDOM(data){
  const divs=document.querySelectorAll('#privateChatMessages div');
  divs.forEach(d=>{ if(d.textContent.includes(`${data.user}: ${data.msg}`)) d.remove(); });
}

/* ===============================
   USUARIOS
=============================== */
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
  if(user === (isStalkerless?'Stalkerless':null)) return;
  activePrivateChat = user;
  privateChatName.textContent = user;
  privateChatContainer.style.display='flex';
}

/* ===============================
   BOTONES ROOT
=============================== */
shadowBtn.onclick = ()=>alert("ShadowBan aplicado");
viewMapBtn.onclick = ()=>alert("Mapa activado");
freezeBtn.onclick = ()=>{
  globalFreeze = !globalFreeze;
  alert(`Freeze global: ${globalFreeze}`);
};
godViewBtn.onclick = ()=>alert("GodView activado");
vanishBtn.onclick = ()=>alert("Modo invisible activado");

/* ===============================
   NAVEGACIÓN
=============================== */
backToStartBtn.onclick = ()=>{
  showScreen(landingScreen);
  currentRoom=null;
};
backToRoomsBtn.onclick = ()=>{
  showScreen(roomsListScreen);
  activePrivateChat=null;
  renderRooms();
};

/* ===============================
   LOGIN ROOT
=============================== */
rootLoginBtn.onclick = ()=>{
  const nick = prompt("Usuario Root:");
  const pass = prompt("Clave Root:");
  if(nick==='stalkerless' && pass==='stalkerless1234'){
    isStalkerless=true;
    rootBar.style.display='flex';
    alert("Root/Stalkerless activado");
  } else alert("Credenciales incorrectas");
};

/* ===============================
   INICIALIZAR
=============================== */
initializeBtn.onclick = ()=>{
  showScreen(roomsListScreen);
  renderRooms();
};

renderRooms();
showScreen(landingScreen);
