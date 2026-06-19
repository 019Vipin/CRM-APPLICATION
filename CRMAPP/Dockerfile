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

# Copy only production node_modules and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Remove example env to avoid confusion
RUN rm -f .env.example

EXPOSE 7777

CMD ["node", "index.js"]
