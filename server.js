const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {};

io.on('connection', socket => {

  socket.on('joinRoom', ({ nick, room }) => {
    socket.join(room);
    users[socket.id] = { nick, room };

    io.to(room).emit('message', {
      user: 'Umbrala',
      text: `${nick} entró a la sala`
    });

    io.to(room).emit('users', Object.values(users).filter(u => u.room === room));
  });

  socket.on('chatMessage', msg => {
    const user = users[socket.id];
    if (!user) return;

    io.to(user.room).emit('message', {
      user: user.nick,
      text: msg
    });
  });

  socket.on('privateMessage', ({ to, text }) => {
    io.to(to).emit('privateMessage', {
      from: users[socket.id].nick,
      text
    });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message', {
        user: 'Umbrala',
        text: `${user.nick} salió`
      });
      delete users[socket.id];
    }
  });

});

server.listen(process.env.PORT || 3000);
