const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

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

  // Create a room for each pair of users based on user IDs
  socket.on('join-room', (roomName) => {
    console.log("User joined:", roomName)
    if (!rooms[roomName]) {
      rooms[roomName] = {user1 : null, user2: null, qnId : null, language : null};
    } 
    socket.join(roomName);
  });

  // Handle code changes within the room
  socket.on('code-change', (roomName, code) => {
    socket.to(roomName).emit('code-change', code);
  });

  // Return question id for a given room
  socket.on('generate-question', (roomName, questionId) => {
    if (rooms[roomName].qnId === null) {
      rooms[roomName].qnId = questionId;
    }
    console.log(rooms[roomName].qnId);
    socket.to(roomName).emit('generate-question', rooms[roomName].qnId);
  })

  // get room info
  socket.on('get-info', (roomName) => {
    socket.to(roomName).emit('get-info', rooms[roomName]);
    console.log(rooms[roomName]);
  })

  // set usernames for a room
  socket.on('set-user', (roomName, username) => {
    if (rooms[roomName].user1 === null) {
      rooms[roomName].user1 = username;
    } else {
      rooms[roomName].user2 = username;
    }
  })

  // set language for a room
  socket.on('set-language', (roomName, language) => {
    if (rooms[roomName].language === null) {
      rooms[roomName].language = language;
    }
  })

  socket.on('disconnect-room', (roomName) => {
    rooms[roomName].qnId = null;
    rooms[roomName].user1 = null;
    rooms[roomName].user2 = null;
    rooms[roomName].language = null;
  })

  socket.on('disconnect', () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(5002, () => console.log("Collaboration server Started on Port 5002"));