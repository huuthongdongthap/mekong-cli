import { test, expect } from "@playwright/test"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

test("API health endpoint returns 200", async ({ request }) => {
  const response = await request.get(`${API_BASE}/health`)
  expect(response.ok()).toBeTruthy()
})

test("API responds to pricing tiers endpoint", async ({ request }) => {
  const response = await request.get(`${API_BASE}/pricing/tiers`)
  // Should return 200 (with auth) or 401 (without) — either means the endpoint exists
  expect([200, 401]).toContain(response.status())
})
