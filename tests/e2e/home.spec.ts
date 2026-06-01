import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("homepage", () => {
  test("loads with a single h1 and the hub trigger", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /recruiter hub/i })).toBeVisible();
  });

  test("nav exposes the section links", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /primary/i });
    for (const label of [
      "Work",
      "Graphic",
      "Digital",
      "Approach",
      "About",
      "Contact",
    ]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("keyboard opens the hub, ESC closes it and returns focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /recruiter hub/i });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /recruiter hub/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("view-mode toggle visibly reflows the page (Quick hides role rows)", async ({
    page,
  }) => {
    await page.goto("/");
    const roleRow = page.locator(".tile-roles").first();
    await expect(roleRow).toBeVisible();

    await page.getByRole("button", { name: /recruiter hub/i }).click();
    await page.getByRole("radio", { name: /quick scan/i }).click();

    await expect(page.locator("main")).toHaveAttribute("data-view-mode", "quick");
    await expect(roleRow).toBeHidden();
  });

  test("no dead links (href='#')", async ({ page }) => {
    await page.goto("/");
    const hashLinks = await page.locator('a[href="#"]').count();
    expect(hashLinks).toBe(0);
  });
});

test.describe("responsive (no horizontal overflow)", () => {
  for (const width of [375, 768, 1280]) {
    test(`no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});

test.describe("reduced motion", () => {
  test("hub remains operable under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: /recruiter hub/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  test("homepage has no critical/serious violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
