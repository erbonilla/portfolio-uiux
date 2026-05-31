import * as React from "react";
import NextLink from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./Link.module.css";

export type LinkVariant = "default" | "muted" | "brand" | "inverse";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: LinkVariant;
  external?: boolean;
  /** Show a trailing external-link glyph for external destinations. */
  showExternalIcon?: boolean;
}

/**
 * `components/actions/link` (Batch A, Beta).
 * Internal hrefs route through next/link; external links get
 * rel="noopener noreferrer" + an optional communicated external affordance.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      href,
      variant = "default",
      external,
      showExternalIcon = true,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const isExternal = external ?? /^https?:\/\//.test(href);
    const classes = cn(styles.root, className);

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          data-variant={variant}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...props}
        >
          {children}
          {showExternalIcon ? (
            <ExternalLink className={styles.externalIcon} aria-hidden="true" />
          ) : null}
          <span className={styles.srOnly}> (opens in a new tab)</span>
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        data-variant={variant}
        className={classes}
        {...props}
      >
        {children}
      </NextLink>
    );
  },
);
