// ===============================
// REFERENCIAS
// ===============================
const bootScreen = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");
const terminalOutput = document.getElementById("terminalOutput");
const roomTitle = document.getElementById("roomTitle");

// ===============================
// BOOT TERMINAL
// ===============================
const bootLines = [
  "> UMBRALA SYSTEM v2.4.1",
  "> Inicializando sistema...",
  "> Conexión anónima establecida",
  "> Cargando nodos...",
  "> Sistema listo."
];

let lineIndex = 0;

function typeBoot() {
  if (lineIndex < bootLines.length) {
    terminalOutput.textContent += bootLines[lineIndex] + "\n";
    lineIndex++;
    setTimeout(typeBoot, 450);
  } else {
    setTimeout(showRooms, 1200);
  }
}

function showRooms() {
  bootScreen.classList.remove("active");
  roomsScreen.classList.add("active");
}

// ⏱️ IMPORTANTE: arrancar cuando el DOM esté listo
window.addEventListener("load", typeBoot);

// ===============================
// SALAS → CHAT
// ===============================
const roomButtons = document.querySelectorAll(".room");

roomButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    enterRoom(btn.textContent.trim());
  });
});

function enterRoom(roomName) {
  roomsScreen.classList.remove("active");
  chatScreen.classList.add("active");
  roomTitle.textContent = roomName;

  addSystemMessage(`Has entrado a ${roomName}`);
}

// ===============================
// CHAT
// ===============================
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = text;

  messages.appendChild(msg);
  msgInput.value = "";
  messages.scrollTop = messages.scrollHeight;

  // Mensaje efímero
  setTimeout(() => msg.classList.add("fade"), 4000);
  setTimeout(() => msg.remove(), 6000);
}

function addSystemMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message system";
  msg.textContent = `[SYSTEM] ${text}`;
  messages.appendChild(msg);
}
