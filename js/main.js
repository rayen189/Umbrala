const terminal = document.getElementById("terminal");
const terminalScreen = document.getElementById("terminalScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const bootLines = [
  "cargando núcleo...",
  "montando salas...",
  "sincronizando vacío...",
  "estado: estable",
  "iniciando UMBRALA"
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
    }, 1000);
  }
}
boot();

/* SALAS */
document.querySelectorAll(".room").forEach(room => {
  room.onclick = () => {
    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");
    document.getElementById("chatHeader").textContent = room.textContent;
    initRoom();
  };
});

/* VOLVER */
document.getElementById("backBtn").onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};

/* USUARIOS DEMO */
const users = ["neo", "void", "umbra", "cypher"];
const usersList = document.getElementById("usersList");
const roomCount = document.getElementById("roomCount");

function initRoom() {
  usersList.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u;
    div.onclick = () => openTab(u);
    usersList.appendChild(div);
  });
  roomCount.textContent = users.length;
}

/* TABS */
const tabs = document.getElementById("privateTabs");
let activeTab = "sala";

function openTab(name) {
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

/* CHAT */
const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");

document.getElementById("sendBtn").onclick = () => {
  if (input.value) {
    addMessage(`[${activeTab}] ${input.value}`);
    input.value = "";
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
    addEphemeral(el);
    fileInput.value = "";
  }
};

function addMessage(text) {
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = text;
  addEphemeral(div);
}

function addEphemeral(el) {
  messages.appendChild(el);
  let t = 30;
  const timer = document.createElement("div");
  timer.className = "timer";
  el.appendChild(timer);

  const interval = setInterval(() => {
    t--;
    timer.textContent = t <= 5 ? t : "";
    if (t <= 0) {
      clearInterval(interval);
      el.remove();
    }
  }, 1000);
}
