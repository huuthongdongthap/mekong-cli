import { test, expect } from "@playwright/test"

// Smoke test: verify that when a user visits /dashboard, the page renders
// (either shows dashboard content or redirects to login — both are valid)
test("dashboard page renders or redirects to login", async ({ page }) => {
  await page.goto("/dashboard")
  // Wait for navigation to settle
  await page.waitForLoadState("networkidle")
  // Should either be on dashboard or redirected to login
  const url = page.url()
  const isDashboard = url.includes("/dashboard")
  const isLogin = url.includes("/login")
  expect(isDashboard || isLogin).toBeTruthy()

  if (isDashboard) {
    // If we landed on dashboard, there should be some visible content
    await expect(page.locator("body")).not.toBeEmpty()
  }
})
