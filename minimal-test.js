const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Basic middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test GET route
app.get('/test', (req, res) => {
  console.log('GET /test hit');
  res.status(200).json({
    message: 'GET route works!'
  });
});

// Test POST route
app.post('/test', (req, res) => {
  console.log('POST /test hit with body:', req.body);
  res.status(200).json({
    message: 'POST route works!',
    receivedData: req.body
  });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});
