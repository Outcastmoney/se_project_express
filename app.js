require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Configure CORS to restrict origins in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://amoney.minecraftr.us' 
    : '*',
  credentials: true
}));
app.use(express.json());

// Crash test route for PM2 recovery testing
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// Set a default user ID only when in test mode
if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    req.user = {
      _id: "5d8b8592978f8bd833ca8133"
    };
    next();
  });
}

app.use("/", mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
