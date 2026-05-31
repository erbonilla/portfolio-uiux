import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

/**
 * `components/feedback/badge` (Batch C, Beta). Status/count chip.
 * Status is never communicated by color alone — pair with text/icon (§22).
 */
export function Badge({
  tone = "neutral",
  size = "sm",
  icon,
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-tone={tone}
      data-size={size}
      className={cn(styles.root, "ts-label-sm", className)}
      {...props}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
