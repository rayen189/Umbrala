console.log("🟢 chat.js cargado");

/* ================= SOCKET ================= */

const socket = io();

/* ================= ELEMENTOS ================= */

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

const usersList = document.getElementById("usersList");
const roomCount = document.getElementById("roomCount");

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

/* ================= AUTO SCROLL INTELIGENTE ================= */

function scrollIfNeeded() {
  const isAtBottom =
    messages.scrollTop + messages.clientHeight >=
    messages.scrollHeight - 40;

  if (isAtBottom) {
    messages.scrollTop = messages.scrollHeight;
  }
}

/* ================= MENSAJES ================= */

socket.on("message", data => {
  const msg = document.createElement("div");
  msg.className = "message";

  msg.innerHTML = `
    <span class="user">${data.user}</span>
    <div class="bubble">${data.text}</div>
  `;

  messages.appendChild(msg);
  scrollIfNeeded();
});

/* ================= USUARIOS ================= */

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;
    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
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
  const text = msgInput.value.trim();
  if (!text) return;

  socket.emit("chatMessage", {
    room: window.currentRoom,
    text
  });

  msgInput.value = "";
}

/* ================= ENVIAR IMAGEN ================= */

imgBtn.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    socket.emit("chatMessage", {
      room: window.currentRoom,
      text: `<img src="${data.url}" class="chat-img">`
    });

  } catch (err) {
    console.error("❌ Error subiendo imagen", err);
  }

  fileInput.value = "";
};

/* ================= AUDIO (NOTA DE VOZ) ================= */

let mediaRecorder;
let audioChunks = [];
let recording = false;

recordBtn.onclick = async () => {
  if (!recording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: "audio/mp4" });
        const formData = new FormData();
        formData.append("file", blob);

        try {
          const res = await fetch("/upload", {
            method: "POST",
            body: formData
          });

          const data = await res.json();

          socket.emit("chatMessage", {
            room: window.currentRoom,
            text: `
              <audio controls class="chat-audio">
                <source src="${data.url}" type="audio/mp4">
              </audio>
            `
          });

        } catch (err) {
          console.error("❌ Error subiendo audio", err);
        }
      };

      mediaRecorder.start();
      recording = true;
      recordBtn.textContent = "⏹️";
      recordBtn.classList.add("recording");

    } catch (err) {
      console.error("🎙️ Permiso de micrófono denegado", err);
    }

  } else {
    mediaRecorder.stop();
    recording = false;
    recordBtn.textContent = "🎙️";
    recordBtn.classList.remove("recording");
  }
};
