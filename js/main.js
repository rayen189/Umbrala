let isStalkerless = false;
let currentRoom = null;

const rooms = [
  { name: "Norte de Chile 🌵", users: [] },
  { name: "Centro 🌃", users: [] },
  { name: "Sur de Chile 🗻", users: [] },
  { name: "Global 🌎", users: [] },
  { name: "Directo al Vacío 🕳️", users: [], hidden: true }
];

const landingScreen = document.getElementById("landingScreen");
const roomsListScreen = document.getElementById("roomsListScreen");
const chatScreen = document.getElementById("chatScreen");

const roomsList = document.getElementById("roomsList");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const imageInput = document.getElementById("imageInput");
const connectedUsers = document.getElementById("connectedUsers");
const currentRoomName = document.getElementById("currentRoomName");
const totalUsersCounter = document.getElementById("totalUsersCounter");

const initializeBtn = document.getElementById("initializeBtn");
const backToStartBtn = document.getElementById("backToStartBtn");
const backToRoomsBtn = document.getElementById("backToRoomsBtn");
const sendBtn = document.getElementById("sendBtn");
const rootLoginBtn = document.getElementById("rootLoginBtn");
const rootBar = document.getElementById("rootBar");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  screen.style.display = "flex";
}

function portalExit(from, to) {
  from.classList.add("portal-exit");
  setTimeout(() => {
    from.classList.remove("portal-exit");
    showScreen(to);
    to.classList.add("portal-enter");
    setTimeout(() => to.classList.remove("portal-enter"), 700);
  }, 600);
}

function renderRooms() {
  roomsList.innerHTML = "";
  rooms.forEach((r, i) => {
    if (r.hidden && !isStalkerless) return;
    const btn = document.createElement("button");
    btn.className = "portal-btn";
    btn.textContent = `${r.name} (${r.users.length})`;
    btn.onclick = () => enterRoom(i);
    roomsList.appendChild(btn);
  });
}

function enterRoom(i) {
  currentRoom = i;
  currentRoomName.textContent = rooms[i].name;
  portalExit(roomsListScreen, chatScreen);
  renderUsers();
}

function renderUsers() {
  connectedUsers.innerHTML = "";
  rooms[currentRoom].users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    connectedUsers.appendChild(li);
  });
}

sendBtn.onclick = () => {
  if (!chatInput.value) return;
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = chatInput.value;
  chatMessages.appendChild(div);
  setTimeout(() => {
    div.classList.add("fade-out");
    setTimeout(() => div.remove(), 500);
  }, 30000);
  chatInput.value = "";
};

initializeBtn.onclick = () => {
  portalExit(landingScreen, roomsListScreen);
  renderRooms();
};

backToStartBtn.onclick = () => portalExit(roomsListScreen, landingScreen);
backToRoomsBtn.onclick = () => portalExit(chatScreen, roomsListScreen);

rootLoginBtn.onclick = () => {
  const u = prompt("Usuario:");
  const p = prompt("Clave:");
  if (u === "stalkerless" && p === "stalkerless1234") {
    isStalkerless = true;
    rootBar.style.display = "flex";
    alert("Modo Stalkerless activo");
    renderRooms();
  }
};

showScreen(landingScreen);
