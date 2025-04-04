import { expect, test } from "@playwright/test";

const UI_URL = "http://localhost:3000/";

test("should allow the user to sign in", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("test@example.com");
    await page.locator("[name=password]").fill("password@123");

    await page.getByRole("button", { name: "Continue with email" }).click();

    await expect(page.getByText("signed in successfully")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow user to register", async ({ page }) => {
    const testEmail = `test_user_${Date.now()}@test.com`;
    await page.goto(UI_URL);

    // landed: in the home page
    await expect(
        page.getByRole("heading", { name: "Welcome To vihara" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Sign in" }).click();
    // redirected: in the sign-in page

    await page.getByRole("link", { name: "Register" }).click();

    // redirected: in the sign-up page
    await page.locator("[name=firstName]").fill("test_firstName");
    await page.locator("[name=lastName]").fill("test_lastName");
    await page.locator("[name=email]").fill(testEmail);
    await page.locator("[name=password]").fill("password@123");

    await page.getByRole("button", { name: "Continue with email" }).click();

    // registration success: redirected: in the sign-in page
    await expect(page.getByText("Account Created Successfully")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});
