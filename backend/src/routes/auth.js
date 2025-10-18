const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { registerValidator, loginValidator } = require('../validators/auth');
const validate = require('../middleware/validate');
const AppError = require('../utils/AppError');

// Register (for initial setup - consider disabling in production)
router.post('/register', registerValidator, validate, async (req, res, next) => {
  try {
    const { username, password, display_name } = req.body;

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }

    const hashedPassword = await hashPassword(password);
    const userId = await User.create({
      username,
      password: hashedPassword,
      display_name
    });

    const user = await User.findById(userId);
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
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
