#!/bin/bash
# Mekong OPB — Recruitment Setup Script
# Run this after getting Zalo OA credentials from oa.zalo.me

set -e

echo "=== Mekong OPB Recruitment Setup ==="
echo ""

# Step 1: Set Zalo OA credentials
echo "Step 1: Setting Zalo OA credentials..."
echo ""
read -p "Enter your Zalo App ID: " APP_ID
read -s -p "Enter your Zalo App Secret: " APP_SECRET
echo ""

echo "$APP_ID" | wrangler secret put ZALO_APP_ID --name mekong-opb-api
echo "$APP_SECRET" | wrangler secret put ZALO_APP_SECRET --name mekong-opb-api

echo "✅ Zalo credentials set"
echo ""

# Step 2: Verify API is working
echo "Step 2: Verifying API..."
curl -s https://mekong-opb-api.sadec-marketing-hub.workers.dev/pilot/health | jq .
echo ""

# Step 3: Test broadcast
echo "Step 3: Testing broadcast (check Zalo OA console for delivery)..."
curl -s -X POST https://mekong-opb-api.sadec-marketing-hub.workers.dev/pilot/broadcast \
  -H "Content-Type: application/json" \
  -d '{"message":"🎉 TEST BROADCAST — Mekong OPB recruitment is live!","target":"all"}' | jq .
echo ""

# Step 4: Check landing page
echo "Step 4: Verifying landing page..."
echo "Landing page: https://76edd9b6.mekong-opb-web.pages.dev/"
echo "Signup API: https://mekong-opb-api.sadec-marketing-hub.workers.dev/pilot/signup"
echo ""

# Step 5: Custom domain instructions
echo "=== Custom Domain Setup ==="
echo ""
echo "To connect mekongmind.com/opb to this landing page:"
echo ""
echo "Option A — Cloudflare Pages (if domain on CF):"
echo "  1. Go to https://dash.cloudflare.com"
echo "  2. Navigate to: Pages → mekong-opb-web → Settings → Custom domains"
echo "  3. Add custom domain: mekongmind.com/opb"
echo "  4. CF will auto-configure DNS if domain is on CF"
echo ""
echo "Option B — External domain:"
echo "  1. Create CNAME record: opb → mekong-opb-web.pages.dev"
echo "  2. Add custom domain in CF Pages dashboard"
echo ""
echo "=== Done! ==="
