require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Sticker = require('../models/Sticker');

async function initTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all available stickers
    const allStickers = await Sticker.find({});
    console.log(`Found ${allStickers.length} stickers in database`);

    // Create test users
    const testUsers = [
      {
        telegramId: '123456789',
        username: 'test_user_1',
        stickers: allStickers.slice(0, 5).map(sticker => sticker._id) // First 5 stickers
      },
      {
        telegramId: '987654321',
        username: 'test_user_2',
        stickers: allStickers.slice(5, 10).map(sticker => sticker._id) // Next 5 stickers
      }
    ];

    // Clear existing test users
    await User.deleteMany({
      telegramId: { $in: testUsers.map(user => user.telegramId) }
    });
    console.log('Cleared existing test users');

    // Insert test users
    const createdUsers = await User.insertMany(testUsers);
    console.log('\nCreated test users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.username} (ID: ${user.telegramId}) with ${user.stickers.length} stickers`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error initializing test users:', error);
    process.exit(1);
  }
}

initTestUsers(); 