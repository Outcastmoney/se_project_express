const express = require('express');
const cors = require('cors');

// Create minimal express app for testing
const app = express();
const PORT = 3002;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Simple test routes
app.get('/test', (req, res) => {
  console.log('GET /test route accessed');
  res.status(200).json({ message: 'Test route works!' });
});

app.post('/users', (req, res) => {
  console.log('POST /users route accessed', req.body);
  res.status(201).json({ 
    message: 'User created successfully', 
    body: req.body,
    // Include email in response as required
    email: req.body.email || 'not_provided'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
