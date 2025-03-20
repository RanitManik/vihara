import { expect, test } from "@playwright/test";

const UI_URL = "http://localhost:3000/";

test("should allow the user to sign in", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("example@example.com");
    await page.locator("[name=password]").fill("password@123");

    await page.getByRole("button", { name: "Continue with email" }).click();

    await expect(page.getByText("You signed in successfully")).toBeVisible();
});
