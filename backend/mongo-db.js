require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Event handler for successful connection
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Event handler for connection errors
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Event handler for when the connection is disconnected
db.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
