const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/*
 users = {
   socketId: { nick, room }
 }
*/
let users = {};
let roomsCount = {
  global: 0,
  norte: 0,
  centro: 0,
  sur: 0,
  curiosidades: 0,
  vacio: 0
};

io.on("connection", socket => {
  console.log("🟢 Conectado:", socket.id);

  socket.on("joinRoom", ({ nick, room }) => {
    if (!nick || !room) return;

    socket.join(room);
    users[socket.id] = { nick, room };

    roomsCount[room]++;

    io.to(room).emit("message", {
      user: "Umbrala",
      text: `${nick} entró a la sala`
    });

    io.to(room).emit(
      "users",
      Object.values(users).filter(u => u.room === room)
    );

    io.emit("roomsUpdate", roomsCount);
  });

  socket.on("chatMessage", ({ room, text }) => {
    const user = users[socket.id];
    if (!user || !text) return;

    io.to(room).emit("message", {
      user: user.nick,
      text
    });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (!user) return;

    roomsCount[user.room]--;
    if (roomsCount[user.room] < 0) roomsCount[user.room] = 0;

    delete users[socket.id];

    io.to(user.room).emit("message", {
      user: "Umbrala",
      text: `${user.nick} salió`
    });

    io.to(user.room).emit(
      "users",
      Object.values(users).filter(u => u.room === user.room)
    );

    io.emit("roomsUpdate", roomsCount);

    console.log("🔴 Desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Umbrala activo en puerto ${PORT}`)
);
