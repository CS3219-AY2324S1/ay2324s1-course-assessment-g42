const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const matchingServer = require('./server.js');
const matchingClient = require('./client.js');
var amqp = require('amqplib/callback_api');

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

app.get("/test", (req, res) => {
    res.json("backend connected to frontend")
});

// store users and the time they made their last request
const userMap = new Map();
const MAX_TIME = 30000;

var CHANNEL = null;

// Set up socket
io.on('connection', function(socket) {
  console.log("user connected:", socket.id);
  socket.on('find-match', function(username, complexity, language, timeOfReq) {
    if (userMap.has(username)) {
      const lastTimeOfReq = userMap.get(username);
      const isDuplicateUser = (timeOfReq - lastTimeOfReq) < MAX_TIME;
      if (isDuplicateUser) {
        const message = 'You have already requested a response in the last 30 seconds. Please wait for a response.'
        socket.emit('duplicate-request', message);
        return;
      } else {
        userMap.set(username, timeOfReq);
      }
    } else {
      userMap.set(username, timeOfReq);
    }
    socket.join(username);
    matchingClient.sendMatchingRequest(username, complexity, language, timeOfReq, CHANNEL);
  });

  socket.on('match-found', function(username1, username2, roomId, message1, message2) {
    console.log("match found");
    io.to(username1).emit('match-found', roomId, message1);
    io.to(username2).emit('match-found', roomId, message2);
  });
  
  socket.on("disconnect", function() {
    io.emit("User disconnected");
  });
});

server.listen(5001, () => {console.log("Matching server started on Port 5001")});

amqp.connect(process.env.LOCALAMQP_URL, function(error0, connection) {
  if (error0) {
      throw error0;
  }
  console.log('Server Connected to CloudAMQP');
  connection.createChannel(function(error1, channel) {
      if (error1) {
          throw error1;
      }
      matchingServer.runServer(channel);
      CHANNEL = channel;
  });
});

