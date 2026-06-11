import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./WorkTogetherCta.module.css";

export type WorkTogetherCtaSize = "header" | "hero";

export interface WorkTogetherCtaProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  label?: string;
  size?: WorkTogetherCtaSize;
}

export function WorkTogetherCta({
  href = "#contact",
  label = "Work together",
  size = "header",
  className,
  ...props
}: WorkTogetherCtaProps) {
  return (
    <Link
      href={href}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
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
    </Link>
  );
}
