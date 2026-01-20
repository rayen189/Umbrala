/* ================= ELEMENTS ================= */

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

let nick = "";
let selectedRoom = "";

/* ================= BOOT ================= */

const bootLines = [
  "Inicializando Umbrala...",
  "Comunica en las sombras",
  "Anónimo. Sin rastro",
  "Efímero. Sin logs",
  "Seguro. Encriptado",
  "Sistema activo ✔"
];

let bootIndex = 0;

const bootInterval = setInterval(() => {
  terminal.innerHTML += bootLines[bootIndex] + "<br>";
  bootIndex++;

  if (bootIndex === bootLines.length) {
    clearInterval(bootInterval);
    setTimeout(() => switchScreen("rooms"), 700);
  }
}, 450);

/* ================= ROOMS ================= */

const rooms = [
  { id: "global", name: "🌍 Global", particles: "normal" },
  { id: "norte", name: "🌵 Norte", particles: "normal" },
  { id: "centro", name: "🏙 Centro", particles: "normal" },
  { id: "sur", name: "🌊 Sur", particles: "normal" },
  { id: "curiosidades", name: "🧠 Curiosidades", particles: "normal" },
  { id: "vacio", name: "🕳️ Vacío", particles: "vacio" }
];
roomsList.innerHTML = "";

rooms.forEach(room => {
  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `${room.name} <span>👥</span>`;

  div.onclick = () => {
    selectedRoom = room.name;
    roomTitle.textContent = room.name;

    if (window.setParticleMode) {
      setParticleMode(room.particles || "normal");
    }

    nickModal.classList.add("active");
  };

  roomsList.appendChild(div);
});

/* ================= NICK ================= */

document.getElementById("randomNick").onclick = () => {
  nickInput.value = "ghost_" + Math.floor(Math.random() * 9999);
};

document.getElementById("enterChat").onclick = () => {
  if (!nickInput.value.trim() || !selectedRoom) return;

  nick = nickInput.value.trim();
  nickModal.classList.remove("active");

  usersList.innerHTML = "";
  messages.innerHTML = "";

  switchScreen("chat");

  /* 🔌 ENTRAR A SALA SOCKET */
  if (typeof joinRoom === "function") {
    joinRoom(selectedRoom);
  }
};

/* ================= CHAT ================= */

backBtn.onclick = () => {
  switchScreen("rooms");

  if (window.setParticleMode) {
    setParticleMode("normal");
  }
};

/* ================= UTILS ================= */

function switchScreen(name) {
  Object.values(screens).forEach(screen =>
    screen.classList.remove("active")
  );
  screens[name].classList.add("active");
}
