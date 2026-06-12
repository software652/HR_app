# ── Dependencies stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package.json
COPY apps/web/package.json apps/web/package.json

RUN npm install --workspace=apps/web --ignore-scripts

# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules node_modules
COPY --from=deps /app/apps/web/node_modules apps/web/node_modules
COPY apps/web/ apps/web/
COPY package.json package.json

# NEXT_PUBLIC_API_URL is baked in at build time; override via ARG for different envs
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=apps/web

# ── Runtime stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public        apps/web/public
COPY --from=builder /app/apps/web/.next/standalone  apps/web/
COPY --from=builder /app/apps/web/.next/static  apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
