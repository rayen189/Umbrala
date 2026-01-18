/* ================= PANTALLAS ================= */
const bootScreen = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen  = document.getElementById("chatScreen");

const terminalOutput = document.getElementById("terminalOutput");

/* ================= BOOT TERMINAL ================= */
const bootLines = [
  "> UMBRALA v2.9",
  "> Inicializando comunicación efímera…",
  "> Enrutamiento anónimo activo",
  "> Sin registros · Sin rastros",
  "> Cargando nodos de conversación…",
  "> Sistema listo",
];

let lineIndex = 0;

function typeBoot() {
  if (lineIndex < bootLines.length) {
    terminalOutput.textContent += bootLines[lineIndex] + "\n";
    lineIndex++;
    setTimeout(typeBoot, 450);
  } else {
    setTimeout(openRooms, 1000);
  }
}

function openRooms() {
  bootScreen.classList.remove("active");
  roomsScreen.classList.add("active");
}

typeBoot();

/* ================= SALAS ================= */
const roomButtons = document.querySelectorAll(".room-btn");
const roomTitle = document.getElementById("roomTitle");

roomButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const roomName = btn.dataset.room;
    enterRoom(roomName);
  });
});

function enterRoom(roomName) {
  roomsScreen.classList.remove("active");
  chatScreen.classList.add("active");
  roomTitle.textContent = roomName;
}

/* ================= VOLVER A SALAS ================= */
document.getElementById("backRooms").onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};

/* ================= CHAT ================= */
const messages = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const imgInput = document.getElementById("imgInput");

sendBtn.onclick = sendMessage;
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  if (!chatInput.value && !imgInput.files.length) return;

  const msg = document.createElement("div");
  msg.className = "message me";

  if (chatInput.value) {
    msg.textContent = chatInput.value;
  }

  if (imgInput.files.length) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(imgInput.files[0]);
    img.style.maxWidth = "120px";
    img.style.display = "block";
    msg.appendChild(img);
    imgInput.value = "";
  }

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  chatInput.value = "";

  // efímero
  setTimeout(() => msg.remove(), 30000);
}

/* ================= USERS TOGGLE ================= */
document.getElementById("toggleUsers").onclick = () => {
  document.getElementById("usersList").classList.toggle("hidden");
};
