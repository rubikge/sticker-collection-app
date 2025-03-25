const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Get or create user
router.post('/auth', async (req, res) => {
  try {
    const { telegramId, username } = req.body;
    let user = await User.findOne({ telegramId });

    if (!user) {
      user = new User({
        telegramId,
        username
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by telegram ID
router.get('/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 