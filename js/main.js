/* ===============================
   UMBRALA MAIN SYSTEM
   =============================== */

const boot = document.getElementById("boot");
const rooms = document.getElementById("rooms");
const chat = document.getElementById("chat");

const messages = document.getElementById("messages");
const roomName = document.getElementById("roomName");

const msgInput = document.getElementById("msgInput");
const imgInput = document.getElementById("imgInput");
const imgBtn = document.getElementById("imgBtn");

const channel = new BroadcastChannel("umbrala");

let currentRoom = "";
let isRoot = false;

/* ===============================
   AUDIO GLITCH (WEB AUDIO)
   =============================== */

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playGlitch() {
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

/* ===============================
   NAVEGACIÓN
   =============================== */

document.getElementById("initBtn").onclick = () => {
  boot.classList.add("hidden");
  rooms.classList.remove("hidden");
};

document.getElementById("exitBtn").onclick = () => {
  rooms.classList.add("hidden");
  boot.classList.remove("hidden");
};

document.getElementById("logo").onclick = () => {
  rooms.classList.add("hidden");
  boot.classList.remove("hidden");
};

function enterRoom(room) {
  currentRoom = room;
  roomName.textContent = room;
  rooms.classList.add("hidden");
  chat.classList.remove("hidden");
}

/* ===============================
   ENVÍO DE MENSAJES
   =============================== */

document.getElementById("chatForm").onsubmit = e => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  sendMessage({
    room: currentRoom,
    type: "text",
    content: text
  });

  msgInput.value = "";
};

imgBtn.onclick = () => imgInput.click();

imgInput.onchange = () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    sendMessage({
      room: currentRoom,
      type: "img",
      content: reader.result
    });
  };
  reader.readAsDataURL(file);
};

/* ===============================
   BROADCAST
   =============================== */

function sendMessage(msg) {
  channel.postMessage(msg);
  renderMessage(msg);
}

channel.onmessage = e => {
  if (e.data.room === currentRoom) {
    renderMessage(e.data);
  }
};

/* ===============================
   RENDER + EFÍMERO
   =============================== */

function renderMessage(msg) {
  const div = document.createElement("div");
  div.className = "message";

  if (msg.type === "text") {
    div.textContent = msg.content;
  }

  if (msg.type === "img") {
    const img = document.createElement("img");
    img.src = msg.content;
    div.appendChild(img);
  }

  const timer = document.createElement("span");
  timer.className = "timer";
  let t = 10;
  timer.textContent = ` ${t}`;
  div.appendChild(timer);

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  let glitchPlayed = false;

  const interval = setInterval(() => {
    t--;
    timer.textContent = ` ${t}`;

    /* BLUR PROGRESIVO */
    if (t === 6) div.classList.add("blur-1");
    if (t === 4) div.classList.add("blur-2");
    if (t === 2) div.classList.add("blur-3");

    /* GLITCH + SONIDO FINAL */
    if (t === 1 && !glitchPlayed) {
      div.classList.add("glitch");
      playGlitch();
      glitchPlayed = true;
    }

    if (t <= 0) {
      div.remove();
      clearInterval(interval);
    }
  }, 1000);
}

/* ===============================
   ROOT MODE (SECRETO)
   =============================== */

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    isRoot = true;
    enterRoom("ROOT");
  }
});
