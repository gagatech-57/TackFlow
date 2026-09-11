const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Validation result extractor middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return errorResponse(res, 400, 'Validation Failed', formattedErrors);
  }
  next();
};

module.exports = validate;
