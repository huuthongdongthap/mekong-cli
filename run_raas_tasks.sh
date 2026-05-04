#!/bin/bash
cd "/Users/mac/mekong-cli"
clear
echo "🚀 M1 MAX SAFE SEQUENTIAL EXECUTION: RaaS Blueprint Sprint 1 & 2..."
echo "=========================================================================="
echo "⏳ Queue ID 1/3: TASK 1 - Shopee + TikTok Shop OAuth Integration"
CLAUDE_CONFIG_DIR=~/.claude-developer claude "/dev-feature Task 1: Shopee + TikTok Shop OAuth Integration. Scope: Shopee Open Platform OAuth 2.0 + HMAC signature, TikTok Shop OAuth 2.0, Token storage with encryption, marketplace-sync Edge Function deployment. --auto" --dangerously-skip-permissions

echo "=========================================================================="
echo "⏳ Queue ID 2/3: TASK 2 - AI Listing Generation Deployment"
CLAUDE_CONFIG_DIR=~/.claude-developer claude "/dev-feature Task 2: AI Listing Generation Deployment. Scope: Deploy ai-listing-gen Edge Function (Gemini 1.5 Flash), Platform-specific constraints, Multilingual output: VI -> EN, ZH, JA, ai-image-analyze for product photo QA. --auto" --dangerously-skip-permissions

echo "=========================================================================="
echo "⏳ Queue ID 3/3: TASK 5 - Security Hardening"
CLAUDE_CONFIG_DIR=~/.claude-developer claude "/dev-feature Task 5: Security Hardening. Scope: Token encryption for marketplace credentials, Rate limiting on all Edge Functions, CSP header hardening, RLS policy verification, Environment secrets audit. --auto" --dangerously-skip-permissions

echo "✅ RaaS RUNBOOK COMPLETED SUCCESSFULLY"
