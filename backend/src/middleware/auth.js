const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/db');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Authentication Middleware: Verifies JWT token and attaches user payload
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return errorResponse(res, 401, 'Access denied. No authentication token provided.');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Retrieve user details excluding password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, fullName: true, email: true, createdAt: true }
    });

    if (!user) {
      return errorResponse(res, 401, 'User associated with token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired. Please log in again.');
    }
    return errorResponse(res, 401, 'Invalid authentication token.');
  }
};

module.exports = {
  authenticateToken
};
