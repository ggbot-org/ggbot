import { testAccount1, testOtp } from "@ggbot2/test-data";
import { route } from "@ggbot2/user-webapp";
import { test, expect } from "@playwright/test";

test("enter", async ({ page }) => {
  await page.goto(route.authPage());
  await page.fill("input", testAccount1.email);
  await page.click("button");
  await page.waitForLoadState("networkidle");
  await page.fill("input", testOtp.code);
  await page.click("button");
  await page.waitForLoadState("networkidle");
  expect(page).toHaveTitle("ggbot2");
});
