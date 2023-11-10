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
    res.json("history microservice connected")
});

//routes for user behaviour
app.use("/history", require('./routes/history-route'));

app.listen(5003, () => {console.log("History microservice is listening at port 5003")});

module.exports = app;