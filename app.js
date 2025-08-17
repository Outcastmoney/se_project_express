require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require('celebrate');
const winston = require('winston');

// Import controllers and validation directly
const { createUser, getCurrentUser, login } = require('./controllers/users');
const { validateUserCreate, validateUserLogin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');

// Initialize Express app
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

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

// Essential middleware
// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://amoney.minecraftr.us', 'https://www.amoney.minecraftr.us']
    : '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use(requestLogger);

// Test mode user ID middleware
if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    req.user = {
      _id: "5d8b8592978f8bd833ca8133"
    };
    next();
  });
}

// ==========================================
// DIRECT ROUTE DEFINITIONS - for test routes and critical paths
// ==========================================

// Crash test route
app.get('/crash-test', (req, res) => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// Test route for basic connectivity
app.get('/test-route', (req, res) => {
  console.log('Test route accessed');
  res.status(200).json({ message: 'Test route works!' });
});

// Basic auth routes directly in app.js (bypassing router)
app.post('/signin', validateUserLogin, login);
app.post('/signup', validateUserCreate, createUser);

// Direct user creation route
app.post('/users', validateUserCreate, createUser);
app.get('/users', getCurrentUser);

// ==========================================
// MAIN ROUTER MOUNTING - for other routes
// ==========================================

// Import router after direct routes are defined
const mainRouter = require('./routes/index');
app.use('/', mainRouter);

// ==========================================
// ERROR HANDLING
// ==========================================

// Error logger middleware
app.use(errorLogger);

// Celebrate error handler middleware
app.use(errors());

// Central error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
