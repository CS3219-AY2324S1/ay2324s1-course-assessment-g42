const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

app.get("/", (req, res) => {
    res.json("You connected to users service");
});

//routes for user behaviour
app.use("/user", require('./routes/user-route'));

app.listen(5000, () => {console.log("Server Started on Port 5000")});

module.exports = app;