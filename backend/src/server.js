const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/db');

const PORT = config.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('[Database] Connected to PostgreSQL successfully via Prisma Client.');

    const server = app.listen(PORT, () => {
      console.log(`[Server] TaskFlow Backend running on port ${PORT} in ${config.NODE_ENV} mode.`);
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[Database] Prisma Client disconnected. Exit completed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('[Error] Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();
