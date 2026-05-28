---
name: dev-deploy
description: "Dev deploy command. Delegates to worker level."
---

# /dev:deploy — Developer Level

**Developer execution command** — code generation and quality.

## Pipeline

DELEGATION: dev:deploy → worker:*
OUTPUT: reports/dev/deploy/

## Execution

Load recipe: recipes/dev/deploy.json

Execute DAG groups in dependency order.

## Goal context

<goal>$ARGUMENTS</goal>
