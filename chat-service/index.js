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
  
  socket.on('join-chat', async (roomId) => {
    socket.join(roomId);
    console.log("User joined chat:", roomId);
    
    socket.emit('loadChatHistory');
  });

  socket.on('send-message', async (data, roomId) => {
    console.log("send-message:", data);
    socket.broadcast.to(roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5003, () => console.log("Chat server started on Port 5003"));