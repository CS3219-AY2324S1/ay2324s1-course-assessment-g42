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

// routes for questions
app.use("/question", require('./routes/question-route'));

app.listen(8030, () => {console.log("Question server started on Port 8030")});