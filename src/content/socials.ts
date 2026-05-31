export type Social = { id: string; label: string; href: string };

/**
 * Blocker B1: real LinkedIn/Facebook/Instagram URLs are not yet provided.
 * Entries stay as `href: 'TODO'` and the footer renders ONLY real entries
 * (see `visibleSocials`) — no dead links ship (impl §3, no-fake-links rule).
 */
export const socials: Social[] = [
  {
    id: "linkedin",
    label: "Edgar Bonilla on LinkedIn",
    href: "https://www.linkedin.com/in/edgarbonillag",
  },
  { id: "facebook", label: "Edgar Bonilla on Facebook", href: "TODO" },
  { id: "instagram", label: "Edgar Bonilla on Instagram", href: "TODO" },
];

/** Build-time guard: omit any entry whose href is still the placeholder. */
export const visibleSocials = socials.filter((s) => s.href !== "TODO");
