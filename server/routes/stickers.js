const express = require('express');
const router = express.Router();
const Sticker = require('../models/Sticker');
const User = require('../models/User');

// Get all stickers
router.get('/', async (req, res) => {
  try {
    const stickers = await Sticker.find();
    res.json(stickers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's stickers
router.get('/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId }).populate('stickers');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.stickers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new sticker to user
router.post('/user/:telegramId/add', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sticker = await Sticker.findOne({ _id: req.body.stickerId });
    if (!sticker) {
      return res.status(404).json({ message: 'Sticker not found' });
    }

    if (!user.stickers.includes(sticker._id)) {
      user.stickers.push(sticker._id);
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove sticker from user
router.post('/user/:telegramId/remove', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stickerId = req.body.stickerId;
    if (!stickerId) {
      return res.status(400).json({ message: 'Sticker ID is required' });
    }

    // Remove the sticker from user's collection
    user.stickers = user.stickers.filter(id => id.toString() !== stickerId);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 