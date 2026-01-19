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
const backBtn = document.getElementById("backToRooms");
const roomTitle = document.getElementById("roomTitle");
const roomCount = document.getElementById("roomCount");
const usersList = document.getElementById("usersList");

let currentRoom = "";
let nick = "";

/* BOOT */
const bootLines = [
  "Inicializando Umbrala...",
  "Comunica en las sombras",
  "Anónimo. Sin rastro, sin identidad",
  "Efímero.Los mensajes desaparecen",
  "Privado. No logs, no tracking",
  "Seguro. Conexión encriptada",
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

/* SALAS */
const rooms = [
  { name:"🌍 Global", users:3 },
  { name:"🌵 Norte", users:2 },
  { name:"🏙 Centro", users:1 },
  { name:"🌊 Sur", users:0 },
  { name:"🧠 Curiosidades", users:0 }
  { name:"🕳️ Vacío", users:0 }
];

rooms.forEach(r => {
  const div = document.createElement("div");
  div.className = "room";
  div.textContent = `${r.name}  👥 ${r.users}`;
  div.onclick = () => {
    currentRoom = r.name;
    roomTitle.textContent = r.name;
    roomCount.textContent = `👥 ${r.users + 1}`;
    nickModal.classList.add("active");
  };
  roomsList.appendChild(div);
});

/* NICK */
document.getElementById("randomNick").onclick = () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 999);
};

document.getElementById("enterChat").onclick = () => {
  nick = nickInput.value || "ghost";
  nickModal.classList.remove("active");
  usersList.innerHTML = `<div>${nick}</div>`;
  switchScreen("chat");
};

/* CHAT */
backBtn.onclick = () => switchScreen("rooms");

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

fileBtn.onclick = () => fileInput.click();

fileInput.onchange = () => {
  const f = fileInput.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);

  if (f.type.startsWith("image")) addMessage("image", url, 60000);
  if (f.type.startsWith("audio")) addMessage("audio", url, 60000);

  fileInput.value = "";
};

function sendMessage() {
  if (!msgInput.value.trim()) return;
  addMessage("text", `${nick}: ${msgInput.value}`, 60000);
  msgInput.value = "";
}

/* MENSAJES */
function addMessage(type, content, duration) {
  const div = document.createElement("div");
  div.className = "message";

  if (type === "text") div.textContent = content;
  if (type === "image") div.innerHTML = `<img src="${content}" width="140">`;
  if (type === "audio") div.innerHTML = `<audio src="${content}" controls></audio>`;

  messages.appendChild(div);

  div.style.opacity = 1;
  div.style.transition = `opacity ${duration}ms linear`;

  setTimeout(() => div.style.opacity = 0, 50);
  setTimeout(() => div.remove(), duration);
}

/* UTILS */
function switchScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
