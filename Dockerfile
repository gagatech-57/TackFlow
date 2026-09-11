# Multistage Docker Build for TaskFlow Backend & Static Build
FROM node:20-alpine AS backend-build

WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm ci

COPY backend/ ./
RUN npx prisma generate

EXPOSE 5000
CMD ["npm", "start"]
