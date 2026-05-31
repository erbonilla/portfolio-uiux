import type { BadgeTone } from "@/components/feedback/badge/Badge";

export type CaseStudy = {
  slug: string;
  brand: string;
  title: string;
  domain: string;
  status: string;
  statusTone: BadgeTone;
  /** Full teaser (Deep Dive). Collapses to one line in Quick Scan. */
  teaser: string;
  /** Role rows — hidden in Quick Scan (`.tile-roles`). */
  roles: string[];
  tags: string[];
  image: { src: string; alt: string; width: number; height: number };
  /** B4 default: internal stub route. */
  href: string;
};

/**
 * NOTE: copy here is high-level and metric-free by design: no invented
 * outcomes (honesty rule). Final narrative + real metrics are owner-supplied.
 * Images are the normalized assets from `pnpm assets:normalize`.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "osteoplus",
    brand: "Osteóplus",
    title: "Turning a medical repository into a recovery dashboard.",
    domain: "Digital health",
    status: "Concept · Solo · 2026",
    statusTone: "brand",
    teaser:
      "For post-op patients and clinic staff, I reframed a content-heavy portal around large touch targets, plain-language guidance, and a booking path that does not depend on calling the clinic.",
    roles: ["UX", "UI", "Design system", "Accessibility"],
    tags: ["Digital health", "Accessibility", "Clinical clarity"],
    image: {
      src: "/assets/osteoplus-screenshot.jpg",
      alt: "Osteóplus product screens showing a recovery dashboard and booking interface.",
      width: 1600,
      height: 705,
    },
    href: "/work/osteoplus",
  },
  {
    slug: "atlan",
    brand: "Atlan Performance",
    title: "Open-water telemetry for tired eyes.",
    domain: "Sports & endurance",
    status: "Built · Solo · 2026",
    statusTone: "accent",
    teaser:
      "For endurance swimmers and coaches, I translated cadence and cardiovascular signals into high-contrast pacing views built for glare, fatigue, and motion.",
    roles: ["UX", "UI", "Design system", "Wet mode"],
    tags: ["Sports", "Telemetry", "Performance"],
    image: {
      src: "/assets/atlan-screenshot.jpg",
      alt: "Atlan product screens showing swim telemetry and performance views.",
      width: 1600,
      height: 706,
    },
    href: "/work/atlan",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
