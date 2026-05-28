# PTP Tech

Modern web application built on Cloudflare infrastructure.

## Stack

- **Frontend**: Next.js (static export) → Cloudflare Pages
- **API**: Cloudflare Workers (Edge API)
- **Database**: D1 (SQLite) / KV (optional)

## Quick Start

```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd api && npm install && cd ..

# Development
npm run dev          # Run both frontend + API
npm run dev:frontend # Frontend only
npm run dev:api      # API only

# Build & Deploy
npm run build:frontend
npm run deploy
```

## Structure

```
ptp-tech/
├── frontend/          # Next.js static site
│   ├── src/app/       # App router pages
│   ├── public/        # Static assets
│   └── wrangler.toml  # Pages config
├── api/               # Cloudflare Workers
│   ├── src/index.ts   # Worker entry point
│   └── wrangler.toml  # Workers config
└── package.json       # Root scripts
```

## Deploy

```bash
# Frontend → Cloudflare Pages
cd frontend && npm run deploy

# API → Cloudflare Workers
cd api && npm run deploy
```
