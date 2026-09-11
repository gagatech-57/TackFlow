const { body } = require('express-validator');

const registerValidation = [
  body().custom((value, { req }) => {
    const name = req.body.fullName || req.body.name;
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Full Name is required.');
    }
    if (name.trim().length < 2 || name.trim().length > 100) {
      throw new Error('Full Name must be between 2 and 100 characters.');
    }
    return true;
  }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

module.exports = {
  registerValidation,
  loginValidation
};
