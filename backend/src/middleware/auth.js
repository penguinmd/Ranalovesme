const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 403));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 403));
    } else {
      next(error);
    }
  }
};

module.exports = { authenticateToken };
