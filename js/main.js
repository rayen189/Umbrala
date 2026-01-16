/* ==================================================
   UMBRALA — MAIN.JS
   Comunicación efímera · Presencia sin rastro
   Modo Stalkerless (Root invisible)
================================================== */

/* =========================
   ESTADO GLOBAL
========================= */
let isStalkerless = false;
let currentRoom = null;
let activePrivateChat = null;

let rooms = [
  { name: "Norte de Chile 🌵", users: [] },
  { name: "Centro 🌃", users: [] },
  { name: "Sur de Chile 🗻", users: [] },
  { name: "Global 🌎", users: [] },
  { name: "Curiosidades 🧠", users: [] },
  { name: "Umbral 🕳️", users: [], hidden: true }
];

let timeline = [];
let privateChats = {};

/* =========================
   DOM
========================= */
const landingScreen = document.getElementById("landingScreen");
const roomsListScreen = document.getElementById("roomsListScreen");
const chatScreen = document.getElementById("chatScreen");

const roomsList = document.getElementById("roomsList");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const imageInput = document.getElementById("imageInput");

const connectedUsers = document.getElementById("connectedUsers");
const totalUsersCounter = document.getElementById("totalUsersCounter");
const chatTitle = document.getElementById("chatTitle");

const initializeBtn = document.getElementById("initializeBtn");
const stalkerlessBtn = document.getElementById("stalkerlessBtn");

/* =========================
   EMOJIS
========================= */
const emojiPicker = document.getElementById("emoji-picker");
["😎","🔥","💀","✨","🕳️","⚡","🧠"].forEach(e=>{
  const s = document.createElement("span");
  s.className = "emoji";
  s.textContent = e;
  s.onclick = ()=> chatInput.value += e;
  emojiPicker.appendChild(s);
});

/* =========================
   PANTALLAS
========================= */
function showScreen(screen){
  [landingScreen, roomsListScreen, chatScreen].forEach(s=>s.style.display="none");
  screen.style.display = "flex";
}

/* =========================
   INICIO
========================= */
initializeBtn.onclick = ()=>{
  showScreen(roomsListScreen);
  renderRooms();
};

/* =========================
   LOGIN STALKERLESS
========================= */
stalkerlessBtn.onclick = ()=>{
  const u = prompt("Usuario:");
  const p = prompt("Password:");
  if(u==="stalkerless" && p==="stalkerless1234"){
    isStalkerless = true;
    alert("Modo Stalkerless activado");
    renderRooms();
    showStalkerlessPanel();
  } else {
    alert("Acceso denegado");
  }
};

/* =========================
   SALAS
========================= */
function renderRooms(){
  roomsList.innerHTML = "";
  rooms.forEach((room,i)=>{
    if(room.hidden && !isStalkerless) return;
    const btn = document.createElement("button");
    btn.className = "portal-btn";
    btn.textContent = `${room.name} (${room.users.length})`;
    btn.onclick = ()=> enterRoom(i);
    roomsList.appendChild(btn);
  });
  updateTotalUsers();
}

function enterRoom(i){
  currentRoom = i;
  chatTitle.textContent = rooms[i].name;
  const username = isStalkerless
    ? "Stalkerless"
    : "User" + Math.floor(Math.random()*1000);

  rooms[i].users.push(username);
  showScreen(chatScreen);
  updateUsersList();
  updateTotalUsers();
  loadRoomMessages();
}

/* =========================
   USUARIOS
========================= */
function updateUsersList(){
  connectedUsers.innerHTML = "";
  rooms[currentRoom].users.forEach(u=>{
    const li = document.createElement("li");
    li.textContent = u;
    li.onclick = ()=> openPrivateChat(u);
    connectedUsers.appendChild(li);
  });
}

function updateTotalUsers(){
  const total = rooms.reduce((a,r)=>a+r.users.length,0);
  totalUsersCounter.textContent = `Usuarios: ${total}`;
}

/* =========================
   CHAT SALA
========================= */
function loadRoomMessages(){
  chatMessages.innerHTML = "";
  timeline
    .filter(m=>m.room===rooms[currentRoom].name)
    .forEach(renderMessage);
}

sendBtn.onclick = ()=>{
  const msg = chatInput.value.trim();
  if(!msg) return;

  const sender = isStalkerless ? "Stalkerless" : rooms[currentRoom].users.slice(-1)[0];

  if(activePrivateChat){
    privateChats[activePrivateChat] ??= [];
    const data = { user: sender, msg };
    privateChats[activePrivateChat].push(data);
    renderPrivateMessage(data);
  } else {
    const data = {
      user: sender,
      msg,
      room: rooms[currentRoom].name,
      time: Date.now()
    };
    timeline.push(data);
    renderMessage(data);
  }
  chatInput.value = "";
};

/* =========================
   MENSAJES
========================= */
function renderMessage(data){
  const d = document.createElement("div");
  d.className = "glow";
  d.textContent = `[${data.room}] ${data.user}: ${data.msg}`;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderPrivateMessage(data){
  const d = document.createElement("div");
  d.className = "glow";
  d.textContent = `${data.user}: ${data.msg}`;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* =========================
   CHAT PRIVADO
========================= */
function openPrivateChat(user){
  if(user==="Stalkerless") return;
  activePrivateChat = user;
  chatTitle.textContent = `Privado · ${user}`;
  chatMessages.innerHTML = "";

  privateChats[user] ??= [];
  privateChats[user].forEach(renderPrivateMessage);

  addBackToRoomButton();
}

function addBackToRoomButton(){
  if(document.getElementById("backRoomBtn")) return;
  const b = document.createElement("button");
  b.id = "backRoomBtn";
  b.textContent = "← Volver a sala";
  b.onclick = backToRoom;
  chatTitle.after(b);
}

function backToRoom(){
  activePrivateChat = null;
  chatTitle.textContent = rooms[currentRoom].name;
  document.getElementById("backRoomBtn")?.remove();
  loadRoomMessages();
}

/* =========================
   IMÁGENES
========================= */
imageInput.onchange = e=>{
  const file = e.target.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = ev=>{
    const img = document.createElement("img");
    img.src = ev.target.result;
    img.style.maxWidth = "150px";
    chatMessages.appendChild(img);
    setTimeout(()=>img.remove(),8000);
  };
  r.readAsDataURL(file);
};

/* =========================
   PANEL STALKERLESS
========================= */
function showStalkerlessPanel(){
  const p = document.createElement("div");
  p.id = "stalkerlessPanel";
  p.innerHTML = `
    <h3>STALKERLESS</h3>
    <button onclick="freezeChat()">Freeze</button>
    <button onclick="ghostMode()">Ghost</button>
    <button onclick="purge()">Purge</button>
  `;
  document.body.appendChild(p);
}

window.freezeChat = ()=> alert("Chat congelado (visual)");
window.ghostMode = ()=> alert("Modo invisible activo");
window.purge = ()=> {
  chatMessages.innerHTML = "";
  alert("Mensajes eliminados localmente");
};
