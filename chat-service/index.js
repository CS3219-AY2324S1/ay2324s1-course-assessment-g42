const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const { Server } = require('socket.io');
const { disconnect } = require('process');
const server = http.createServer(app);
const io = new Server(server, {
  path: "/chat/socket.io"
});

const rooms = {};  // links rooms to socket.id
const usernames = {}; // links socket.id to username
const roomFilled = {}; // whether room has been filled

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
    

    if (!rooms[roomId]) {
      // first user to join room, first time
      rooms[roomId] = [socket.id];
      usernames[socket.id] = username;
    } else if (roomFilled[roomId]) {
      // one of the users refreshed the page
      rooms[roomId].push(socket.id);
      roomFilled[roomId] = true;
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      socket.to(otherUser).emit('inform-connect', username);
      usernames[socket.id] = username;
    } else {
      // two user joined room, first time
      rooms[roomId].push(socket.id);
      roomFilled[roomId] = true;
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      socket.to(otherUser).emit('inform-connect', username);
      socket.emit('inform-connect', usernames[otherUser]);
      usernames[socket.id] = username;
    }
  });

  socket.on('send-message', (message, roomId, username) => {
    const otherUser = rooms[roomId].find(id => id !== socket.id);
    if (otherUser) {
      console.log(`[${username}] sent message: ${message}`);
      socket.to(otherUser).emit('receive-message', message);
    }
  });

  socket.on('leave-chat', () => {
    console.log('User left chat:', socket.id);
    const roomId = Object.keys(rooms).find(roomId => rooms[roomId].includes(socket.id));
    if (roomId) {
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      if (otherUser) {
        // another user still in room
        socket.to(otherUser).emit('inform-disconnect', usernames[socket.id]);
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      } else {
        // remove roomId from rooms when both users have disconnected
        delete rooms[roomId];
        delete roomFilled[roomId];
        console.log(`removed room ${roomId}`);
      }
      delete usernames[socket.id];
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const roomId = Object.keys(rooms).find(roomId => rooms[roomId].includes(socket.id));
    if (roomId) {
      const otherUser = rooms[roomId].find(id => id !== socket.id);
      if (otherUser) {
        // another user still in room
        socket.to(otherUser).emit('inform-disconnect', usernames[socket.id]);
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      } else {
        // remove roomId from rooms when both users have disconnected
        delete rooms[roomId];
        delete roomFilled[roomId];
        console.log(`removed room ${roomId}`);
      }
      delete usernames[socket.id];
    }
  });
});
app.get("/", (req, res) => {
  res.json("Connected to chat service");
});
server.listen(5003, () => console.log("Chat server started on Port 5003"));