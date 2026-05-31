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
  fullCaseStudyUrl: string;
  liveProductUrl?: string;
  deckUrl?: string;
  summary: string;
  audience: string;
  problem: string;
  keyDecision: string;
  proofPoints: string[];
  a11yNotes: string;
  outcomeFraming: string;
  honestyNote: string;
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
      "A senior-friendly rehab PWA shaped around the Medical Repository → Action Dashboard pivot, guest-first booking, and a daily rehab loop for adults 60+.",
    roles: ["UX", "UI", "Design system", "Accessibility"],
    tags: ["60+ access", "WCAG 2.2 AA", "Action Dashboard"],
    image: {
      src: "/assets/osteoplus-screenshot.jpg",
      alt: "Osteóplus product screens showing a recovery dashboard and booking interface.",
      width: 1600,
      height: 705,
    },
    href: "/work/osteoplus",
    fullCaseStudyUrl: "https://case-study-osteoplus.vercel.app/",
    liveProductUrl: "https://osteoplus-v2-9.vercel.app/es",
    summary:
      "A bilingual clinic product for osteopathy, physiotherapy, and rehabilitation in Barcelona, designed around guest-first booking and a daily rehab loop for adults 35-85, optimized for users 60+.",
    audience:
      "Post-care adults with mixed digital confidence, clinic staff, and family helpers who need appointment clarity and safe rehab guidance.",
    problem:
      "The first IA behaved like a medical repository: users had to browse, remember, interpret, and decide before taking the next action.",
    keyDecision:
      "Move from Medical Repository to Action Dashboard, making Today the default surface and keeping the next meaningful action one tap away.",
    proofPoints: [
      "Guest-first 3-step booking with no account barrier.",
      "Daily Rehab Loop with exercises, pain check, and safety interruption.",
      "Senior-facing type scale with 48px minimum and 56px primary touch targets.",
      "Transparent concept-project framing and validation roadmap.",
    ],
    a11yNotes:
      "Designed to WCAG 2.2 AA with plain-language ES-first copy, focus-visible states, reduced-motion support, and touch-target tokens.",
    outcomeFraming:
      "Pre-launch impact is framed as a measurement strategy anchored on Weekly Adherence Rate, not as fabricated outcomes.",
    honestyNote:
      "Original fictional brand for a Barcelona clinic context. Solo concept project, not a client engagement.",
  },
  {
    slug: "atlan",
    brand: "Atlan Performance",
    title: "Open-water telemetry for tired eyes.",
    domain: "Sports & endurance",
    status: "Built · Solo · 2026",
    statusTone: "accent",
    teaser:
      "An offline-first bilingual coaching PWA for executive endurance athletes, with Wet Mode, adaptive session logic, and disclosure-first research framing.",
    roles: ["UX", "UI", "Design system", "Wet mode"],
    tags: ["Offline-first PWA", "Wet Mode", "Honest research"],
    image: {
      src: "/assets/atlan-screenshot.jpg",
      alt: "Atlan product screens showing swim telemetry and performance views.",
      width: 1600,
      height: 706,
    },
    href: "/work/atlan",
    fullCaseStudyUrl: "https://case-study-atlan.vercel.app/",
    deckUrl: "https://case-study-atlan.vercel.app/Atlan%20Deck.html",
    summary:
      "A self-initiated UX concept for an offline-first, bilingual coaching PWA for executive endurance athletes, built end-to-end solo over roughly 10 weeks.",
    audience:
      "Executive endurance athletes, 30-50, who need scientific depth without cognitive overload and training plans that adapt when real life changes the plan.",
    problem:
      "Endurance tools tend to split between deep-science dashboards and social motivation loops; neither supports high-rigor training with autonomy and low cognitive load.",
    keyDecision:
      "Treat schedule disruption as the default state, then design adaptive session swapping, Wet Mode, and depth-on-demand coaching around that reality.",
    proofPoints: [
      "Wet Mode interaction model for glare, fatigue, motion, and wet hands.",
      "Session Swapper flow that recalculates training without shaming the user.",
      "Bilingual onboarding and product voice system.",
      "Clear honesty and disclosure section separating synthesis from ethnography.",
    ],
    a11yNotes:
      "Primary surfaces are framed around WCAG 2.2 AA, with AAA contrast on the high-stakes screen and high-contrast interaction states.",
    outcomeFraming:
      "Outcome claims are presented as hypotheses and validation targets, not launched-user results.",
    honestyNote:
      "Self-initiated concept. Research uses secondary literature, competitive teardown, and informal conversations rather than a formal recruited panel.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
