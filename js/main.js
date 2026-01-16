document.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("boot");
  const rooms = document.getElementById("rooms");
  const chat = document.getElementById("chat");
  const initBtn = document.getElementById("initBtn");

  initBtn.onclick = () => {
    boot.classList.add("hidden");
    rooms.classList.remove("hidden");
  };
});
const WS_URL = "wss://TU-PROYECTO.up.railway.app"; // CAMBIAR
const socket = new WebSocket(WS_URL);

let username = "u" + Math.floor(Math.random() * 9999);
let currentRoom = null;
let privateTarget = null;

const PUBLIC_LIFE = 15000;
const PRIVATE_LIFE = 60000;

socket.onmessage = e => {
  const data = JSON.parse(e.data);

  if (data.type === "users") {
    users.innerHTML = data.users
      .filter(u => u !== username)
      .map(u => `<div onclick="startPrivate('${u}')">${u}</div>`)
      .join("");
  }

  if (data.type === "message") {
    const m = document.createElement("div");
    m.className = "message";
    m.textContent = `${data.user}: ${data.text}`;
    messages.appendChild(m);
    autoDestroy(m, data.private ? PRIVATE_LIFE : PUBLIC_LIFE);
  }

  if (data.type === "typing") {
    typing.textContent = `${data.user} escribiendo…`;
    setTimeout(() => typing.textContent = "", 1000);
  }
};

function autoDestroy(el, t) {
  setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 800);
  }, t);
}

initBtn.onclick = () => {
  boot.classList.add("hidden");
  rooms.classList.remove("hidden");
};

function enterRoom(r) {
  currentRoom = r;
  rooms.classList.add("hidden");
  chat.classList.remove("hidden");
  roomName.textContent = r;

  socket.send(JSON.stringify({
    type: "join",
    room: r,
    user: username
  }));
}

chatForm.onsubmit = e => {
  e.preventDefault();
  if (!msgInput.value) return;

  socket.send(JSON.stringify({
    type: "message",
    text: msgInput.value,
    private: !!privateTarget,
    to: privateTarget
  }));

  msgInput.value = "";
};

msgInput.oninput = () => {
  socket.send(JSON.stringify({ type: "typing" }));
};

function startPrivate(u) {
  privateTarget = u;
  roomName.textContent = `Privado con ${u}`;
}

function backRooms() {
  privateTarget = null;
  chat.classList.add("hidden");
  rooms.classList.remove("hidden");
}

function goHome() {
  location.reload();
}

/* Anti-captura */
document.body.classList.add("protected");
const overlay = document.getElementById("antiOverlay");
const watermark = document.getElementById("watermark");

function protect(on) {
  document.body.classList.toggle("blur-screen", on);
  overlay.style.display = on ? "flex" : "none";
}

addEventListener("blur", () => protect(true));
addEventListener("focus", () => protect(false));
document.addEventListener("visibilitychange", () =>
  protect(document.hidden)
);

setInterval(() => {
  watermark.textContent =
    `UMBRALA · ${username} · ${new Date().toLocaleTimeString()}`;
}, 1000);
