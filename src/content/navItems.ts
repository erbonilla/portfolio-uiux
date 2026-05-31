export type NavItem = { label: string; href: string };

/** In-page section anchors for the site shell (impl §1, §5). */
export const navItems: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Graphic", href: "#graphic" },
  { label: "Digital", href: "#digital" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
