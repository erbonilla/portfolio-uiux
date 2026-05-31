"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { IconButton } from "@/components/actions/icon-button/IconButton";
import { cn } from "@/lib/cn";
import styles from "./Drawer.module.css";

export type DrawerSide = "left" | "right" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  size?: DrawerSize;
  /** Accessible dialog title. Pass `hideTitle` to visually hide it. */
  title: string;
  description?: string;
  hideTitle?: boolean;
  trigger?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** z-index layer: overlay (drawer) sits above sticky chrome. */
  className?: string;
}

/**
 * `components/overlays/drawer` (Batch E, Beta) on Radix Dialog.
 * Focus trap, inert background, ESC, scrim click, and focus return to the
 * trigger are handled by Radix. Slide+fade motion is CSS, reduced-motion safe.
 */
export function Drawer({
  open,
  onOpenChange,
  side = "right",
  size = "md",
  title,
  description,
  hideTitle = false,
  trigger,
  header,
  footer,
  children,
  className,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={cn(styles.content, className)}
          data-side={side}
          data-size={size}
        >
          <div className={styles.header}>
            {hideTitle ? (
              <VisuallyHidden asChild>
                <Dialog.Title>{title}</Dialog.Title>
              </VisuallyHidden>
            ) : (
              <Dialog.Title className={cn(styles.title, "ts-title-md")}>
                {title}
              </Dialog.Title>
            )}
            {header}
            <Dialog.Close asChild>
              <IconButton
                ariaLabel="Close panel"
                icon={<X />}
                variant="ghost"
                className={styles.close}
              />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className={cn(styles.description, "ts-body-sm")}>
              {description}
            </Dialog.Description>
          ) : null}
          <div className={styles.body}>{children}</div>
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
