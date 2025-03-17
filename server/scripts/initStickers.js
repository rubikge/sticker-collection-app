require('dotenv').config();
const mongoose = require('mongoose');
const Sticker = require('../models/Sticker');
const fs = require('fs');
const path = require('path');

const stickersDir = path.join(__dirname, '../../client/public/stickers');

async function initializeStickers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing stickers
    await Sticker.deleteMany({});
    console.log('Cleared existing stickers');

    // Read sticker files
    const files = fs.readdirSync(stickersDir);
    const stickers = files
      .filter(file => file.endsWith('.png'))
      .map(file => {
        const name = path.parse(file).name;
        return {
          name: name.replace(/_/g, ' '),
          imageUrl: `/stickers/${file}`,
          rarity: determineRarity(name)
        };
      });

    // Insert stickers into database
    await Sticker.insertMany(stickers);
    console.log(`Successfully added ${stickers.length} stickers to the database`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing stickers:', error);
    process.exit(1);
  }
}

function determineRarity(name) {
  // You can customize this logic based on your naming convention
  const rarities = ['common', 'rare', 'epic', 'legendary'];
  const randomIndex = Math.floor(Math.random() * rarities.length);
  return rarities[randomIndex];
}

initializeStickers(); 