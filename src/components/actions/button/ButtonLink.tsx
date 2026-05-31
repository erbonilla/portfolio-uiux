import * as React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";
import type { ButtonSize, ButtonVariant } from "./Button";

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

/**
 * An anchor styled as a Button — for navigation CTAs (avoids the invalid
 * <a> inside <button> nesting). Internal hrefs route through next/link.
 */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      href,
      variant = "secondary",
      size = "md",
      iconLeading,
      iconTrailing,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const content = (
      <>
        {iconLeading ? (
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
      </>
    );

    const classes = cn(styles.root, "ts-label-md", className);
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          data-variant={variant}
          data-size={size}
          className={classes}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        data-variant={variant}
        data-size={size}
        className={classes}
        {...props}
      >
        {content}
      </NextLink>
    );
  },
);
