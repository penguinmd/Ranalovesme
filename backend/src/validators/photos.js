const { body, param } = require('express-validator');

const updatePhotoValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid photo ID'),

  body('caption')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Caption must not exceed 500 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must not exceed 200 characters'),

  body('taken_date')
    .optional()
    .isISO8601()
    .withMessage('Taken date must be in ISO 8601 format (YYYY-MM-DD)')
];

const photoIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid photo ID')
];

module.exports = { updatePhotoValidator, photoIdValidator };
