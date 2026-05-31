"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./RecruiterHubTrigger.module.css";

/**
 * Persistent `RECRUITER HUB` pill (spec §5). Fixed, z-overlay (400), with a
 * leading live dot. Rendered via the Drawer's asChild trigger.
 */
export const RecruiterHubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function RecruiterHubTrigger({ className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(styles.trigger, "ts-label-md", className)}
      {...props}
    >
      <span className={styles.dot} aria-hidden="true" />
      Recruiter Hub
    </button>
  );
});
