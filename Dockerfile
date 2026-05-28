# Stage 1 - Dependencies
FROM node:20-bullseye-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 - Build
FROM node:20-bullseye-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN export $(grep -v '^#' .env.production | xargs) \
    && echo "API_URL=$NEXT_PUBLIC_API_URL" \
    && node --max-old-space-size=4096 node_modules/.bin/next build

# Stage 3 - Production
FROM node:20-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY package*.json ./

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-p", "3000"]
