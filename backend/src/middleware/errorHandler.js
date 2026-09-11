const { errorResponse } = require('../utils/responseHandler');

/**
 * Centralized Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Prisma Error Handling
  if (err.code) {
    if (err.code === 'P2002') {
      const field = err.meta?.target ? err.meta.target.join(', ') : 'Field';
      return errorResponse(res, 400, `A record with this ${field} already exists.`);
    }
    if (err.code === 'P2025') {
      return errorResponse(res, 404, 'Requested resource not found.');
    }
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid authentication token.');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Authentication token has expired.');
  }

  // Syntax or Parsing Errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 400, 'Malformed JSON payload.');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorHandler;
