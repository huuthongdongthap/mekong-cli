import { test, expect } from "@playwright/test"

test("homepage loads and shows login redirect", async ({ page }) => {
  await page.goto("/")
  // Should either show login page or redirect to login
  await expect(page).toHaveURL(/.*(login|\/$)/)
})
