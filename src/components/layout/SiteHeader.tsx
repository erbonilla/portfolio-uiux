"use client";

import { usePathname } from "next/navigation";
import { TopNavigation } from "@/components/navigation/top-navigation/TopNavigation";
import { Brand } from "./Brand";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { navItems } from "@/content/navItems";
import { resolveSectionHref } from "@/lib/navHref";

/** Site shell header: Top Navigation + brand + responsive mobile menu. */
export function SiteHeader() {
  const pathname = usePathname();
  // Section detection keys off the original `#id` hrefs (element ids).
  const hrefs = navItems.map((i) => i.href);
  const activeHref = useActiveSection(hrefs);
  // Rendered links resolve to `/#id` when away from the home page.
  const items = navItems.map((i) => ({
    ...i,
    href: resolveSectionHref(i.href, pathname),
  }));

  return (
    <TopNavigation
      variant="glass"
      brand={<Brand />}
      items={items}
      activeHref={activeHref}
      actions={<ThemeToggle />}
      menuTrigger={<MobileMenu items={items} />}
    />
  );
}
