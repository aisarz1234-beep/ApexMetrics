# Multi-stage Dockerfile for ApexMetrics Production
FROM node:20-alpine AS builder

WORKDIR /app

# Install client dependencies and build assets
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

# Production Server Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server code and built client dist
COPY server/ ./server/
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/src/server.js"]
