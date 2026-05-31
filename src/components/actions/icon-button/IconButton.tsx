import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./IconButton.module.css";

export type IconButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Required accessible name — icon-only controls must be labelled (§29.1). */
  ariaLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon: React.ReactNode;
}

/** `components/actions/icon-button` (Batch A, Beta). Requires `ariaLabel`. */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(function IconButton(
  { ariaLabel, variant = "ghost", size = "md", icon, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      data-variant={variant}
      data-size={size}
      className={cn(styles.root, className)}
      {...props}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
});
