const { body, param } = require('express-validator');

const createMusicValidator = [
  body('type')
    .isIn(['song', 'artist', 'concert'])
    .withMessage('Type must be one of: song, artist, concert'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name must not exceed 200 characters'),

  body('artist')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Artist must not exceed 200 characters'),

  body('spotify_uri')
    .optional()
    .trim()
    .matches(/^spotify:(track|artist|album):[a-zA-Z0-9]+$/)
    .withMessage('Invalid Spotify URI format'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('venue')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Venue must not exceed 200 characters'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters')
];

const updateMusicValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid music ID'),
  ...createMusicValidator
];

const musicIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid music ID')
];

module.exports = { createMusicValidator, updateMusicValidator, musicIdValidator };
