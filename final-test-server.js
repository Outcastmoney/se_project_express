const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Log Express version
console.log('Express version:', require('express/package.json').version);

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Another middleware to log parsed body
app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Parsed body:', JSON.stringify(req.body));
  }
  next();
});

// Test GET route
app.get('/test', (req, res) => {
  console.log('GET /test route hit');
  res.status(200).json({
    message: 'GET route works!'
  });
});

// Test POST route for users
app.post('/users', (req, res) => {
  console.log('POST /users route hit with body:', req.body);
  res.status(201).json({
    name: req.body.name || 'Test User',
    avatar: req.body.avatar || 'https://example.com/avatar.jpg',
    email: 'test@example.com',
    _id: '507f1f77bcf86cd799439011'
  });
});

// Final 404 handler for all unmatched routes
app.use((req, res) => {
  console.log(`[404] No route matched: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server on a different port
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Final test server running on port ${PORT}`);
});
