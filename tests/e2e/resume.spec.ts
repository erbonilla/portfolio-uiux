import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  {
    path: "/resume",
    h1: "Edgar Bonilla G.",
    pdf: "/edgar-bonilla-resume.pdf",
    toggleName: /español/i,
    togglePath: "/resume/es",
    downloadName: /download résumé/i,
  },
  {
    path: "/resume/es",
    h1: "Edgar Bonilla G.",
    pdf: "/edgar-bonilla-resume-es.pdf",
    toggleName: /english/i,
    togglePath: "/resume",
    downloadName: /descargar currículum/i,
  },
] as const;

for (const r of pages) {
  test.describe(`résumé page (${r.path})`, () => {
    test("loads with a single h1", async ({ page }) => {
      await page.goto(r.path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(r.h1);
    });

    test("download link points at the PDF and is real (no dead links)", async ({
      page,
    }) => {
      await page.goto(r.path);
      const download = page.getByRole("link", { name: r.downloadName }).first();
      await expect(download).toHaveAttribute("href", r.pdf);
      await expect(download).toHaveAttribute("download", /.*/);
      expect(await page.locator('a[href="#"]').count()).toBe(0);
    });

    test("language toggle links to the other locale", async ({ page }) => {
      await page.goto(r.path);
      const toggle = page.getByRole("link", { name: r.toggleName });
      await expect(toggle).toHaveAttribute("href", r.togglePath);
    });

    test("section nav links resolve home (/#…) from this sub-page", async ({
      page,
    }) => {
      await page.goto(r.path);
      const nav = page.getByRole("navigation", { name: /primary/i });
      await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute(
        "href",
        "/#work",
      );
    });

    for (const width of [375, 768, 1280]) {
      test(`no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(r.path);
        const overflow = await page.evaluate(() => {
          const de = document.documentElement;
          return de.scrollWidth - de.clientWidth;
        });
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }

    test("no critical/serious axe violations (WCAG 2.2 AA)", async ({ page }) => {
      await page.goto(r.path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  });
}
