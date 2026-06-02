export type NavItem = { label: string; href: string };

/** In-page section anchors for the site shell (impl §1, §5). */
export const navItems: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Range", href: "#range" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "#contact" },
];
