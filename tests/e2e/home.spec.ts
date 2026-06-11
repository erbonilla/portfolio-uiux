import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { awaitVeilHidden } from "./helpers/loadingVeil";

test.describe("homepage", () => {
  test("loads with a single h1 and the hub trigger", async ({ page }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /recruiter hub/i })).toBeVisible();
  });

  test("compact nav exposes the section links through the menu", async ({ page }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    const nav = page.getByRole("navigation", { name: /primary/i });
    await expect(nav.getByRole("button", { name: /open menu/i })).toBeVisible();
    await nav.getByRole("button", { name: /open menu/i }).click();
    const menu = page.getByRole("navigation", { name: /^menu$/i });
    for (const label of [
      "Home",
      "Work",
      "Range",
      "Approach",
      "About",
      "Contact",
    ]) {
      await expect(menu.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("keyboard opens the hub, ESC closes it and returns focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    const trigger = page.getByRole("button", { name: /recruiter hub/i });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /recruiter hub/i }),
    ).toBeVisible();

    // Wait for the slide-in transition to settle before pressing Escape.
    await page.waitForTimeout(600);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("view-mode toggle visibly reflows the page (Quick hides role rows)", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    const roleRow = page.locator(".tile-roles").first();
    await expect(roleRow).toBeVisible();

    await page.getByRole("button", { name: /recruiter hub/i }).click();
    await page.getByRole("radio", { name: /quick scan/i }).click();

    await expect(page.locator("main")).toHaveAttribute("data-view-mode", "quick");
    await expect(roleRow).toBeHidden();
  });

  test("no dead links (href='#')", async ({ page }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    const hashLinks = await page.locator('a[href="#"]').count();
    expect(hashLinks).toBe(0);
  });
});

test.describe("responsive (no horizontal overflow)", () => {
  for (const width of [375, 768, 1280]) {
    test(`no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await awaitVeilHidden(page);
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
    await awaitVeilHidden(page);
    await page.getByRole("button", { name: /recruiter hub/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("loading transition veil", () => {
  test("initial veil is present on boot and then exits", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    const veil = page.locator('[data-loading-veil="true"]');
    await expect(veil).toHaveAttribute("data-state", /holding|exiting|hidden/);
    await awaitVeilHidden(page);
    // Regression guard: data-loading-veil="skip" must NOT be set on html after
    // a normal (non-reduced-motion) load — it would permanently suppress CTA veils.
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-loading-veil",
      "skip",
    );
  });

  test("hero contact CTA jumps under the veil and focuses contact", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);

    await page
      .locator("main")
      .getByRole("link", { name: "Work together" })
      .click();

    // Regression guard: veil must actually be visible right after the click,
    // not just carry the right data-state attribute (a CSS override could hide it).
    const veil = page.locator('[data-loading-veil="true"]');
    await expect(veil).toBeVisible();
    await awaitVeilHidden(page);
    await expect(page).toHaveURL(/#contact$/);
    await expect(
      page.getByRole("heading", {
        name: /build clear, accessible product interfaces/i,
      }),
    ).toBeFocused();
  });

  test("contact CTA skips the veil when contact is already in view", async ({
    page,
  }) => {
    await page.goto("/#contact");
    await awaitVeilHidden(page);

    await page
      .getByRole("navigation", { name: /primary/i })
      .getByRole("link", { name: /work together/i })
      .click();

    await expect(page.locator('[data-loading-veil="true"]')).toHaveAttribute(
      "data-state",
      "hidden",
    );
  });
});

test.describe("command-bar menu", () => {
  test("opens non-modally, marks the page inert, and closes with Escape", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);

    const trigger = page.locator('[aria-controls="site-menu"]');
    await trigger.click();

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#site-menu")).toHaveAttribute("data-open", "true");
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await expect(
      page
        .getByRole("navigation", { name: /primary/i })
        .getByRole("link", { name: /work together/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#site-menu")).not.toHaveAttribute("data-open");
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  });

  test("keeps the header contact CTA live while the menu is open", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);

    await page.getByRole("button", { name: /open menu/i }).click();
    await page
      .getByRole("navigation", { name: /primary/i })
      .getByRole("link", { name: /work together/i })
      .click();

    await awaitVeilHidden(page);
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#site-menu")).not.toHaveAttribute("data-open");
  });

  test("uses location aria-current and a marker for the active section", async ({
    page,
  }) => {
    await page.goto("/#work");
    await awaitVeilHidden(page);
    await page.getByRole("button", { name: /open menu/i }).click();

    const workLink = page
      .getByRole("navigation", { name: /^menu$/i })
      .getByRole("link", { name: "Work" });
    await expect(workLink).toHaveAttribute("aria-current", "location");
    await expect(workLink.locator("span").first()).toHaveCSS(
      "opacity",
      "1",
    );
  });
});

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  test("homepage has no critical/serious violations", async ({ page }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("light theme (prefers-color-scheme) has no critical/serious violations", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await awaitVeilHidden(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test("open command menu has no critical/serious violations", async ({
    page,
  }) => {
    await page.goto("/");
    await awaitVeilHidden(page);
    await page.getByRole("button", { name: /open menu/i }).click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});

test.describe("theme toggle", () => {
  test("flips the theme, updates its label, and persists", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await awaitVeilHidden(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: /switch to light theme/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.getByRole("button", { name: /switch to dark theme/i }),
    ).toBeVisible();

    // Choice persists across a reload (localStorage).
    await page.reload();
    await awaitVeilHidden(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
