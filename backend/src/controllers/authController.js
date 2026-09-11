const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const config = require('../config/env');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const fullName = (req.body.fullName || req.body.name || '').trim();
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    if (!fullName) {
      return errorResponse(res, 400, 'Full Name is required.');
    }
    if (!email) {
      return errorResponse(res, 400, 'Email address is required.');
    }
    if (!password) {
      return errorResponse(res, 400, 'Password is required.');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists.');
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true
      }
    });

    // Generate JWT
    const token = generateToken(user.id);

    return successResponse(res, 201, 'User registered successfully.', {
      user: { ...user, name: user.fullName },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password.');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Omit password from user response & attach name helper
    const { password: _, ...userWithoutPassword } = user;
    const userWithHelpers = {
      ...userWithoutPassword,
      name: userWithoutPassword.fullName
    };

    return successResponse(res, 200, 'Login successful.', {
      user: userWithHelpers,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  return successResponse(res, 200, 'Logged out successfully.');
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  const user = req.user ? { ...req.user, name: req.user.fullName } : null;
  return successResponse(res, 200, 'User profile fetched successfully.', {
    user
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
