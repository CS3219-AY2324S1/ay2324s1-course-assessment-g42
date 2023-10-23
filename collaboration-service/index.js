const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

var dict = {
  roomId : null,
  questionId : null
};

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
    dict.roomId = roomName;
    dict.questionId = null;
    socket.join(roomName);
  });

  // Handle code changes within the room
  socket.on('code-change', (roomName, code) => {
    socket.to(roomName).emit('code-change', code);
  });

  socket.on('generate-question', (roomName, questionId) => {
    if (dict.questionId === null) {
      dict.questionId = questionId;
    }
    console.log(dict.questionId);
    socket.to(roomName).emit('generate-question', dict.questionId);
  })

  socket.on('disconnect', () => {
    dict.roomId = null;
    dict.questionId = null;
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(5002, () => console.log("Collaboration server Started on Port 5002"));