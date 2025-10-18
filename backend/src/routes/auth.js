const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { registerValidator, loginValidator } = require('../validators/auth');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Registration disabled - only Rana and Mark have accounts
router.post('/register', (req, res) => {
  res.status(403).json({
    message: 'Registration is disabled. This app is private to Rana and Mark.'
  });
});

// Debug endpoint to check users (temporary - remove in production)
router.get('/debug/users', async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json({
      count: users.length,
      users: users.map(u => ({ id: u.id, username: u.username, display_name: u.display_name }))
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', loginValidator, validate, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
