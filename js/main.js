/* ===============================
   REFERENCIAS
================================ */
const terminal = document.getElementById("terminal");
const terminalScreen = document.getElementById("terminalScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const chatHeader = document.getElementById("chatHeader");
const backBtn = document.getElementById("backBtn");

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");

const usersList = document.getElementById("usersList");
const roomCount = document.getElementById("roomCount");

const tabs = document.getElementById("privateTabs");

/* ===============================
   BOOT TERMINAL
================================ */
const bootLines = [
  "cargando núcleo...",
  "montando salas...",
  "sincronizando vacío...",
  "estado: estable",
  "iniciando UMBRALA"
];

let bootIndex = 0;

function boot() {
  if (bootIndex < bootLines.length) {
    terminal.innerHTML += "> " + bootLines[bootIndex] + "<br>";
    bootIndex++;
    setTimeout(boot, 700);
  } else {
    setTimeout(() => {
      terminalScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 1000);
  }
}

boot();

/* ===============================
   ESTADO GLOBAL
================================ */
let activeTab = "";
let currentRoom = "";

const users = ["neo", "void", "umbra", "cypher"];

/* ===============================
   ENTRAR A SALA
================================ */
document.querySelectorAll(".room").forEach(room => {
  room.addEventListener("click", () => {
    currentRoom = room.textContent;

    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");

    chatHeader.textContent = currentRoom;

    initRoom(currentRoom);
  });
});

/* ===============================
   VOLVER A SALAS
================================ */
backBtn.addEventListener("click", () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");

  messages.innerHTML = "";
  tabs.innerHTML = "";
});

/* ===============================
   INICIALIZAR SALA
================================ */
function initRoom(roomName) {
  usersList.innerHTML = "";
  tabs.innerHTML = "";
  messages.innerHTML = "";

  /* TAB DE SALA */
  const roomTab = document.createElement("div");
  roomTab.className = "tab active";
  roomTab.textContent = roomName;
  roomTab.addEventListener("click", () => setTab(roomTab));
  tabs.appendChild(roomTab);

  activeTab = roomName;

  /* USUARIOS */
  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = user;
    div.addEventListener("click", () => openPrivateTab(user));
    usersList.appendChild(div);
  });

  roomCount.textContent = users.length;
}

/* ===============================
   TABS PRIVADOS
================================ */
function openPrivateTab(username) {
  if ([...tabs.children].some(t => t.textContent === username)) return;

  const tab = document.createElement("div");
  tab.className = "tab";
  tab.textContent = username;
  tab.addEventListener("click", () => setTab(tab));

  tabs.appendChild(tab);
}

function setTab(tab) {
  [...tabs.children].forEach(t => t.classList.remove("active"));
  tab.classList.add("active");

  activeTab = tab.textContent;
}

/* ===============================
   ENVÍO DE MENSAJES
================================ */
sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  if (input.value.trim() !== "") {
    addTextMessage(`[${activeTab}] ${input.value}`);
    input.value = "";
  }

  if (fileInput.files[0]) {
    const file = fileInput.files[0];
    let element;

    if (file.type.startsWith("image")) {
      element = document.createElement("img");
      element.src = URL.createObjectURL(file);
      element.style.maxWidth = "180px";
    } else if (file.type.startsWith("audio")) {
      element = document.createElement("audio");
      element.src = URL.createObjectURL(file);
      element.controls = true;
    }

    if (element) addEphemeral(element);
    fileInput.value = "";
  }
}

/* ===============================
   MENSAJES EFÍMEROS
================================ */
function addTextMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = text;
  addEphemeral(div);
}

function addEphemeral(element) {
  messages.appendChild(element);

  let time = 30;
  const timer = document.createElement("div");
  timer.className = "timer";
  element.appendChild(timer);

  const interval = setInterval(() => {
    time--;
    timer.textContent = time <= 5 ? time : "";

    if (time <= 0) {
      clearInterval(interval);
      element.remove();
    }
  }, 1000);
}
