require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check for required environment variables
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set in .env file');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set in .env file');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Telegram Bot setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('polling_error', (error) => {
  console.error('Telegram Bot polling error:', error);
});

bot.on('message', (msg) => {
  console.log('Received message:', msg);
});

// Routes
app.use('/sticker-app/stickers', require('./routes/stickers'));
app.use('/sticker-app/users', require('./routes/users'));
app.use('/sticker-app/test', require('./routes/test'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Telegram Bot is initialized with token:', process.env.TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
}); 