const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const terminal = document.getElementById("terminal");
const roomsList = document.getElementById("roomsList");
const nickModal = document.getElementById("nickModal");
const nickInput = document.getElementById("nickInput");

const msgInput = document.getElementById("msgInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendBtn");
const fileBtn = document.getElementById("fileBtn");
const fileInput = document.getElementById("fileInput");

let currentRoom = "";
let nick = "";

/* ===== BOOT ===== */
const bootLines = [
  "Inicializando Umbrala...",
  "Cargando módulos...",
  "Sistema activo ✔"
];
let i = 0;
const boot = setInterval(() => {
  terminal.innerHTML += bootLines[i] + "<br>";
  i++;
  if (i === bootLines.length) {
    clearInterval(boot);
    setTimeout(() => switchScreen("rooms"), 800);
  }
}, 600);

/* ===== SALAS ===== */
const rooms = [
  { name:"🌍 Global", users:3 },
  { name:"🌵 Norte", users:2 },
  { name:"🏙 Centro", users:1 },
  { name:"🌊 Sur", users:0 },
  { name:"🧠 Curiosidades", users:0 }
];

rooms.forEach(r=>{
  const div=document.createElement("div");
  div.className="room";
  div.innerText=`${r.name}  👥 ${r.users}`;
  div.onclick=()=>{
    currentRoom=r.name;
    nickModal.classList.add("active");
  };
  roomsList.appendChild(div);
});

/* ===== NICK ===== */
document.getElementById("randomNick").onclick=()=>{
  nickInput.value="ghost_"+Math.floor(Math.random()*999);
};
document.getElementById("enterChat").onclick=()=>{
  nick = nickInput.value || "ghost";
  nickModal.classList.remove("active");
  switchScreen("chat");
};

/* ===== CHAT ===== */
sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown",e=>{
  if(e.key==="Enter") sendMessage();
});
fileBtn.onclick=()=>fileInput.click();

fileInput.onchange=()=>{
  const f=fileInput.files[0];
  if(!f) return;
  const url=URL.createObjectURL(f);
  if(f.type.startsWith("image")) addMessage("image",url);
  if(f.type.startsWith("audio")) addMessage("audio",url);
  fileInput.value="";
};

function sendMessage(){
  if(!msgInput.value.trim()) return;
  addMessage("text",msgInput.value);
  msgInput.value="";
}

/* ===== MENSAJES EFÍMEROS ===== */
function addMessage(type,content){
  const div=document.createElement("div");
  div.className="message";
  if(type==="text") div.textContent=`${nick}: ${content}`;
  if(type==="image") div.innerHTML=`<img src="${content}" width="120">`;
  if(type==="audio") div.innerHTML=`<audio src="${content}" controls></audio>`;
  messages.appendChild(div);

  const duration = 60000; // sala
  div.style.opacity=1;
  div.style.transition=`opacity ${duration}ms linear`;
  setTimeout(()=>div.style.opacity=0,50);
  setTimeout(()=>div.remove(),duration);
}

/* ===== UTILS ===== */
function switchScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove("active"));
  screens[name].classList.add("active");
}
