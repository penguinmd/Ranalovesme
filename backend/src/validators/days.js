const { body, param } = require('express-validator');

const createDayValidator = [
  body('date')
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('mood')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Mood must not exceed 50 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const updateDayValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid day ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('mood')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Mood must not exceed 50 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const dayIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid day ID')
];

module.exports = { createDayValidator, updateDayValidator, dayIdValidator };
