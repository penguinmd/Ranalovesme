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
      users: users.map(u => ({ id: u.id, username: u.username, display_name: u.display_name, password_hash_length: u.password?.length }))
    });
  } catch (error) {
    next(error);
  }
});

// Debug endpoint to test password
router.post('/debug/test-password', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    const isValid = await verifyPassword(password, user.password);
    res.json({
      username: user.username,
      passwordProvided: password,
      hashInDb: user.password,
      isValid
    });
  } catch (error) {
    res.json({ error: error.message, stack: error.stack });
  }
});

// Login
router.post('/login', loginValidator, validate, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);

    const user = await User.findByUsername(username);
    if (!user) {
      console.log('User not found:', username);
      throw new AppError('Invalid credentials', 401);
    }
    console.log('User found:', user.username);

    const isValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isValid);
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
    console.error('Login error:', error.message, error.stack);
    next(error);
  }
});

module.exports = router;
