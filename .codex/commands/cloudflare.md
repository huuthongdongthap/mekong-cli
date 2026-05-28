---
codex-command: "/cloudflare"
source: ".claude/commands/cloudflare.md"
invocation: "mekong cloudflare $ARGUMENTS"
description: "Access Cloudflare skill for edge computing, serverless, storage, and AI"
argument-hint: "$ARGUMENTS"
allowed-tools: "default"
content-sha256: "1d64e0892cd5b3512f4c9c6deffdac75c2d08f284e32393c0b0c1d0ed5929928"
---

# /cloudflare

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong cloudflare $ARGUMENTS
```

## Source Command

# /cloudflare Command

Load Cloudflare platform reference and get contextual guidance.

## Usage

```
/cloudflare                  # Show decision trees
/cloudflare workers          # Workers quick start
/cloudflare d1               # D1 database guide
/cloudflare r2               # R2 storage guide
/cloudflare kv               # KV store guide
/cloudflare pages            # Pages deployment
/cloudflare ai               # Workers AI guide
```

## Examples

### Deploy API with Database

```
/cloudflare workers d1
```

This will guide you through:

1. Creating a Worker
2. Setting up D1 database
3. Writing CRUD endpoints
4. Deploying to production

### Static Site with Functions

```
/cloudflare pages
```

This will guide you through:

1. Building your static site
2. Adding edge functions
3. Configuring bindings
4. Deploying to Pages

### File Storage

```
/cloudflare r2
```

This will guide you through:

1. Creating R2 bucket
2. Writing upload/download API
3. Configuring public access
4. S3 compatibility

## Decision Trees

When you run `/cloudflare` without arguments, you'll see:

### Running Code

- Static site → Pages
- API/webhook → Workers
- Stateful logic → Durable Objects
- Scheduled tasks → Workers + Cron

### Storage

- Key-value → KV
- SQL/relational → D1
- Large files → R2
- Message queue → Queues

### AI/ML

- Inference → Workers AI
- Embeddings → Vectorize
- AI agents → Agents SDK

## Related Skills

- `devops` - General DevOps including Cloudflare basics
- `backend-development` - API patterns that work with Cloudflare
