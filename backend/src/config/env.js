const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'taskflow_jwt_super_secret_key_2026_production_secure_789!@#',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ONLINE_FRONTEND_URL: process.env.ONLINE_FRONTEND_URL || 'https://tack-flow.vercel.app',
  ONLINE_SERVER_URL: process.env.ONLINE_SERVER_URL || 'https://tackflow.onrender.com',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
