"use client";

import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { cn } from "@/lib/cn";
import styles from "./ProgressBar.module.css";

export type ProgressTone = "default" | "success" | "warning" | "danger";

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: ProgressTone;
  /** Accessible label for the progress region. */
  label?: string;
  /** Render the numeric value text next to the label. */
  showValue?: boolean;
  className?: string;
}

/**
 * `components/feedback/progress-bar` (Batch C, Beta).
 * Determinate; Radix exposes aria-valuenow/min/max. Used by the hub
 * System Audit panel where the readout must agree with its rows.
 */
export function ProgressBar({
  value,
  max = 100,
  tone = "default",
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const pct = Math.round((Math.min(Math.max(value, 0), max) / max) * 100);

  return (
    <div className={cn(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={cn(styles.header, "ts-label-sm")}>
          {label ? <span>{label}</span> : <span />}
          {showValue ? (
            <span className={styles.value}>
              {value}/{max}
            </span>
          ) : null}
        </div>
      )}
      <Progress.Root
        className={styles.track}
        data-tone={tone}
        value={value}
        max={max}
        aria-label={label}
      >
        <Progress.Indicator
          className={styles.indicator}
          style={{ transform: `translateX(-${100 - pct}%)` }}
        />
      </Progress.Root>
    </div>
  );
}
