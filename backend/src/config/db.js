const { PrismaClient } = require('@prisma/client');

const basePrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        let attempt = 0;
        const maxRetries = 2;
        while (attempt < maxRetries) {
          try {
            return await query(args);
          } catch (err) {
            attempt++;
            const isConnError = err.code === 'P1001' || err.code === 'P1002' ||
              (err.message && (err.message.includes('ConnectionReset') || err.message.includes('forcibly closed') || err.message.includes('Can\'t reach database')));
            if (isConnError && attempt < maxRetries) {
              console.warn(`[Prisma DB Connection] Retrying ${model}.${operation} (Attempt ${attempt}/${maxRetries}) after connection drop...`);
              try { await basePrisma.$connect(); } catch (e) {}
              continue;
            }
            throw err;
          }
        }
      }
    }
  }
});

module.exports = prisma;
