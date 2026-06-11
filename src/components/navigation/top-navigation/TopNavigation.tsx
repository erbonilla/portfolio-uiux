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
  /** Menu trigger. In compact mode this is shown at all breakpoints. */
  menuTrigger?: React.ReactNode;
  variant?: TopNavVariant;
  /** Marks the current in-page/section target with aria-current. */
  activeHref?: string;
  compact?: boolean;
  menuOpen?: boolean;
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
  compact = false,
  menuOpen = false,
  "aria-label": ariaLabel = "Primary",
}: TopNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      data-variant={variant}
      data-compact={compact || undefined}
      data-menu-open={menuOpen || undefined}
      data-theme={menuOpen ? "dark" : undefined}
      className={styles.root}
    >
      <div className={cn(styles.inner, "container")}>
        <div className={styles.brand}>{brand}</div>

        {!compact ? (
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
        ) : (
          <div className={styles.menuTriggerContainer}>
            {menuTrigger}
          </div>
        )}

        <div className={styles.actions}>
          {!compact && menuTrigger ? (
            <span className={styles.menuTrigger}>{menuTrigger}</span>
          ) : null}
          {actions}
        </div>
      </div>
    </nav>
  );
}
