const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const socketIo = require('socket.io');
const { disconnect } = require('process');
const server = http.createServer(app);
const io = socketIo(server);


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
  });

  socket.on('send-message', (message, roomId, username) => {
    console.log(`[${username}] sent message: ${message}`);
    socket.broadcast.to(roomId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5003, () => console.log("Chat server started on Port 5003"));