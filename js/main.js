/* ================================
   UMBRALA – MAIN.JS FINAL
   ================================ */

/* ===== ESTADO GLOBAL ===== */
let currentRoom = "";
let nickname = "";
let users = [];
let messages = [];

/* ===== ELEMENTOS ===== */
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const roomButtons = document.querySelectorAll(".room-btn");
const roomTitle = document.getElementById("roomTitle");

const messagesBox = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const imgInput = document.getElementById("imgInput");

const backRoomsBtn = document.getElementById("backRooms");

const usersList = document.getElementById("usersList");
const usersUl = document.getElementById("users");
const toggleUsersBtn = document.getElementById("toggleUsers");

const userCounters = document.querySelectorAll("#roomUserCount");

/* ================================
   UTILIDADES
   ================================ */

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function randomNick() {
  return "anon_" + Math.floor(Math.random() * 9999);
}

function updateCounters() {
  userCounters.forEach(c => c.textContent = users.length);
}

function renderUsers() {
  usersUl.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    usersUl.appendChild(li);
  });
  updateCounters();
}

function addSystemMessage(text) {
  const div = document.createElement("div");
  div.className = "message system";
  div.textContent = text;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function addMessage(author, text, isMe = false) {
  const div = document.createElement("div");
  div.className = "message" + (isMe ? " me" : "");
  div.innerHTML = `<strong>${author}:</strong> ${text}`;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

/* ================================
   SALAS → CHAT
   ================================ */

roomButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentRoom = btn.dataset.room;
    roomTitle.textContent = currentRoom;

    // nickname automático (puedes luego poner selector)
    nickname = randomNick();

    // reset
    messagesBox.innerHTML = "";
    users = [nickname];

    renderUsers();

    showScreen(chatScreen);
    addSystemMessage(`Has entrado a ${currentRoom}`);
  });
});

/* ================================
   ENVIAR MENSAJE
   ================================ */

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(nickname, text, true);
  chatInput.value = "";

  // Simulación de respuesta fantasma
  setTimeout(() => {
    addMessage("shadow", "…");
  }, 800);
}

/* ================================
   IMÁGENES
   ================================ */

imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const div = document.createElement("div");
    div.className = "message me";
    div.innerHTML = `<strong>${nickname}:</strong><br>
      <img src="${reader.result}" style="max-width:160px;border:1px solid #3cff8f;">`;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };
  reader.readAsDataURL(file);

  imgInput.value = "";
});

/* ================================
   USUARIOS (TOGGLE)
   ================================ */

toggleUsersBtn.addEventListener("click", () => {
  usersList.classList.toggle("hidden");
});

/* ================================
   VOLVER A SALAS
   ================================ */

backRoomsBtn.addEventListener("click", () => {
  showScreen(roomsScreen);
  messages = [];
  users = [];
  updateCounters();
});

/* ================================
   INIT
   ================================ */

showScreen(roomsScreen);
updateCounters();
