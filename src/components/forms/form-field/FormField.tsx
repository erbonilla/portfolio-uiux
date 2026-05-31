"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import styles from "./FormField.module.css";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  /**
   * Render-prop receiving the ids to wire onto the control so the label and
   * messages are programmatically associated (§29.2).
   */
  children: (ids: {
    id: string;
    describedBy?: string;
    invalid: boolean;
  }) => React.ReactNode;
  className?: string;
}

function useFieldId(explicit?: string) {
  const reactId = React.useId();
  return explicit ?? `field-${reactId}`;
}

/** `components/forms/form-field` (Batch B, Beta). */
export function FormField({
  label,
  htmlFor,
  helperText,
  error,
  success,
  required,
  disabled,
  children,
  className,
}: FormFieldProps) {
  const id = useFieldId(htmlFor);
  const messageId = `${id}-msg`;
  const message = error ?? success ?? helperText;
  const state = error ? "error" : success ? "success" : "default";

  return (
    <div
      className={cn(styles.root, className)}
      data-state={state}
      data-disabled={disabled || undefined}
    >
      <label htmlFor={id} className={cn(styles.label, "ts-label-md")}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({
        id,
        describedBy: message ? messageId : undefined,
        invalid: !!error,
      })}
      {message ? (
        <p
          id={messageId}
          className={cn(styles.message, "ts-caption-sm")}
          role={error ? "alert" : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
