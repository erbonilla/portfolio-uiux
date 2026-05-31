"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Drawer } from "@/components/overlays/drawer/Drawer";
import { IconButton } from "@/components/actions/icon-button/IconButton";
import type { NavItem } from "@/content/navItems";
import styles from "./MobileMenu.module.css";

/** Compact-viewport navigation: a left Drawer of the in-page section links. */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      side="left"
      size="sm"
      title="Menu"
      trigger={
        <IconButton ariaLabel="Open menu" icon={<Menu />} variant="ghost" />
      }
    >
      <nav aria-label="Mobile">
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={styles.link}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
