# ── API Dockerfile (NestJS, monorepo-aware) ──────────────────────────────────
# Build context: monorepo root (.)
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Stage 1: install + build ────────────────────────────────────────────────
FROM base AS builder

# Copy workspace root files first (cache-friendly layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared + api packages (pnpm will resolve workspace deps)
COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

# Install — pnpm resolves workspace structure from root config
RUN pnpm install --frozen-lockfile

WORKDIR /app/packages/api
RUN pnpm run build

# Prune dev dependencies
RUN pnpm prune --prod

# ── Stage 2: production ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/node_modules ./node_modules
COPY --from=builder /app/packages/api/package.json ./
COPY --from=builder /app/packages/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/api/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/packages/api/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

USER app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]