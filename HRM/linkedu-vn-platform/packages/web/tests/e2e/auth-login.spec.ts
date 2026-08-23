import { test, expect } from "@playwright/test"

test("login page loads with form fields", async ({ page }) => {
  await page.goto("/login")
  await expect(page.locator("input[type='email'], input[name='email'], input[placeholder*='email' i]")).toBeVisible()
  await expect(page.locator("input[type='password'], input[name='password']")).toBeVisible()
  await expect(page.locator("button[type='submit'], button:has-text('Đăng nhập'), button:has-text('Login')")).toBeVisible()
})
