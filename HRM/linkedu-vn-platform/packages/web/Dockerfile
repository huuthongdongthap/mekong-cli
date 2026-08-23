# ── Web Dockerfile (Next.js standalone, monorepo-aware) ─────────────────────
# Build context: monorepo root (.)
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Stage 1: install + build ────────────────────────────────────────────────
FROM base AS builder

# Copy workspace root files (cache-friendly layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared + web packages (pnpm will resolve workspace deps)
COPY packages/shared ./packages/shared
COPY packages/web ./packages/web

RUN pnpm install --frozen-lockfile

WORKDIR /app/packages/web
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm run build

# ── Stage 2: production ─────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Monorepo standalone nests output: .next/standalone/<root>/packages/web/*
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./.next/static
COPY --from=builder /app/packages/web/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]