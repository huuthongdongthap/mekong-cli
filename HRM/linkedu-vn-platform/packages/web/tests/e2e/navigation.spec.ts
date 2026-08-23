import { test, expect } from "@playwright/test"

// Smoke test: verify key pages load without JavaScript errors
const PAGES = [
  { path: "/", name: "home" },
  { path: "/login", name: "login" },
  { path: "/dashboard", name: "dashboard" },
  { path: "/pricing", name: "pricing" },
  { path: "/learners", name: "learners" },
]

for (const { path, name } of PAGES) {
  test(`${name} page loads without errors`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto(path, { waitUntil: "networkidle" })

    // Filter out known non-critical errors (e.g., Sentry DSN missing)
    const criticalErrors = errors.filter(
      (e) => !e.includes("SENTRY_DSN") && !e.includes("favicon")
    )
    expect(criticalErrors).toHaveLength(0)
  })
}
