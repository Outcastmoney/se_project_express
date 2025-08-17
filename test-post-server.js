const express = require('express');
const app = express();
const PORT = 3002;

// Essential middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Simple GET route
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'GET route works!' });
});

// Simple POST route
app.post('/test', (req, res) => {
  console.log('POST test route hit with body:', req.body);
  res.status(200).json({
    message: 'POST route works!',
    receivedData: req.body
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
});
