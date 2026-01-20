const socket = io();

let currentRoom = null;
let privateTarget = null;

/* ================= JOIN ROOM ================= */

function joinRoom(room) {
  currentRoom = room;
  socket.emit("joinRoom", { nick, room });
}

/* ================= SEND ================= */

sendBtn.onclick = sendCurrentMessage;

msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendCurrentMessage();
  }
});

function sendCurrentMessage() {
  if (!msgInput.value.trim()) return;

  // 🔐 PRIVADO
  if (privateTarget) {
    socket.emit("privateMessage", {
      toSocketId: privateTarget.socketId,
      text: msgInput.value
    });

    addMessage("text", `(Privado a ${privateTarget.nick}) ${msgInput.value}`);
  } 
  // 🌍 PUBLICO
  else {
    socket.emit("chatMessage", {
      room: currentRoom,
      text: msgInput.value
    });
  }

  msgInput.value = "";
}

/* ================= SOCKET LISTENERS ================= */

socket.on("message", data => {
  addMessage("text", `${data.user}: ${data.text}`);
});

socket.on("privateMessage", data => {
  addMessage("text", `🔒 ${data.from}: ${data.text}`);
});

/* ================= USERS ================= */

socket.on("users", users => {
  usersList.innerHTML = "";

  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;

    div.onclick = () => {
      openPrivate(u);
    };

    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});

/* ================= PRIVATE ================= */

function openPrivate(user) {
  privateTarget = user;
  addMessage("text", `🔒 Chat privado con ${user.nick}`);
}

/* ================= SALIR PRIVADO ================= */

backBtn.onclick = () => {
  privateTarget = null;
};
