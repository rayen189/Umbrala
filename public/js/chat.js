console.log("🟢 chat.js cargado");

/* ================= SOCKET ================= */

const socket = io();

/* ================= STATE ================= */

let currentRoom = null;

/* ================= ELEMENTOS ================= */

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

/* ================= JOIN ROOM (GLOBAL) ================= */
/* 👇 ESTO SOLUCIONA main.js:65 */

window.joinRoom = function (room) {
  currentRoom = room;

  socket.emit("joinRoom", {
    nick: window.nick,
    room
  });
};

/* ================= RENDER MENSAJES ================= */

function renderMessage(html) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = html;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ================= SOCKET LISTENERS ================= */

socket.on("message", data => {
  let content = "";

  if (data.type === "image") {
    content = `
      <strong>${data.user}</strong><br>
      <img src="${data.url}" class="chat-img">
    `;
  } else if (data.type === "audio") {
    content = `
      <strong>${data.user}</strong><br>
      <audio controls class="chat-audio">
        <source src="${data.url}" type="audio/webm">
      </audio>
    `;
  } else {
    content = `<strong>${data.user}:</strong> ${data.text}`;
  }

  renderMessage(content);
});

/* ================= ENVIAR TEXTO ================= */

sendBtn.onclick = sendText;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendText();
  }
});

function sendText() {
  if (!msgInput.value.trim() || !currentRoom) return;

  socket.emit("chatMessage", {
    room: currentRoom,
    text: msgInput.value
  });

  msgInput.value = "";
}

/* ================= ENVIAR IMAGEN ================= */

imgBtn.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file || !currentRoom) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  socket.emit("chatMessage", {
    room: currentRoom,
    type: "image",
    url: data.url
  });

  fileInput.value = "";
};

/* ================= AUDIO (NOTA DE VOZ) ================= */

let mediaRecorder;
let audioChunks = [];
let recording = false;

recordBtn.onclick = async () => {
  if (!currentRoom) return;

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
        room: currentRoom,
        type: "audio",
        url: data.url
      });
    };

    mediaRecorder.start();
    recording = true;
    recordBtn.textContent = "⏹️";
    recordBtn.classList.add("recording");

  } else {
    mediaRecorder.stop();
    recording = false;
    recordBtn.textContent = "🎙️";
    recordBtn.classList.remove("recording");
  }
};
