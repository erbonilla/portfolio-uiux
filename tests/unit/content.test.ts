import { describe, it, expect } from "vitest";
import { socials, visibleSocials } from "@/content/socials";
import { toolGroups } from "@/content/tools";

const tools = toolGroups.flatMap((group) => group.tools);

describe("socials guard (B1, no dead links)", () => {
  it("defines the expected networks (linkedin + github real, facebook + instagram pending)", () => {
    expect(socials.map((s) => s.id)).toEqual([
      "linkedin",
      "github",
      "facebook",
      "instagram",
    ]);
  });

  it("renders only entries with a real URL; TODO placeholders are filtered out", () => {
    // Facebook + Instagram remain TODO until URLs land — they must not ship.
    expect(socials.some((s) => s.href === "TODO")).toBe(true);
    expect(visibleSocials.map((s) => s.id)).toEqual(["linkedin", "github"]);
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
