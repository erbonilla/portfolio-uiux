export type ToolCategory = "design" | "ai" | "developer";

export type Tool = {
  id: string;
  label: string;
  /** Simple Icons slug where the installed npm set ships the brand mark. */
  icon?: string;
  /**
   * Self-hosted brand glyph (see `ToolGlyphs.tsx`) for marks the Simple Icons
   * npm package dropped — Adobe and OpenAI. Takes precedence over `icon`.
   */
  glyph?: "adobe" | "openai";
};

export type ToolGroup = {
  id: ToolCategory;
  label: string;
  tools: Tool[];
};

/**
 * The honest current toolkit (design-sync §7 / impl §4), organised by category.
 * This portfolio is built with **Next.js**, NOT Vite.
 *
 * Adobe and OpenAI render from self-hosted glyphs because the installed
 * `@icons-pack/react-simple-icons` no longer ships those marks. Cursor is
 * intentionally omitted for now — Simple Icons has no canonical Cursor mark and
 * the placeholder glyph read as a dead icon.
 */
export const toolGroups: ToolGroup[] = [
  {
    id: "design",
    label: "Design",
    tools: [
      { id: "figma", label: "Figma", icon: "figma" },
      { id: "adobe", label: "Adobe", glyph: "adobe" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    tools: [
      { id: "anthropic", label: "Anthropic", icon: "anthropic" },
      { id: "openai", label: "OpenAI", glyph: "openai" },
    ],
  },
  {
    id: "developer",
    label: "Developer",
    tools: [
      { id: "react", label: "React", icon: "react" },
      { id: "nextjs", label: "Next.js", icon: "nextdotjs" },
      { id: "typescript", label: "TypeScript", icon: "typescript" },
      { id: "tailwind", label: "Tailwind", icon: "tailwindcss" },
      { id: "github", label: "GitHub", icon: "github" },
    ],
  },
];
