import { expect, type Page } from "@playwright/test";

export async function awaitVeilHidden(page: Page) {
  await expect(page.locator('[data-loading-veil="true"]')).toHaveAttribute(
    "data-state",
    "hidden",
    { timeout: 10_000 },
  );
}
