import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

export type CardVariant = "flat" | "raised" | "glass" | "interactive";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  selected?: boolean;
  as?: React.ElementType;
}

/**
 * `components/data/card` (Batch F, Beta). Glass surface, tight radius.
 * Interactive cards must carry their own role + keyboard behavior — wrap a
 * real link/button rather than making a div clickable.
 */
export function Card({
  variant = "glass",
  selected,
  as: Tag = "div",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      data-variant={variant}
      data-selected={selected || undefined}
      className={cn(styles.root, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
