const express = require('express');
const app = express();

app.get("/test", (req, res) => {
    res.json("backend connected to frontend")
})

app.listen(5000, () => {console.log("Server Started on Port 5000")});
