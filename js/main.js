/* =====================
   VARIABLES GLOBALES
===================== */
const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const terminal = document.getElementById("terminal");
const rooms = document.querySelectorAll(".room");

const nickModal = document.getElementById("nickModal");
const nickInput = document.getElementById("nickInput");
const randomNickBtn = document.getElementById("randomNick");
const enterRoomBtn = document.getElementById("enterRoom");
const nickError = document.getElementById("nickError");

const chatHeader = document.getElementById("chatHeader");
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const backBtn = document.getElementById("backBtn");

/* =====================
   ESTADO
===================== */
let currentRoom = "";
let nickname = "";

/* =====================
   UTILIDADES
===================== */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function systemMessage(text) {
  addMessage("", text, "system");
}

function addMessage(author, text, type = "user") {
  const div = document.createElement("div");
  div.className = `message ${type}`;

  div.innerHTML =
    type === "system"
      ? `<em>${text}</em>`
      : `<strong>${author}:</strong> ${text}`;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  // ⏳ mensajes efímeros
  const lifetime = type === "system" ? 5000 : 30000;
  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 500);
  }, lifetime);
}

function randomNick() {
  const pool = ["Shadow", "Void", "Anon", "Ghost", "Umbra", "Echo"];
  return pool[Math.floor(Math.random() * pool.length)] +
         Math.floor(Math.random() * 1000);
}

/* =====================
   BOOT SEQUENCE
===================== */
const bootLines = [
  "Inicializando sistema…",
  "Cargando módulos…",
  "Estableciendo anonimato…",
  "Umbrala listo."
];

let bootIndex = 0;

function bootSequence() {
  if (bootIndex < bootLines.length) {
    terminal.innerHTML += bootLines[bootIndex] + "<br>";
    bootIndex++;
    setTimeout(bootSequence, 600);
  } else {
    setTimeout(() => showScreen("rooms"), 800);
  }
}

bootSequence();

/* =====================
   SALAS
===================== */
rooms.forEach(room => {
  room.addEventListener("click", () => {
    currentRoom = room.textContent.trim();
    openNickModal();
  });
});

/* =====================
   MODAL NICK
===================== */
function openNickModal() {
  nickModal.classList.add("active");
  nickInput.value = "";
  nickError.textContent = "";
}

function closeNickModal() {
  nickModal.classList.remove("active");
}

randomNickBtn.addEventListener("click", () => {
  nickInput.value = randomNick();
});

enterRoomBtn.addEventListener("click", () => {
  const value = nickInput.value.trim();

  if (!value) {
    nickError.textContent = "Debes ingresar un nickname";
    return;
  }

  nickname = value;
  closeNickModal();
  enterRoom();
});

/* =====================
   CHAT
===================== */
function enterRoom() {
  showScreen("chat");
  chatHeader.textContent = currentRoom;
  messages.innerHTML = "";
  systemMessage(`Entraste a ${currentRoom} como ${nickname}`);
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  addMessage(nickname, text);
  msgInput.value = "";
}

backBtn.addEventListener("click", () => {
  showScreen("rooms");
  messages.innerHTML = "";
});

/* =====================
   FIX MÓVIL (FOCUS INPUT)
===================== */
msgInput.addEventListener("focus", () => {
  document.body.scrollTop = document.body.scrollHeight;
});
