export type Social = { id: string; label: string; href: string };

/**
 * Footer social destinations. Keep the build-time guard below: any future
 * placeholder must stay hidden so no dead social link ships.
 */
export const socials: Social[] = [
  {
    id: "linkedin",
    label: "Edgar Bonilla on LinkedIn",
    href: "https://www.linkedin.com/in/edgarbonillag/",
  },
  {
    id: "github",
    label: "Edgar Bonilla on GitHub",
    href: "https://github.com/erbonilla",
  },
  {
    id: "facebook",
    label: "Oxygeno Coaching on Facebook",
    href: "https://www.facebook.com/oxygenozar",
  },
  {
    id: "instagram",
    label: "Coach Edgar Bonilla on Instagram",
    href: "https://www.instagram.com/coacherbonilla",
  },
];

/** Build-time guard: omit any entry whose href is still the placeholder. */
export const visibleSocials = socials.filter((s) => s.href !== "TODO");
