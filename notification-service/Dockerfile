# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ─────────────────────────────────────────────
# Stage 2: Production Image
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

RUN rm -f .env.example

EXPOSE 8888

CMD ["node", "index.js"]
