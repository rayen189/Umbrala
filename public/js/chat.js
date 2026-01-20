console.log("🟢 chat.js cargado");

/* ================= SOCKET ================= */

const socket = io();

/* ================= STATE ================= */

let currentRoom = null;
let activeChat = { type: "public" };

// socketId -> { nick, messages: [] }
const privateChats = {};

/* ================= ELEMENTS ================= */

const tabs = document.getElementById("chatTabs");

/* ================= JOIN ROOM ================= */

function joinRoom(room) {
  currentRoom = room;

  socket.emit("joinRoom", {
    nick,
    room
  });
}

/* ================= TABS ================= */

function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.remove("active")
  );
  tab.classList.add("active");
}

// pestaña pública
const publicTab = document.querySelector('.tab[data-type="public"]');
if (publicTab) {
  publicTab.onclick = () => {
    activeChat = { type: "public" };
    messages.innerHTML = "";
    setActiveTab(publicTab);
  };
}

/* ================= PRIVATE ================= */

function openPrivateTab(user) {
  if (!user || user.socketId === socket.id) return;

  if (!privateChats[user.socketId]) {
    privateChats[user.socketId] = {
      nick: user.nick,
      messages: []
    };

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

  const tab = [...tabs.children].find(
    t => t.dataset.socketId === user.socketId
  );
  if (tab) setActiveTab(tab);
}

/* ================= RENDER ================= */

function renderMessages() {
  messages.innerHTML = "";

  if (activeChat.type === "public") return;

  privateChats[activeChat.socketId].messages.forEach(m => {
    addMessage("text", m);
  });
}

/* ================= SEND ================= */

sendBtn.onclick = sendMessage;

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
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

/* ================= SOCKET LISTENERS ================= */

// público
socket.on("message", data => {
  if (activeChat.type === "public") {
    addMessage("text", `${data.user}: ${data.text}`);
  }
});

// privado (AUTO-CREA TAB)
socket.on("privateMessage", data => {
  let entry = Object.values(privateChats).find(
    c => c.nick === data.from
  );

  if (!entry) {
    const fakeUser = {
      nick: data.from,
      socketId: data.fromSocketId || data.from
    };
    openPrivateTab(fakeUser);
    entry = privateChats[fakeUser.socketId];
  }

  entry.messages.push(`${data.from}: ${data.text}`);

  if (activeChat.type === "private") {
    renderMessages();
  }
});

// usuarios
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
