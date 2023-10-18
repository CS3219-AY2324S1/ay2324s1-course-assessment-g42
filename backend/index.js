const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.json("backend connected to frontend")
});

//routes for user behaviour
app.use("/user", require('./routes/user-route'));
// routes for questions
app.use("/question", require('./routes/question-route'));
// routes for matching
app.use("/collaborate", require('./matching-service/routes/matching-route'));

app.listen(5000, () => {console.log("Server Started on Port 5000")});