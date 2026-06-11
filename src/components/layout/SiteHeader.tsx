"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { TopNavigation } from "@/components/navigation/top-navigation/TopNavigation";
import { Brand } from "./Brand";
import { MenuCommand } from "./MenuCommand";
import { SiteMenu } from "./SiteMenu";
import { ThemeToggle } from "./ThemeToggle";
import { WorkTogetherCta } from "@/components/actions/work-together-cta/WorkTogetherCta";
import { useTransitionClick } from "@/components/loading/useTransitionClick";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMenuController } from "@/hooks/useMenuController";
import { navItems } from "@/content/navItems";
import { resolveSectionHref } from "@/lib/navHref";

/** Site shell header: Top Navigation + brand + responsive mobile menu. */
export function SiteHeader() {
  const pathname = usePathname();
  const { open, setOpen } = useMenuController();
  // Section detection keys off the original `#id` hrefs (element ids).
  const hrefs = navItems.map((i) => i.href);
  const activeHref = useActiveSection(hrefs);
  // Rendered links resolve to `/#id` when away from the home page.
  const items = navItems.map((i) => ({
    ...i,
    href: resolveSectionHref(i.href, pathname),
  }));
  const contactHref = resolveSectionHref("#contact", pathname);
  const handleContactTransition = useTransitionClick(contactHref);
  const handleMenuToggle = React.useCallback(() => {
    setOpen((value) => !value);
  }, [setOpen]);
  const handleMenuNavigate = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  const handleContactClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      handleContactTransition(event);
      if (event.defaultPrevented) {
        setOpen(false);
      }
    },
    [handleContactTransition, setOpen],
  );

  return (
    <>
      <TopNavigation
        variant="glass"
        compact
        menuOpen={open}
        brand={<Brand />}
        items={items}
        activeHref={activeHref}
        actions={
          <>
            <div className="hidden lg:block">
              <WorkTogetherCta href={contactHref} onClick={handleContactClick} />
            </div>
            <ThemeToggle />
          </>
        }
        menuTrigger={<MenuCommand open={open} onClick={handleMenuToggle} />}
      />
      <SiteMenu
        open={open}
        items={items}
        activeHref={activeHref}
        onNavigate={handleMenuNavigate}
      />
    </>
  );
}
