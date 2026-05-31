import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

/**
 * `components/actions/button` (Batch A, Beta).
 * Semantic tokens only; variant/size via data-* + CSS (handoff §33).
 * One primary action per decision area (§29.1).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      size = "md",
      loading = false,
      iconLeading,
      iconTrailing,
      children,
      disabled,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        data-variant={variant}
        data-size={size}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn(styles.root, "ts-label-md", className)}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {!loading && iconLeading ? (
          <span className={styles.icon} aria-hidden="true">
            {iconLeading}
          </span>
        ) : null}
        <span className={styles.label}>{children}</span>
        {iconTrailing ? (
          <span className={styles.icon} aria-hidden="true">
            {iconTrailing}
          </span>
        ) : null}
      </button>
    );
  },
);
