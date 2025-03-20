const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('OK');
});

module.exports = router; 