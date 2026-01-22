console.log("🟢 chat.js cargado");

const socket = io();

/* ================= ELEMENTOS ================= */

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

const usersList = document.getElementById("usersList");
const chatTabs = document.getElementById("chatTabs");

/* ================= JOIN DESDE main.js ================= */

window.joinRoom = function (room) {
  if (!window.nick || !room) {
    console.warn("⚠️ joinRoom cancelado", window.nick, room);
    return;
  }

  console.log("🔌 Uniéndose a sala:", room);

  socket.emit("joinRoom", {
    nick: window.nick,
    room
  });
};

/* ================= MENSAJES ================= */

socket.on("message", data => {
  const msg = document.createElement("div");
  msg.className = "message";

  msg.innerHTML = `
    <span class="user">${data.user}</span>
    <div class="bubble">${data.text}</div>
  `;

  messages.appendChild(msg);

  // 🔥 AUTO SCROLL FIJO (PC + MÓVIL)
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 50);
});

/* ================= ENVIAR TEXTO ================= */

sendBtn.addEventListener("click", sendText);
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendText();
  }
});
function sendText() {
  // 🔥 FORZAR LECTURA EN MÓVIL
  const text = msgInput.value?.trim();

  console.log("✏️ Texto detectado:", text);

  if (!text) return;

  socket.emit("chatMessage", {
    room: window.currentRoom,
    text
  });

  msgInput.value = "";
  msgInput.focus();
}

/* ================= IMAGEN ================= */

imgBtn.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  socket.emit("chatMessage", {
    room: window.currentRoom,
    text: `<img src="${data.url}" class="chat-img">`
  });

  fileInput.value = "";
};

/* ================= AUDIO (MÓVIL COMPATIBLE) ================= */

let mediaRecorder;
let audioChunks = [];
let recording = false;

recordBtn.onclick = async () => {
  if (!recording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/mp4"
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: "audio/mp4" });
      const formData = new FormData();
      formData.append("file", blob);

      const res = await fetch("/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      socket.emit("chatMessage", {
        room: window.currentRoom,
        text: `
          <audio controls playsinline class="chat-audio">
            <source src="${data.url}" type="audio/mp4">
          </audio>
        `
      });
    };

    mediaRecorder.start();
    recording = true;
    recordBtn.textContent = "⏹️";
  } else {
    mediaRecorder.stop();
    recording = false;
    recordBtn.textContent = "🎙️";
  }
};
