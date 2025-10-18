const { body, param } = require('express-validator');

const createActivityValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)')
];

const updateActivityValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid activity ID'),
  ...createActivityValidator
];

const activityIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid activity ID')
];

module.exports = { createActivityValidator, updateActivityValidator, activityIdValidator };
