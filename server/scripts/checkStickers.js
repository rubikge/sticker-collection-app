require('dotenv').config();
const mongoose = require('mongoose');
const Sticker = require('../models/Sticker');
const fs = require('fs');
const path = require('path');

const stickersDir = path.join(__dirname, '../../client/public/stickers');

async function checkStickers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const dbStickers = await Sticker.find({});
    const pngFiles = fs.readdirSync(stickersDir).filter(file => file.endsWith('.png'));

    const missingFiles = dbStickers.filter(sticker => !pngFiles.includes(sticker.filename));
    const missingDbEntries = pngFiles.filter(file => !dbStickers.some(sticker => sticker.filename === file));

    if (missingFiles.length) {
      console.log('\n⚠️ Missing files in stickers directory:');
      missingFiles.forEach(sticker => console.log(`- ${sticker.filename} (${sticker.name})`));
    }

    if (missingDbEntries.length) {
      console.log('\n⚠️ Missing database entries for files:');
      missingDbEntries.forEach(file => console.log(`- ${file}`));
    }

    console.log('\n📊 Summary:', {
      'Total stickers in database': dbStickers.length,
      'Total PNG files': pngFiles.length,
      'Missing files': missingFiles.length,
      'Missing database entries': missingDbEntries.length
    });

    if (!missingFiles.length && !missingDbEntries.length) {
      console.log('\n✅ Everything is synchronized!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error checking stickers:', error);
    process.exit(1);
  }
}

checkStickers(); 