const express = require('express');
const cors = require('cors');
const router = express.Router();

// Global middleware
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Route-specific middleware
router.use(express.json());

// Route definitions
router.use('/stickers', require('./routes/stickers'));
router.use('/users', require('./routes/users'));
router.use('/test', require('./routes/test'));

module.exports = router;
