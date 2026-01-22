console.log("🟢 chat.js cargado");

const socket = io();

/* ================= ELEMENTOS ================= */

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

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
  messages.scrollTop = messages.scrollHeight;
});

/* ================= ENVIAR TEXTO ================= */

sendBtn.onclick = sendText;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendText();
});

function sendText() {
  const text = msgInput.value.trim();
  if (!text) return;

  socket.emit("chatMessage", {
    room: window.currentRoom,
    text
  });

  msgInput.value = "";
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

/* ================= AUDIO ================= */

let mediaRecorder;
let audioChunks = [];
let recording = false;

recordBtn.onclick = async () => {
  if (!recording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
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
          <audio controls class="chat-audio">
            <source src="${data.url}" type="audio/webm">
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
