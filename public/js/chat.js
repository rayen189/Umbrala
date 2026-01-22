console.log("🟢 chat.js cargado");

const socket = io();

/* ================= ELEMENTOS ================= */
const usersPanel = document.getElementById("usersPanel");
const usersToggle = document.getElementById("usersToggle");

if (usersToggle) {
  usersToggle.onclick = () => {
    usersPanel.classList.toggle("active");
  };
}
const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

const usersList = document.getElementById("usersList");
const roomCount = document.getElementById("roomCount");
const chatTabs = document.getElementById("chatTabs");

/* ================= ESTADO ================= */

const privateChats = {}; // socketId => true
let activeChat = { type: "public", id: null };

/* ================= JOIN DESDE main.js ================= */

window.joinRoom = function (room) {
  if (!window.nick || !room) {
    console.warn("⚠️ joinRoom cancelado", window.nick, room);
    return;
  }

  console.log("🔌 Uniéndose a sala:", room);

  activeChat = { type: "public", id: null };
  chatTabs.innerHTML = `<div class="tab active" data-type="public">🌍 Sala</div>`;
  messages.innerHTML = "";

  socket.emit("joinRoom", {
    nick: window.nick,
    room
  });
};

/* ================= RENDER MENSAJES ================= */

function addMessage(user, html) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${user}:</strong> ${html}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ================= MENSAJES PUBLICOS ================= */

socket.on("message", data => {
  if (activeChat.type !== "public") return;
  addMessage(data.user, data.text);
});

/* ================= LISTA DE USUARIOS ================= */

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    if (u.nick === window.nick) return;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;

    div.onclick = () => openPrivateChat(u);

    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});

/* ================= PESTAÑAS PRIVADAS ================= */

function openPrivateChat(user) {
  if (!privateChats[user.socketId]) {
    privateChats[user.socketId] = true;

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = "🔒 " + user.nick;
    tab.dataset.type = "private";
    tab.dataset.id = user.socketId;

    tab.onclick = () => switchToPrivate(user.socketId);

    chatTabs.appendChild(tab);
  }

  switchToPrivate(user.socketId);
}

function switchToPrivate(socketId) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.remove("active")
  );

  const tab = [...document.querySelectorAll(".tab")]
    .find(t => t.dataset.id === socketId);

  if (tab) tab.classList.add("active");

  messages.innerHTML = "";
  activeChat = { type: "private", id: socketId };
}

/* ================= MENSAJES PRIVADOS ================= */

socket.on("privateMessage", data => {
  openPrivateChat({
    nick: data.from,
    socketId: data.fromSocketId
  });

  if (activeChat.id === data.fromSocketId) {
    addMessage("🔒 " + data.from, data.text);
  }
});

/* ================= ENVIAR TEXTO ================= */

sendBtn.onclick = sendText;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendText();
});

function sendText() {
  const text = msgInput.value.trim();
  if (!text) return;

  if (activeChat.type === "private") {
    socket.emit("privateMessage", {
      toSocketId: activeChat.id,
      text
    });
  } else {
    socket.emit("chatMessage", {
      room: window.currentRoom,
      text
    });
  }

  msgInput.value = "";
}

/* ================= ENVIAR IMAGEN ================= */

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

  sendRichMessage(`<img src="${data.url}" class="chat-img">`);
  fileInput.value = "";
};

/* ================= AUDIO (NOTA DE VOZ) ================= */

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

      sendRichMessage(`
        <audio controls class="chat-audio">
          <source src="${data.url}" type="audio/webm">
        </audio>
      `);
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

/* ================= UTIL RICH ================= */

function sendRichMessage(html) {
  if (activeChat.type === "private") {
    socket.emit("privateMessage", {
      toSocketId: activeChat.id,
      text: html
    });
  } else {
    socket.emit("chatMessage", {
      room: window.currentRoom,
      text: html
    });
  }
}
