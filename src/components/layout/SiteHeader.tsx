"use client";

import { TopNavigation } from "@/components/navigation/top-navigation/TopNavigation";
import { Brand } from "./Brand";
import { MobileMenu } from "./MobileMenu";
import { useActiveSection } from "@/hooks/useActiveSection";
import { navItems } from "@/content/navItems";

/** Site shell header: Top Navigation + brand + responsive mobile menu. */
export function SiteHeader() {
  const hrefs = navItems.map((i) => i.href);
  const activeHref = useActiveSection(hrefs);

  return (
    <TopNavigation
      variant="glass"
      brand={<Brand />}
      items={navItems}
      activeHref={activeHref}
      menuTrigger={<MobileMenu items={navItems} />}
    />
  );
}
