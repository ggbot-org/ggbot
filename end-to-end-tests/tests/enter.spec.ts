import { route } from "@ggbot2/user-webapp";
import { test, expect } from "@playwright/test";

test("enter", async ({ page }) => {
  await page.goto(route.authPage());
  await expect(page).toHaveTitle("ggbot2");
});
