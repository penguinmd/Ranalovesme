const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const { authenticateToken } = require('../middleware/auth');
const { createMusicValidator, updateMusicValidator, musicIdValidator } = require('../validators/music');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Get all music entries
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { type } = req.query;
    const music = await Music.getAll(type);
    res.json(music);
  } catch (error) {
    next(error);
  }
});

// Get single music entry
router.get('/:id', authenticateToken, musicIdValidator, validate, async (req, res, next) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }
    res.json(music);
  } catch (error) {
    next(error);
  }
});

// Create new music entry
router.post('/', authenticateToken, createMusicValidator, validate, async (req, res, next) => {
  try {
    const { type, name, artist, spotify_uri, date, venue, notes } = req.body;
    const id = await Music.create({
      type,
      name,
      artist,
      spotify_uri,
      date,
      venue,
      notes,
      created_by: req.user.id
    });
    res.status(201).json({ id, message: 'Music entry created successfully' });
  } catch (error) {
    next(error);
  }
});

// Update music entry
router.put('/:id', authenticateToken, updateMusicValidator, validate, async (req, res, next) => {
  try {
    const { type, name, artist, spotify_uri, date, venue, notes } = req.body;

    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }

    await Music.update(req.params.id, { type, name, artist, spotify_uri, date, venue, notes });
    res.json({ message: 'Music entry updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete music entry
router.delete('/:id', authenticateToken, musicIdValidator, validate, async (req, res, next) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      throw new AppError('Music entry not found', 404);
    }

    await Music.delete(req.params.id);
    res.json({ message: 'Music entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
