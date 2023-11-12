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
  let roomId = null;

  // Create a room for each pair of users based on user IDs
  socket.on('join-room', (roomName, username, language) => {
    if (!rooms[roomName] || rooms[roomName] === null) {
      rooms[roomName] = {user1 : null, user2: null, isUser1Present : false, isUser2Present : false, qnId : null, language : null, code : null};
    } 
    roomId = roomName;
    // set user info if joining for the first time, else verify access
    if (rooms[roomName].user1 === null) {
      rooms[roomName].user1 = username;
      rooms[roomName].isUser1Present = true;
    } else if (rooms[roomName].user2 === null) {
      rooms[roomName].user2 = username;
      rooms[roomName].isUser2Present = true;
    } else {
      if (username === rooms[roomName].user1) {
        rooms[roomName].isUser1Present = true;       
      } else if (username === rooms[roomName].user2) {
        rooms[roomName].isUser2Present = true;
      } else {
        socket.emit('invalid-user');
        console.log("Access not allowed");
        return;
      }
    }   
    if (rooms[roomName].language === null) {
      rooms[roomName].language = language;
    }
    console.log("User joined:", roomName);
    socket.join(roomName);
    socket.to(roomName).emit('inform-connect', username);
  });

  // Handle code changes within the room
  socket.on('code-change', (roomName, code) => {
    rooms[roomName].code = code;
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

  socket.on('disconnect-client', (roomName, username) => {
    if (username === rooms[roomName].user1) {
      rooms[roomName].isUser1Present = false;       
    } else if (username === rooms[roomName].user2) {
      rooms[roomName].isUser2Present = false;
    } else {
      // do nothing, an invalid user has disconnected
      socket.disconnect(true);
      return;
    }
    // if both users have disconnected
    if (!rooms[roomName].isUser1Present && !rooms[roomName].isUser2Present) {
      // disconnect room and clean up
      rooms[roomName].qnId = null;
      rooms[roomName].user1 = null;
      rooms[roomName].user2 = null;
      rooms[roomName].language = null;
      rooms[roomName].code = null;
      rooms[roomName] = null;

    } else {
      socket.to(roomName).emit('inform-disconnect', username);
    }
    console.log(rooms[roomName]);
    socket.disconnect(true);
    console.log("User disconnected: ", username);
    
  })

  socket.on('disconnect', () => {
    console.log("Socket disconnected:", socket.id);
  });

});

server.listen(5002, () => console.log("Collaboration server Started on Port 5002"));