import React, { useState, useEffect } from 'react';
import './StickerGrid.css';
import config from '../config';

const StickerGrid = () => {
  const [stickers, setStickers] = useState([]);
  const [availableStickers, setAvailableStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telegramId, setTelegramId] = useState('');

  useEffect(() => {
    // In a real app, you would get the telegramId from the Telegram Web App
    setTelegramId('123456789'); // This should come from Telegram Web App
    fetchAllStickers();
  }, []);

  useEffect(() => {
    if (telegramId) {
      fetchUserStickers(telegramId);
    }
  }, [telegramId]);

  const fetchAllStickers = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/stickers`);
      if (!response.ok) {
        throw new Error('Failed to fetch available stickers');
      }
      const data = await response.json();
      setAvailableStickers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserStickers = async (telegramId) => {
    try {
      const response = await fetch(`${config.apiUrl}/stickers/user/${telegramId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stickers');
      }
      const data = await response.json();
      setStickers(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNewSticker = async () => {
    if (availableStickers.length === 0) {
      setError('No available stickers found');
      return;
    }

    // Get IDs of stickers that user already has
    const userStickerIds = stickers.map(sticker => sticker._id);
    
    // Filter out stickers that user already has
    const availableNewStickers = availableStickers.filter(
      sticker => !userStickerIds.includes(sticker._id)
    );

    if (availableNewStickers.length === 0) {
      setError('You already have all available stickers!');
      return;
    }

    // Get a random sticker from available new stickers
    const randomSticker = availableNewStickers[Math.floor(Math.random() * availableNewStickers.length)];
    console.log('Selected random sticker:', randomSticker);

    try {
      const response = await fetch(`${config.apiUrl}/stickers/user/${telegramId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stickerId: randomSticker._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add sticker');
      }

      fetchUserStickers(telegramId);
    } catch (err) {
      setError(err.message);
      console.error('Error adding sticker:', err);
    }
  };

  const deleteSticker = async (stickerId) => {
    try {
      const response = await fetch(`${config.apiUrl}/stickers/user/${telegramId}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stickerId: stickerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove sticker');
      }

      fetchUserStickers(telegramId);
    } catch (err) {
      setError(err.message);
      console.error('Error removing sticker:', err);
    }
  };

  const hasAllStickers = () => {
    if (!stickers.length || !availableStickers.length) return false;
    const userStickerIds = stickers.map(sticker => sticker._id);
    return availableStickers.every(sticker => userStickerIds.includes(sticker._id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sticker-grid">
      <div className="grid-container">
        {stickers.map((sticker) => (
          <div key={sticker._id || sticker.id} className="sticker-card">
            <img src={sticker.imageUrl} alt={sticker.name} />
            <h3>{sticker.name}</h3>
            <span className={`rarity ${sticker.rarity}`}>{sticker.rarity}</span>
            <button 
              className="delete-button"
              onClick={() => deleteSticker(sticker._id)}
              title="Delete sticker"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button 
        className={`add-sticker-btn ${hasAllStickers() ? 'disabled' : ''}`}
        onClick={addNewSticker}
        disabled={hasAllStickers()}
        title={hasAllStickers() ? "You already have all stickers!" : "Add new sticker"}
      >
        Add New Sticker
      </button>
    </div>
  );
};

export default StickerGrid; 