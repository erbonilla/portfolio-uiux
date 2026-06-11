import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./SlidingPlusCta.module.css";

export type SlidingPlusCtaSize = "md" | "lg";

export interface SlidingPlusCtaProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  label: string;
  size?: SlidingPlusCtaSize;
}

export function SlidingPlusCta({
  href,
  label,
  size = "md",
  className,
  ...props
}: SlidingPlusCtaProps) {
  const isExternal = /^https?:\/\//.test(href);

  const content = (
    <span className={styles.stage}>
      <span className={styles.iconStart} aria-hidden="true">
        <Plus />
      </span>

      <span className={styles.labelTile}>
        <span className={styles.labelMask}>
          <span className={styles.labelText}>{label}</span>
        </span>
      </span>

      <span className={styles.iconEnd} aria-hidden="true">
        <Plus />
      </span>
    </span>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(styles.root, className)}
        data-size={size}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
      {content}
    </Link>
  );
}
