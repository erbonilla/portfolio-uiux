export type RangeProject = {
  id: string;
  category: "graphic" | "digital";
  title: string;
  tag: string;
  /** Description — hidden in Quick Scan (`.range-card-desc`). */
  description: string;
};

/**
 * The "Range" section shows breadth across the domains the studio works in.
 * Framed as focus areas (honest) rather than fabricated named projects.
 */
export const rangeProjects: RangeProject[] = [
  {
    id: "studio-mark",
    category: "graphic",
    title: "Studio mark & logo system",
    tag: "Brand identity · 2026",
    description:
      "Exploration of the (ed)studio wordmark, symbol system, and brand usage rules.",
  },
  {
    id: "poster-series",
    category: "graphic",
    title: "Typography poster series",
    tag: "Poster · 2025",
    description:
      "Large-scale type studies for rhythm, hierarchy, contrast, and campaign presence.",
  },
  {
    id: "editorial-layouts",
    category: "graphic",
    title: "Long-form editorial layouts",
    tag: "Editorial · 2025",
    description:
      "Content-led systems for readable, accessible stories across long-scroll pages.",
  },
  {
    id: "atlan-campaign",
    category: "digital",
    title: "Atlan launch campaign",
    tag: "Social campaign · 2026",
    description:
      "Digital launch assets shaped around ocean endurance, coaching, and legible performance cues.",
  },
  {
    id: "motion-stills",
    category: "digital",
    title: "Brand motion stills",
    tag: "Motion · 2025",
    description:
      "Static frames and motion directions for product moments that need pace without noise.",
  },
  {
    id: "marketing-banners",
    category: "digital",
    title: "Marketing banners & OG images",
    tag: "Web banner · 2025",
    description:
      "Responsive campaign compositions for web, social previews, and content distribution.",
  },
];
