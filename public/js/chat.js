/* ================= SOCKET ================= */

const socket = io();

/* ================= STATE ================= */

let currentRoom = null;

/* ================= JOIN ROOM ================= */

/*
  Esta función es llamada desde main.js
  cuando el usuario elige sala y confirma nick
*/
function joinRoom(roomName) {
  if (!nick) return;

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

// Mensajes públicos
socket.on("message", data => {
  /*
    data = {
      user: "nick",
      text: "mensaje"
    }
  */
  addMessage("text", `${data.user}: ${data.text}`);
});

// Lista de usuarios de la sala
socket.on("users", users => {
  /*
    users = [ { nick: "..." }, ... ]
  */
  usersList.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.className = "user";
    div.textContent = u.nick;

    // click futuro para privados
    div.onclick = () => {
      openPrivate(u.nick);
    };

    usersList.appendChild(div);
  });

  roomCount.textContent = `👥 ${users.length}`;
});

// Mensaje privado
socket.on("privateMessage", data => {
  /*
    data = {
      from: "nick",
      text: "mensaje"
    }
  */
  addMessage("text", `(Privado) ${data.from}: ${data.text}`);
});

/* ================= HOOKS A MAIN.JS ================= */

/*
  Reemplazamos SOLO el envío local
  main.js sigue mostrando el mensaje,
  pero ahora también se envía al servidor
*/

// Guardamos referencia original
const _sendMessageLocal = sendMessage;

// Sobrescribimos
sendMessage = function () {
  if (!msgInput.value.trim()) return;

  sendMessageSocket(msgInput.value);
  msgInput.value = "";
};

/*
  Cuando el usuario entra al chat,
  main.js debe llamar a joinRoom(roomName)
  EJEMPLO (en main.js):
  joinRoom(roomTitle.textContent);
*/

/* ================= PRIVATE (PLACEHOLDER) ================= */

function openPrivate(targetNick) {
  addMessage("text", `(Sistema) Chat privado con ${targetNick} (en desarrollo)`);
}
