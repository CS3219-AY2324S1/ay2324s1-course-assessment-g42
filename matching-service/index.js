const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const matchingServer = require('./rpc_server.js');

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

// routes for matching
app.use("/match", require('./routes/matching-route'));

app.listen(5001, () => {console.log("Matching server started on Port 5001")});

matchingServer.runServer();