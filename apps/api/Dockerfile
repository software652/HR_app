# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# Copy workspace manifests first for layer-cache efficiency
COPY package.json package.json
COPY apps/api/package.json apps/api/package.json

RUN npm install --workspace=apps/api --ignore-scripts

COPY apps/api/ apps/api/
RUN npm run build --workspace=apps/api

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package.json
COPY apps/api/package.json apps/api/package.json

RUN npm install --workspace=apps/api --omit=dev --ignore-scripts

COPY --from=builder /app/apps/api/dist apps/api/dist

EXPOSE 4000

USER node

CMD ["node", "apps/api/dist/server.js"]
