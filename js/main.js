// ===== UMBRALA MAIN.JS (NO EVAL / GITHUB SAFE) =====

const screens = document.querySelectorAll(".screen");
const terminalOutput = document.getElementById("terminalOutput");

let currentRoom = "";
let nickname = "";

// ---------- UTIL ----------
function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");
}

// ---------- BOOT ----------
const bootLines = [
  "> UMBRALA v1.0",
  "> Inicializando sistema...",
  "> Conexión anónima establecida",
  "> Cargando nodos de salas...",
  "> Acceso permitido"
];

let bootIndex = 0;

function bootSequence() {
  if (bootIndex < bootLines.length) {
    terminalOutput.textContent += bootLines[bootIndex] + "\n";
    bootIndex++;
    setTimeout(bootSequence, 600);
  } else {
    setTimeout(() => showScreen("roomsScreen"), 800);
  }
}

bootSequence();

// ---------- SALAS ----------
document.querySelectorAll(".room").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRoom = btn.textContent.trim();
    document.getElementById("joiningRoomTitle").textContent = "JOINING ROOM";
    showScreen("identityScreen");
  });
});

// ---------- IDENTIDAD ----------
const nicknameInput = document.getElementById("nicknameInput");
const randomNickBtn = document.getElementById("randomNick");

function generateRandomNick() {
  return "anon_" + Math.floor(Math.random() * 9999);
}

randomNickBtn.addEventListener("click", () => {
  nicknameInput.value = generateRandomNick();
});

document.getElementById("enterChatBtn").addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) {
    nickname = generateRandomNick();
  }
  enterChat();
});

document.getElementById("backToRooms").addEventListener("click", () => {
  showScreen("roomsScreen");
});

// ---------- CHAT ----------
function enterChat() {
  document.getElementById("roomTitle").textContent = currentRoom;
  document.getElementById("messages").innerHTML = `
    <div class="system-msg">
      [SYSTEM] ${nickname} ha entrado a ${currentRoom}
    </div>
  `;
  showScreen("chatScreen");
}

document.getElementById("backRooms").addEventListener("click", () => {
  showScreen("roomsScreen");
});

// ---------- MENSAJES ----------
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const messagesBox = document.getElementById("messages");

function addMessage(text, type = "user") {
  const div = document.createElement("div");
  div.className = type === "system" ? "system-msg" : "msg";
  div.textContent = text;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  addMessage(`${nickname}: ${text}`);
  msgInput.value = "";
}

// ---------- IMÁGENES ----------
document.getElementById("imgInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = document.createElement("img");
    img.src = reader.result;
    img.className = "chat-image";
    messagesBox.appendChild(img);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };
  reader.readAsDataURL(file);
});
