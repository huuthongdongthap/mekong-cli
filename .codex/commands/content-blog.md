---
codex-command: "/content-blog"
source: ".claude/commands/content-blog.md"
invocation: "mekong content-blog $ARGUMENTS"
description: "Blog post creation — research, outline, draft, SEO optimization. 4 steps, ~25 min."
argument-hint: "[topic or keyword]"
allowed-tools: "Read, Write, Bash, Task"
content-sha256: "710dbd26e8197d372651088f7712e274b35d15a79c45a697f928dadd602cb5a3"
---

# /content-blog

Run this Mekong command through the project CLI from `/Users/mac/mekong-cli`.

```bash
mekong content-blog $ARGUMENTS
```

## Source Command

# /content:content-blog — Blog Post Creator

**Super command** — chains steps via DAG pipeline.

## Pipeline

```
SEQUENTIAL:
  ├── topic-research          → research.md
  ├── outline                 → outline.md
  ├── draft                   → blog-post.md
  └── seo-optimize            → final-post.md
```

## Output directory: reports/content/content-blog/
