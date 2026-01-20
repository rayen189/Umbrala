console.log("🟢 chat.js cargado");

/* ================= SOCKET ================= */

const socket = io();

/* ================= STATE ================= */

let currentRoom = null;

/* ================= JOIN ROOM ================= */

function joinRoom(roomName) {
  if (!nick || !roomName) return;

  currentRoom = roomName;

  socket.emit("joinRoom", {
    nick,
    room: roomName
  });
}

/* ================= SEND MESSAGE ================= */

function sendMessageSocket(text) {
  if (!text.trim() || !currentRoom) return;

  socket.emit("chatMessage", {
    room: currentRoom,
    text
  });
}

/* ================= SOCKET LISTENERS ================= */

socket.on("message", data => {
  console.log("📩 MENSAJE RECIBIDO:", data);

  if (typeof addMessage !== "function") {
    console.error("❌ addMessage no existe");
    return;
  }

  addMessage("text", `${data.user}: ${data.text}`);
});

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;

    div.onclick = () => openPrivate(u.nick);

    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});

socket.on("privateMessage", data => {
  addMessage("text", `(Privado) ${data.from}: ${data.text}`);
});

/* ================= SEND HANDLERS ================= */

sendBtn.onclick = () => {
  if (!msgInput.value.trim()) return;
  sendMessageSocket(msgInput.value);
  msgInput.value = "";
};

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!msgInput.value.trim()) return;
    sendMessageSocket(msgInput.value);
    msgInput.value = "";
  }
});

/* ================= PRIVATE PLACEHOLDER ================= */

function openPrivate(targetNick) {
  addMessage("text", `(Sistema) Chat privado con ${targetNick} (próximamente)`);
}
