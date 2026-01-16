/* =========================
   UMBRALA — MAIN SYSTEM
   ========================= */

const bootScreen = document.getElementById("boot");
const roomsScreen = document.getElementById("rooms");
const chatScreen = document.getElementById("chat");

const initBtn = document.getElementById("initBtn");
const exitBtn = document.getElementById("exitBtn");
const logo = document.getElementById("logo");

const roomNameEl = document.getElementById("roomName");
const messagesEl = document.getElementById("messages");

const chatForm = document.getElementById("chatForm");
const msgInput = document.getElementById("msgInput");
const imgInput = document.getElementById("imgInput");
const imgBtn = document.getElementById("imgBtn");

/* =========================
   STATE
   ========================= */

let currentRoom = null;

/* =========================
   AUDIO (GLITCH)
   ========================= */

const glitchSound = new Audio("data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=");
glitchSound.volume = 0.4;

/* =========================
   BOOT
   ========================= */

initBtn.addEventListener("click", () => {
  glitchSound.play();
  bootScreen.classList.add("hidden");
  roomsScreen.classList.remove("hidden");
});

/* =========================
   NAVIGATION
   ========================= */

exitBtn.addEventListener("click", () => {
  glitchSound.play();
  roomsScreen.classList.add("hidden");
  bootScreen.classList.remove("hidden");
});

logo.addEventListener("click", () => {
  glitchSound.play();
  roomsScreen.classList.add("hidden");
  bootScreen.classList.remove("hidden");
});

function enterRoom(room) {
  glitchSound.play();
  currentRoom = room;
  roomNameEl.textContent = room;
  messagesEl.innerHTML = "";
  roomsScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
}

function backRooms() {
  glitchSound.play();
  chatScreen.classList.add("hidden");
  roomsScreen.classList.remove("hidden");
}

/* =========================
   CHAT
   ========================= */

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!msgInput.value.trim()) return;
  sendMessage({ text: msgInput.value });
  msgInput.value = "";
});

imgBtn.addEventListener("click", () => {
  imgInput.click();
});

imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    sendMessage({ image: reader.result });
  };
  reader.readAsDataURL(file);
  imgInput.value = "";
});

/* =========================
   MESSAGE HANDLER
   ========================= */

function sendMessage({ text = null, image = null }) {
  glitchSound.currentTime = 0;
  glitchSound.play();

  const msg = document.createElement("div");
  msg.className = "message glitch";

  if (text) {
    msg.textContent = text;
  }

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    msg.appendChild(img);
  }

  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  setTimeout(() => msg.classList.remove("glitch"), 300);

  // Ephemeral destruction (15s)
  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 400);
  }, 15000);
}

/* =========================
   GLOBAL ACCESS (HTML)
   ========================= */

window.enterRoom = enterRoom;
window.backRooms = backRooms;
