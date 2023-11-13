const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

var rooms = {};

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

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('inform-id', (roomId, id) => {
      if (id) {
        socket.join(roomId);
        console.log(`[${id}] joined chat: ${roomId}`);

        if (rooms[roomId] && rooms[roomId].firstPeerId != id && rooms[roomId].secondPeerId === null) {
          // second user to arrive
          rooms[roomId].secondPeerId = id;
          io.to(roomId).emit('initiate-call', rooms[roomId].firstPeerId);
          console.log(`[${id}] initiated call with ${rooms[roomId].firstPeerId}`);
        } else {
          rooms[roomId] = {firstPeerId: id, firstSocketId: socket.id, secondPeerId: null, secondSocketId: null};
        }
      }
      
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      const roomId = Object.keys(rooms).find(roomId => rooms[roomId].firstSocketId === socket.id || rooms[roomId].secondSocketId === socket.id);
      if (roomId) {
        if (rooms[roomId].firstSocketId === socket.id) {
          rooms[roomId].firstSocketId = null;
          rooms[roomId].firstPeerId = null;
        } else {
          rooms[roomId].secondId = null;
          rooms[roomId].secondPeerId = null;
        }
        if (rooms[roomId].firstSocketId === null && rooms[roomId].secondSocketId === null) {
          delete rooms[roomId];
        }
      }
    });
    
  });

  server.listen(5005, () => console.log("Video server started on Port 5005"));