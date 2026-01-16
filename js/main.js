let isStalkerless = false;
let currentRoom = null;
let activePrivateChat = null;
let rooms = [
  {name:"Norte de Chile 🌵", users:[], hidden:false},
  {name:"Sur de Chile 🗻", users:[], hidden:false},
  {name:"Centro 🌃", users:[], hidden:false},
  {name:"Global 🌎", users:[], hidden:false},
  {name:"Curiosidades 🧠", users:[], hidden:false},
  {name:"Sala secreta 🕳️", users:[], hidden:true}
];
let timeline = [];
let globalFreeze = false;

const landingScreen = document.getElementById('landingScreen');
const roomsListScreen = document.getElementById('roomsListScreen');
const chatScreen = document.getElementById('chatScreen');

const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const imageInput = document.getElementById('imageInput');
const roomsList = document.getElementById('roomsList');
const connectedUsers = document.getElementById('connectedUsers');
const chatTitle = document.getElementById('chatTitle');
const totalUsersCounter = document.getElementById('totalUsersCounter');

const rootBar = document.getElementById("rootBar");
const shadowBtn = document.getElementById("shadowBtn");
const viewMapBtn = document.getElementById("viewMapBtn");
const freezeBtn = document.getElementById("freezeBtn");
const godViewBtn = document.getElementById("godViewBtn");
const vanishBtn = document.getElementById("vanishBtn");

const emojiPicker = document.getElementById('emoji-picker');
const emojiList = ["😎","🔥","💀","✨","🕳️","💻","⚡"];
emojiList.forEach(e=>{
  const span = document.createElement('span');
  span.className='emoji';
  span.textContent=e;
  span.onclick=()=> { chatInput.value+=e; chatInput.focus(); };
  emojiPicker.appendChild(span);
});

// ===================== Funciones básicas =====================
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>s.style.display='none');
  screen.style.display='flex';
}

// ===================== INICIALIZAR =====================
document.getElementById('initializeBtn').onclick = ()=>{
  showScreen(roomsListScreen);
  renderRooms();
};

// ===================== LOGIN ROOT =====================
document.getElementById('stalkerlessBtn').onclick = ()=>{
  const nick = prompt("Usuario Root:");
  const pass = prompt("Password Root:");
  if(nick==="stalkerless" && pass==="stalkerless1234"){
    isStalkerless=true;
    rootBar.style.display="flex";
    alert("Stalkerless activado");
    showScreen(roomsListScreen);
    renderRooms();
  } else alert("Credenciales incorrectas");
};

// ===================== RENDER SALAS =====================
function renderRooms(){
  roomsList.innerHTML="";
  let totalUsers=0;
  rooms.forEach((r,i)=>{
    if(r.hidden && !isStalkerless) return;
    totalUsers+=r.users.length;
    const btn = document.createElement('button');
    btn.textContent=`${r.name} (${r.users.length} usuarios)`;
    btn.className="portal-btn";
    btn.onclick=()=> enterRoom(i);
    roomsList.appendChild(btn);
  });
  totalUsersCounter.textContent=`Usuarios conectados: ${totalUsers}`;
}

function enterRoom(i){
  currentRoom=i;
  chatMessages.innerHTML="";
  const userName=isStalkerless?"Stalkerless":"User"+Math.floor(Math.random()*1000);
  rooms[i].users.push(userName);
  chatTitle.textContent = rooms[i].name;
  showScreen(chatScreen);
  renderConnectedUsers();
  renderRooms();
}

// ===================== CHAT =====================
sendBtn.onclick = ()=>{
  if(globalFreeze) return alert("Chat congelado");
  if(currentRoom===null) return;
  const msg = chatInput.value.trim();
  if(!msg) return;
  const user = isStalkerless?"Stalkerless":"User"+Math.floor(Math.random()*1000);
  const data = {user,msg,room:rooms[currentRoom].name,time:new Date()};
  timeline.push(data);
  appendMessage(data);
  chatInput.value="";
};

function appendMessage(data){
  const div = document.createElement('div');
  div.textContent=`[${data.room}] ${data.user}: ${data.msg}`;
  div.className='glow';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===================== USUARIOS =====================
function renderConnectedUsers(){
  connectedUsers.innerHTML="";
  rooms[currentRoom].users.forEach(u=>{
    const li=document.createElement('li');
    li.textContent=u;
    li.onclick=()=> startPrivateChat(u);
    connectedUsers.appendChild(li);
  });
}

// ===================== PRIVATE CHAT =====================
function startPrivateChat(user){
  activePrivateChat=user;
  alert("Chat privado con "+user);
}

// ===================== NAVEGACION =====================
document.getElementById("backToStartBtn").onclick = ()=>{
  showScreen(landingScreen);
  currentRoom=null;
};
document.getElementById("backToRoomsBtn").onclick = ()=>{
  showScreen(roomsListScreen);
  activePrivateChat=null;
  renderRooms();
};

// ===================== ROOT FUNCTIONS =====================
shadowBtn.onclick = ()=> alert("ShadowBan activado");
viewMapBtn.onclick = ()=> alert("ViewMap activado");
freezeBtn.onclick = ()=> {
  globalFreeze=!globalFreeze;
  alert("Freeze global: "+globalFreeze);
};
godViewBtn.onclick = ()=> alert("GodView activado");
vanishBtn.onclick = ()=> alert("Stalkerless se oculta");

// ===================== INICIAL =====================
renderRooms();
