require('dotenv').config();
const mongoose = require('mongoose');
const Sticker = require('../models/Sticker');
const fs = require('fs');
const path = require('path');

const stickersDir = path.join(__dirname, '../../client/public/stickers');

async function checkStickers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all stickers from database
    const dbStickers = await Sticker.find({});
    console.log(`Found ${dbStickers.length} stickers in database`);

    // Get all PNG files from stickers directory
    const files = fs.readdirSync(stickersDir);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    console.log(`Found ${pngFiles.length} PNG files in stickers directory`);

    // Check for missing files
    const missingFiles = dbStickers.filter(sticker => {
      const fileName = path.basename(sticker.imageUrl);
      return !pngFiles.includes(fileName);
    });

    if (missingFiles.length > 0) {
      console.log('\n⚠️ Missing files in stickers directory:');
      missingFiles.forEach(sticker => {
        console.log(`- ${path.basename(sticker.imageUrl)} (${sticker.name})`);
      });
    }

    // Check for missing database entries
    const missingDbEntries = pngFiles.filter(file => {
      return !dbStickers.some(sticker => path.basename(sticker.imageUrl) === file);
    });

    if (missingDbEntries.length > 0) {
      console.log('\n⚠️ Missing database entries for files:');
      missingDbEntries.forEach(file => {
        console.log(`- ${file}`);
      });
    }

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`- Total stickers in database: ${dbStickers.length}`);
    console.log(`- Total PNG files: ${pngFiles.length}`);
    console.log(`- Missing files: ${missingFiles.length}`);
    console.log(`- Missing database entries: ${missingDbEntries.length}`);

    if (missingFiles.length === 0 && missingDbEntries.length === 0) {
      console.log('\n✅ Everything is synchronized!');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error checking stickers:', error);
    process.exit(1);
  }
}

checkStickers(); 