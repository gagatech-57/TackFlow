const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Strict Rate Limiter for Authentication endpoints (login/register)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many authentication requests from this IP. Please try again after 15 minutes.'
    );
  }
});

/**
 * General API Rate Limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      429,
      'Too many requests from this IP. Please try again later.'
    );
  }
});

module.exports = {
  authLimiter,
  apiLimiter
};
