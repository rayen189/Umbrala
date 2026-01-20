const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ================= STATIC ================= */

app.use(express.static("public"));

/* ================= STATE ================= */

// users = {
//   socketId: { nick, room }
// }
let users = {};

/* ================= SOCKET ================= */

io.on("connection", socket => {
  console.log("🟢 Usuario conectado:", socket.id);

  /* ===== JOIN ROOM ===== */
  socket.on("joinRoom", ({ nick, room }) => {
    if (!nick || !room) return;

    socket.join(room);
    users[socket.id] = { nick, room };

    // Mensaje sistema
    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} entró a la sala`
    });

    // Lista usuarios actualizada
    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );
  });

  /* ===== PUBLIC MESSAGE ===== */
  socket.on("chatMessage", ({ room, text }) => {
    const user = users[socket.id];
    if (!user || !text) return;

    io.to(room).emit("message", {
      user: user.nick,
      text
    });
  });

  /* ===== PRIVATE MESSAGE (BASE) ===== */
  socket.on("privateMessage", ({ to, text }) => {
    const user = users[socket.id];
    if (!user || !to || !text) return;

    io.to(to).emit("privateMessage", {
      from: user.nick,
      text
    });
  });

  /* ===== DISCONNECT ===== */
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    const room = user.room;
    const nick = user.nick;

    delete users[socket.id];

    // Aviso salida
    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} salió`
    });

    // Actualizar lista usuarios
    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );

    console.log("🔴 Usuario desconectado:", socket.id);
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Umbrala activo en puerto ${PORT}`);
});
