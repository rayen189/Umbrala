/* ===============================
   SCREENS
================================ */
const terminalScreen = document.getElementById("terminalScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

/* ===============================
   TERMINAL
================================ */
const terminal = document.getElementById("terminal");

const bootLines = [
  "ejecutando kernel.um",
  "cargando shadow.core",
  "montando rooms.map",
  "sincronizando void.interface",
  "estado: estable",
  "inicializando UMBRALA..."
];

let i = 0;

function boot() {
  if (i < bootLines.length) {
    terminal.innerHTML += "> " + bootLines[i] + "<br>";
    i++;
    setTimeout(boot, 700);
  } else {
    setTimeout(() => {
      terminalScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 1200);
  }
}
boot();

/* ===============================
   SALAS + CONTADOR GLOBAL (DEMO)
================================ */
let globalUsers = Math.floor(Math.random() * 20) + 5;

document.querySelectorAll(".room").forEach(room => {
  room.innerHTML += ` <span class="count">👥 ${globalUsers}</span>`;

  room.onclick = () => {
    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");
    document.getElementById("chatHeader").textContent = room.textContent;
    initRoom();
  };
});

/* ===============================
   VOLVER
================================ */
document.getElementById("backBtn").onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};

/* ===============================
   USUARIOS (SIMULADOS)
================================ */
const usersList = document.getElementById("usersList");
const roomCount = document.getElementById("roomCount");

let users = ["neo_01", "void_x", "umbra77", "cypher"];

function initRoom() {
  usersList.innerHTML = "";
  users.forEach(u => addUser(u));
  roomCount.textContent = users.length;
}

function addUser(name) {
  const u = document.createElement("div");
  u.className = "user";
  u.textContent = name;
  u.onclick = () => openPrivate(name);
  usersList.appendChild(u);
}

/* ===============================
   TABS PRIVADOS
================================ */
const tabs = document.getElementById("privateTabs");
let activeTab = "room";

function openPrivate(name) {
  if ([...tabs.children].some(t => t.textContent === name)) return;

  const tab = document.createElement("div");
  tab.className = "tab";
  tab.textContent = name;
  tab.onclick = () => setTab(tab);
  tabs.appendChild(tab);
}

function setTab(tab) {
  [...tabs.children].forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  activeTab = tab.textContent;
}

/* ===============================
   CHAT + FILTRO
================================ */
const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");

const banned = ["puta", "mierda", "fuck", "weon"];

function clean(text) {
  return !banned.some(w => text.toLowerCase().includes(w));
}

/* ===============================
   MENSAJE EFÍMERO + TIMER
================================ */
function ephemeral(el) {
  let time = 30;
  const t = document.createElement("div");
  t.className = "timer";
  t.textContent = time;
  el.appendChild(t);

  const interval = setInterval(() => {
    time--;
    t.textContent = time <= 5 ? time : "";

    if (time <= 0) {
      clearInterval(interval);
      el.style.opacity = 0;
      setTimeout(() => el.remove(), 500);
    }
  }, 1000);
}

/* ===============================
   ENVIAR
================================ */
sendBtn.onclick = () => {
  if (input.value && clean(input.value)) {
    const m = document.createElement("div");
    m.className = "message";
    m.textContent = `[${activeTab}] ${input.value}`;
    messages.appendChild(m);
    ephemeral(m);
  }

  if (fileInput.files[0]) {
    const f = fileInput.files[0];
    let el;

    if (f.type.startsWith("image")) {
      el = document.createElement("img");
      el.src = URL.createObjectURL(f);
      el.style.maxWidth = "180px";
    } else {
      el = document.createElement("audio");
      el.src = URL.createObjectURL(f);
      el.controls = true;
    }

    el.className = "message";
    messages.appendChild(el);
    ephemeral(el);
  }

  input.value = "";
  fileInput.value = "";
};
