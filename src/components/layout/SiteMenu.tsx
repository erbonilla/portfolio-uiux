import * as React from "react";
import type { NavItem } from "@/content/navItems";
import { visibleSocials } from "@/content/socials";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import styles from "./SiteMenu.module.css";

function isActiveHref(activeHref: string | undefined, itemHref: string) {
  if (!activeHref) return false;
  if (itemHref === activeHref) return true;
  return itemHref.endsWith(activeHref);
}

function currentForHref(active: boolean, href: string) {
  if (!active) return undefined;
  return href.includes("#") ? "location" : "page";
}

export function SiteMenu({
  open,
  items,
  activeHref,
  onNavigate,
}: {
  open: boolean;
  items: NavItem[];
  activeHref?: string;
  onNavigate: () => void;
}) {
  const menuItems = [{ label: "Home", href: "#top" }, ...items];

  return (
    <section
      id="site-menu"
      className={styles.root}
      data-open={open || undefined}
      data-theme="dark"
      inert={!open}
      aria-label="Menu"
    >
      <div className={cn(styles.inner, "container")}>
        <nav className={styles.nav} aria-label="Menu">
          <ul className={styles.list}>
            {menuItems.map((item, index) => {
              const active = isActiveHref(activeHref, item.href);
              return (
                <li
                  key={item.href}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <a
                    href={item.href}
                    className={styles.link}
                    data-active={active || undefined}
                    aria-current={currentForHref(active, item.href)}
                    onClick={onNavigate}
                  >
                    <span className={styles.marker} aria-hidden="true" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <aside className={styles.contact} aria-label="Contact">
          <p className={cn(styles.eyebrow, "ts-label-md")}>Working globally</p>
          <a className={styles.email} href={`mailto:${aboutCopy.email}`}>
            {aboutCopy.email}
          </a>
          <ul className={styles.availability}>
            <li>Open to selected roles and projects</li>
            <li>Based in Costa Rica</li>
            <li>Spanish and English</li>
          </ul>
          <ul className={styles.socials} aria-label="Social links">
            {visibleSocials.map((social) => (
              <li key={social.id}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
