/* ===============================
   UMBRALA MAIN.JS — FINAL
   Compatible con tu index.html
================================ */

// ---------- ESTADO GLOBAL ----------
let currentRoom = null;
let nickname = null;
let usersInRoom = [];

// ---------- ELEMENTOS ----------
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const roomButtons = document.querySelectorAll(".room-btn");
const roomTitle = document.getElementById("roomTitle");

const backRoomsBtn = document.getElementById("backRooms");
const toggleUsersBtn = document.getElementById("toggleUsers");

const messagesBox = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const imgInput = document.getElementById("imgInput");

const usersList = document.getElementById("usersList");
const usersUl = document.getElementById("users");

const roomUserCountRooms = document.getElementById("roomUserCount");
const roomUserCountChat = document.querySelector(".chat-header .counter span");

// ---------- UTILIDADES ----------
function showScreen(screen) {
  roomsScreen.classList.remove("active");
  chatScreen.classList.remove("active");
  screen.classList.add("active");
}

function generateRandomNick() {
  const names = ["Sombra", "Eco", "Void", "Niebla", "Pulso", "Spectro", "Nodo"];
  const num = Math.floor(Math.random() * 999);
  return names[Math.floor(Math.random() * names.length)] + num;
}

function updateUserCount() {
  if (roomUserCountRooms) roomUserCountRooms.textContent = usersInRoom.length;
  if (roomUserCountChat) roomUserCountChat.textContent = usersInRoom.length;
}

function renderUsers() {
  usersUl.innerHTML = "";
  usersInRoom.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    usersUl.appendChild(li);
  });
}

// ---------- MENSAJES ----------
function addMessage(author, content, isImage = false) {
  const msg = document.createElement("div");
  msg.className = "message";

  if (isImage) {
    msg.innerHTML = `<strong>${author}:</strong><br><img src="${content}" class="chat-img">`;
  } else {
    msg.innerHTML = `<strong>${author}:</strong> ${content}`;
  }

  messagesBox.appendChild(msg);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// ---------- SALAS ----------
roomButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentRoom = btn.dataset.room;

    // pedir nickname
    let inputNick = prompt(
      `Entrando a ${currentRoom}\n\nElige tu nickname (o deja vacío para uno aleatorio):`
    );

    nickname = inputNick && inputNick.trim() !== ""
      ? inputNick.trim()
      : generateRandomNick();

    enterRoom();
  });
});

function enterRoom() {
  showScreen(chatScreen);

  roomTitle.textContent = currentRoom;
  messagesBox.innerHTML = "";

  usersInRoom = [nickname];
  updateUserCount();
  renderUsers();

  addMessage("Sistema", `Has entrado a ${currentRoom} como ${nickname}`);
}

// ---------- VOLVER A SALAS ----------
backRoomsBtn.addEventListener("click", () => {
  showScreen(roomsScreen);
  currentRoom = null;
  nickname = null;
  usersInRoom = [];
});

// ---------- ENVIAR TEXTO ----------
sendBtn.addEventListener("click", sendTextMessage);
chatInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendTextMessage();
});

function sendTextMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(nickname, text);
  chatInput.value = "";
}

// ---------- ENVIAR IMAGEN ----------
imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    addMessage(nickname, reader.result, true);
  };
  reader.readAsDataURL(file);

  imgInput.value = "";
});

// ---------- TOGGLE USUARIOS ----------
toggleUsersBtn.addEventListener("click", () => {
  usersList.classList.toggle("hidden");
});

// ---------- INICIO ----------
showScreen(roomsScreen);
