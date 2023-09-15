const express = require('express')
const app = express()

app.get("/test", (req, res) => {
    res.json("Backend and Frontend connected");
})

app.listen(5000, () => { console.log("Backend Server started on port 5000")});