import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/**
 * Story: short positioning lead (always shown) + long-form narrative that is
 * hidden in Quick Scan via `.story-longform` (view-mode contract, sync §3).
 */
export function StoryPanel() {
  return (
    <section className={cn(s.section, s.storyBand)} aria-label="Story">
      <div className="container">
        <div className={cn(s.story, s.storyPanel)}>
          <p className={cn(s.storyLead, "ts-title-lg")}>
            I design product interfaces for moments when clarity matters.
          </p>
          <div className="story-longform">
            <p className={cn(s.storyBody, "ts-body-lg")}>
              Good UI/UX starts before the first screen: with the person using
              the product, the constraints around them, and the decision they
              need to make. I turn that context into structure, then into
              token-driven visual systems and responsive interfaces that hiring
              teams can inspect, test, and extend.
            </p>
            <p className={cn(s.storyEmphasis, "ts-body-lg")}>
              Each case study should make the user problem, tradeoffs, and
              interface logic clear without relying on invented metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
