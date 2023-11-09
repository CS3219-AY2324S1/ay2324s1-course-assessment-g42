const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const socketIo = require('socket.io');
const { disconnect } = require('process');
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};
const usernames = {};

app.use(
  cors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up socket
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-chat', (roomId, username) => {
    socket.join(roomId);
    console.log(`[${username}] joined chat: ${roomId}`);
    
    socket.emit('loadChatHistory');

    if (!rooms[roomId]) {
      rooms[roomId] = [socket.id];
      usernames[socket.id] = username;
    } else {
      rooms[roomId].push(socket.id);
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      socket.to(otherUser).emit('inform-connect', username);
      socket.emit('inform-connect', usernames[otherUser]);
      usernames[socket.id] = username;
    }
  });

  socket.on('send-message', (message, roomId, username) => {
    console.log(`[${username}] sent message: ${message}`);
    socket.broadcast.to(roomId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const roomId = Object.keys(rooms).find(roomId => rooms[roomId].includes(socket.id));
    if (roomId) {
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      if (otherUser) {
        socket.to(otherUser).emit('inform-disconnect', usernames[socket.id]);
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      } else {
        // remove roomId from rooms
        delete rooms[roomId];
        console.log(`removed room ${roomId}`);
      }
      delete usernames[socket.id];
    }
  });
});

server.listen(5003, () => console.log("Chat server started on Port 5003"));