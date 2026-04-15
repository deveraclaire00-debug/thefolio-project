// backend/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized — please login'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: attach full user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || req.user.status === 'inactive') {
      return res.status(401).json({
        message: 'User not found or inactive'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token invalid or expired'
    });
  }
};

module.exports = { protect };