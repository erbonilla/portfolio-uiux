import { describe, it, expect } from "vitest";
import { socials, visibleSocials } from "@/content/socials";
import { toolGroups } from "@/content/tools";

const tools = toolGroups.flatMap((group) => group.tools);

describe("socials guard (B1, no dead links)", () => {
  it("keeps all three networks defined", () => {
    expect(socials.map((s) => s.id)).toEqual([
      "linkedin",
      "facebook",
      "instagram",
    ]);
  });

  it("omits any entry whose href is still the TODO placeholder", () => {
    const allTodo = socials.every((s) => s.href === "TODO");
    expect(allTodo).toBe(true);
    // Until real URLs land, nothing renders — no dead links ship.
    expect(visibleSocials).toHaveLength(0);
  });

  it("never exposes a placeholder/dead href as visible", () => {
    for (const s of visibleSocials) {
      expect(s.href).not.toBe("TODO");
      expect(s.href).not.toBe("#");
    }
  });
});

describe("tools strip honesty (Next.js, not Vite)", () => {
  it("lists Next.js", () => {
    expect(tools.some((t) => t.label === "Next.js")).toBe(true);
  });
  it("does not list Vite", () => {
    expect(tools.some((t) => /vite/i.test(t.label))).toBe(false);
  });
});
