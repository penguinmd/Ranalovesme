const { body, param } = require('express-validator');

const createPlaceValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 200 })
    .withMessage('Name must not exceed 200 characters'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),

  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),

  body('visit_date')
    .optional()
    .isISO8601()
    .withMessage('Visit date must be in ISO 8601 format (YYYY-MM-DD)'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters')
];

const updatePlaceValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid place ID'),
  ...createPlaceValidator
];

const placeIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid place ID')
];

module.exports = { createPlaceValidator, updatePlaceValidator, placeIdValidator };
