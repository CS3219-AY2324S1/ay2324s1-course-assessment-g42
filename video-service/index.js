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
      socket.join(roomId);
      console.log(`[${id}] joined chat: ${roomId}`);

      if (rooms[roomId]) {
        // second user to arrive
        socket.emit('initiate-call', rooms[roomId]);
        console.log('second user');
      } else {
        rooms[roomId] = id;
      }
    });
    
  });

  server.listen(5005, () => console.log("Video server started on Port 5005"));