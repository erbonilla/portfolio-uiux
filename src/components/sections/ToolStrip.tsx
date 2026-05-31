import {
  SiAnthropic,
  SiFigma,
  SiGithub,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import type React from "react";
import { toolGroups } from "@/content/tools";
import { cn } from "@/lib/cn";
import { AdobeGlyph, OpenAIGlyph } from "./ToolGlyphs";
import s from "./sections.module.css";

/**
 * Brand marks keyed by tool id. Built at module scope (cf. `SiteFooter`'s
 * `socialIcons`) so the icon components stay static. Adobe and OpenAI are
 * self-hosted glyphs — the Simple Icons npm set dropped those marks.
 */
const toolMarks: Record<string, React.ReactNode> = {
  figma: <SiFigma aria-hidden="true" />,
  adobe: <AdobeGlyph />,
  anthropic: <SiAnthropic aria-hidden="true" />,
  openai: <OpenAIGlyph />,
  react: <SiReact aria-hidden="true" />,
  nextjs: <SiNextdotjs aria-hidden="true" />,
  typescript: <SiTypescript aria-hidden="true" />,
  tailwind: <SiTailwindcss aria-hidden="true" />,
  github: <SiGithub aria-hidden="true" />,
};

/** Tools flattened into a single evenly-spaced run, in category order. */
const allTools = toolGroups.flatMap((group) => group.tools);

/**
 * One full pass of the toolkit — every mark in one continuous, uniformly
 * spaced row (category order preserved, no group separators). The marquee
 * renders this twice side by side; the second copy is `aria-hidden` so the
 * looping animation is seamless without the assistive tree reading every tool
 * twice.
 */
function ToolSequence({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className={cn(s.toolsSeq, "ts-label-md")} aria-hidden={duplicate || undefined}>
      {allTools.map((tool) => (
        <li key={tool.id} className={s.tool}>
          <span className={s.toolIcon}>{toolMarks[tool.id]}</span>
          {tool.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Tool strip — the honest current toolkit grouped into Design / AI / Developer,
 * presented as a continuously auto-scrolling horizontal marquee. The motion
 * pauses on hover/focus and is disabled under `prefers-reduced-motion`, where
 * the strip degrades to a manually scrollable row.
 */
export function ToolStrip() {
  return (
    <section className={cn(s.section, s.brandBand)} aria-label="Tools and stack">
      <div className="container">
        <div className={cn(s.head, s.toolsHead)}>
          <p className={cn(s.eyebrow, s.builtWith, "ts-label-md")}>Built with</p>
        </div>
      </div>
      <div className={s.toolsMarquee}>
        <div className={s.toolsTrack}>
          <ToolSequence />
          <ToolSequence duplicate />
        </div>
      </div>
    </section>
  );
}
