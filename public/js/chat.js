console.log("🟢 chat.js cargado");

const socket = io();

let currentRoom = null;
let activeChat = { type: "public" };
const privateChats = {};

const tabs = document.getElementById("chatTabs");
const fileInput = document.getElementById("fileInput");
const imgBtn = document.getElementById("imgBtn");
const recordBtn = document.getElementById("recordBtn");

/* ================= JOIN ================= */

function joinRoom(room) {
  currentRoom = room;
  socket.emit("joinRoom", { nick, room });
}

/* ================= PUBLIC TAB ================= */

document.querySelector('.tab[data-type="public"]').onclick = () => {
  activeChat = { type: "public" };
  messages.innerHTML = "";
  setActiveTab(event.target);
};

function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
}

/* ================= PRIVATE ================= */

function openPrivateTab(user) {
  if (!user || user.socketId === socket.id) return;

  if (!privateChats[user.socketId]) {
    privateChats[user.socketId] = { nick: user.nick, messages: [] };

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.socketId = user.socketId;
    tab.textContent = `🔒 ${user.nick}`;

    tab.onclick = () => {
      activeChat = { type: "private", socketId: user.socketId };
      renderMessages();
      setActiveTab(tab);
    };

    tabs.appendChild(tab);
  }

  activeChat = { type: "private", socketId: user.socketId };
  renderMessages();
}

/* ================= RENDER ================= */

function renderMessages() {
  messages.innerHTML = "";

  if (activeChat.type === "public") return;

  privateChats[activeChat.socketId].messages.forEach(m =>
    addMessage("text", m)
  );
}

/* ================= SEND TEXT ================= */

sendBtn.onclick = sendText;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendText();
});

function sendText() {
  if (!msgInput.value.trim()) return;

  if (activeChat.type === "private") {
    socket.emit("privateMessage", {
      toSocketId: activeChat.socketId,
      text: msgInput.value
    });

    privateChats[activeChat.socketId].messages.push(
      `Tú: ${msgInput.value}`
    );

    renderMessages();
  } else {
    socket.emit("chatMessage", {
      room: currentRoom,
      text: msgInput.value
    });
  }

  msgInput.value = "";
}

/* ================= IMAGE ================= */

imgBtn.onclick = () => fileInput.click();

fileInput.onchange = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload", { method: "POST", body: formData });
  const data = await res.json();

  socket.emit("chatMessage", {
    room: currentRoom,
    type: "image",
    url: data.url
  });
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

      const res = await fetch("/upload", { method: "POST", body: formData });
      const data = await res.json();

      socket.emit("chatMessage", {
        room: currentRoom,
        type: "audio",
        url: data.url
      });
    };

    mediaRecorder.start();
    recordBtn.textContent = "⏹️";
    recordBtn.classList.add("recording");
    recording = true;

  } else {
    mediaRecorder.stop();
    recordBtn.textContent = "🎙️";
    recordBtn.classList.remove("recording");
    recording = false;
  }
};

/* ================= SOCKET ================= */

socket.on("message", data => {
  if (data.type === "image") {
    addMessage("html", `<img src="${data.url}" class="chat-img">`);
  } else if (data.type === "audio") {
    addMessage("html", `<audio controls src="${data.url}"></audio>`);
  } else {
    addMessage("text", `${data.user}: ${data.text}`);
  }
});

socket.on("privateMessage", data => {
  if (!privateChats[data.fromSocketId]) {
    openPrivateTab({ nick: data.from, socketId: data.fromSocketId });
  }

  privateChats[data.fromSocketId].messages.push(
    `${data.from}: ${data.text}`
  );

  if (activeChat.type === "private") renderMessages();
});

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    if (u.socketId === socket.id) return;

    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;
    div.onclick = () => openPrivateTab(u);
    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});
