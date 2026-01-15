// ------------------ Variables ------------------
const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const privateChatScreen = document.getElementById('private-chat');

const initBtn = document.getElementById('init-btn');
const backLanding = document.getElementById('back-landing');
const roomsList = document.getElementById('rooms-list');
const chatRoomName = document.getElementById('chat-room-name');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const usersList = document.getElementById('users-list');
const exitRoom = document.getElementById('exit-room');

const privateUserSpan = document.getElementById('private-user');
const privateContainer = document.getElementById('private-container');
const privateInput = document.getElementById('private-input');
const privateSend = document.getElementById('private-send');
const closePrivate = document.getElementById('close-private');

let currentRoom = '';
let currentUser = 'User'+Math.floor(Math.random()*1000);
let usersByRoom = {};
let messagesByRoom = {};
let privateMessages = {};

// ------------------ Salas ------------------
const rooms = ['General','Norte','Sur','La Serena','VIP'];

function showRooms() {
  roomsList.innerHTML = '';
  rooms.forEach(room => {
    if(!usersByRoom[room]) usersByRoom[room]=[];
    if(!messagesByRoom[room]) messagesByRoom[room]=[];
    const div = document.createElement('div');
    div.innerHTML = `<strong>${room}</strong> - Usuarios conectados: ${usersByRoom[room].length} 
                     <button onclick="enterRoom('${room}')">Entrar</button>`;
    roomsList.appendChild(div);
  });
}

// ------------------ Navegación ------------------
initBtn.onclick = () => {
  landingScreen.style.display='none';
  roomsScreen.style.display='block';
  showRooms();
}
backLanding.onclick = () => {
  roomsScreen.style.display='none';
  landingScreen.style.display='block';
}

// ------------------ Entrar a sala ------------------
function enterRoom(room) {
  currentRoom = room;
  chatRoomName.textContent = room;
  if(!usersByRoom[room].includes(currentUser)) usersByRoom[room].push(currentUser);
  renderChat();
  renderUsers();
  roomsScreen.style.display='none';
  chatScreen.style.display='block';
}

// ------------------ Salir de sala ------------------
exitRoom.onclick = () => {
  usersByRoom[currentRoom] = usersByRoom[currentRoom].filter(u=>u!==currentUser);
  chatScreen.style.display='none';
  roomsScreen.style.display='block';
  showRooms();
}

// ------------------ Render chat ------------------
function renderChat() {
  chatContainer.innerHTML='';
  messagesByRoom[currentRoom].forEach(m=>{
    const div = document.createElement('div');
    div.textContent = `${m.user}: ${m.text}`;
    div.className = (m.user===currentUser)?'user':'user';
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ------------------ Enviar mensaje ------------------
sendBtn.onclick = () => {
  const text = chatInput.value.trim();
  if(!text) return;
  messagesByRoom[currentRoom].push({user:currentUser,text});
  chatInput.value='';
  renderChat();
}

// Enter en input
chatInput.addEventListener('keypress', e=>{
  if(e.key==='Enter') sendBtn.click();
});

// ------------------ Render usuarios ------------------
function renderUsers() {
  usersList.innerHTML='';
  usersByRoom[currentRoom].forEach(u=>{
    const li = document.createElement('li');
    li.textContent=u;
    if(u!==currentUser) li.onclick=()=>openPrivate(u);
    usersList.appendChild(li);
  });
}

// ------------------ Chat privado ------------------
function openPrivate(user) {
  privateUserSpan.textContent=user;
  if(!privateMessages[user]) privateMessages[user]=[];
  privateContainer.innerHTML='';
  privateMessages[user].forEach(m=>{
    const div = document.createElement('div');
    div.textContent=`${m.user}: ${m.text}`;
    privateContainer.appendChild(div);
  });
  chatScreen.style.display='none';
  privateChatScreen.style.display='block';
}

privateSend.onclick = () => {
  const text = privateInput.value.trim();
  const user = privateUserSpan.textContent;
  if(!text) return;
  privateMessages[user].push({user:currentUser,text});
  privateInput.value='';
  openPrivate(user);
}

closePrivate.onclick = () => {
  privateChatScreen.style.display='none';
  chatScreen.style.display='block';
  renderUsers();
}

// Inicial render
showRooms();
