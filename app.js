require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate');
const winston = require('winston');

const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

const app = express();
const { PORT = 3001 } = process.env;

// Create a logger instance for non-HTTP logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'server.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

// Configure CORS to restrict origins in production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://amoney.minecraftr.us' 
    : '*',
  credentials: true
}));
app.use(express.json());

// Add request logger
app.use(requestLogger);

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

// Add error logger
app.use(errorLogger);

// Add celebrate errors handler
app.use(errors());

// Add central error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
