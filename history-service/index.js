const io = socketIo(server);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const collaborationData = []


app.use(bodyParser.json());

app.post('/history', (req, res) => {
});

app.listen(5003, () => {
  console.log('History microservice is running on port 5003');
});