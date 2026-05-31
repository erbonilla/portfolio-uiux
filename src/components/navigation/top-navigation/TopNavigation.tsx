import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./TopNavigation.module.css";

export interface TopNavItem {
  label: string;
  href: string;
}

export type TopNavVariant = "transparent" | "solid" | "glass";

export interface TopNavigationProps {
  brand: React.ReactNode;
  items: TopNavItem[];
  actions?: React.ReactNode;
  /** Mobile menu trigger, shown only below the desktop breakpoint. */
  menuTrigger?: React.ReactNode;
  variant?: TopNavVariant;
  /** Marks the current in-page/section target with aria-current. */
  activeHref?: string;
  "aria-label"?: string;
}

/**
 * `components/navigation/top-navigation` (Batch D, Beta).
 * nav landmark + visible focus order; collapses to a menu trigger on compact.
 */
export function TopNavigation({
  brand,
  items,
  actions,
  menuTrigger,
  variant = "glass",
  activeHref,
  "aria-label": ariaLabel = "Primary",
}: TopNavigationProps) {
  return (
    <nav aria-label={ariaLabel} data-variant={variant} className={styles.root}>
      <div className={cn(styles.inner, "container")}>
        <div className={styles.brand}>{brand}</div>

        <ul className={cn(styles.list, "ts-label-md")}>
          {items.map((item) => {
            const active = activeHref === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={styles.link}
                  data-active={active || undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          {actions}
          {menuTrigger ? (
            <span className={styles.menuTrigger}>{menuTrigger}</span>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
