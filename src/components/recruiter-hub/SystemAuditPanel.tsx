"use client";

import { Check, CircleDot, X } from "lucide-react";
import { ProgressBar } from "@/components/feedback/progress-bar/ProgressBar";
import { cn } from "@/lib/cn";
import s from "./hub.module.css";

type AuditStatus = "pass" | "todo" | "fail";

type AuditItem = { label: string; status: AuditStatus };

/**
 * Panel 04 — System audit. A DATED, HONEST snapshot of launch readiness.
 * The passing count, the row count, and the progress bar all derive from the
 * same array, so they cannot disagree (spec §2 / §4 honesty rule).
 */
const AUDIT_DATE = "2026-06-01";

const items: AuditItem[] = [
  { label: "Responsive layout from 320 to 1440px, no horizontal overflow", status: "pass" },
  { label: "WCAG 2.2 AA focus states and contrast", status: "pass" },
  { label: "View modes reflow the page", status: "pass" },
  { label: "Components use semantic tokens", status: "pass" },
  { label: "Installable PWA and production service worker", status: "pass" },
  { label: "Real social URLs (LinkedIn/Facebook/Instagram)", status: "pass" },
  { label: "Final app-icon export from wordmark", status: "todo" },
  { label: "Formspree contact endpoint configured in Vercel", status: "todo" },
];

const statusMeta: Record<
  AuditStatus,
  { label: string; icon: React.ReactNode }
> = {
  pass: { label: "Ready", icon: <Check aria-hidden="true" /> },
  todo: { label: "Needed", icon: <CircleDot aria-hidden="true" /> },
  fail: { label: "Issue", icon: <X aria-hidden="true" /> },
};

export function SystemAuditPanel() {
  const total = items.length;
  const passing = items.filter((i) => i.status === "pass").length;

  return (
    <section className={s.panel} aria-labelledby="hub-audit-title">
      <div className={s.panelHead}>
        <h3 id="hub-audit-title" className={cn(s.panelTitle, "ts-title-sm")}>
          04 · Launch checklist
        </h3>
        <p className={cn(s.panelHelp, "ts-body-sm")}>
          Current launch status.{" "}
          <span className={s.auditDate}>Updated {AUDIT_DATE}.</span>
        </p>
      </div>

      <div className={s.auditSummary}>
        <ProgressBar
          value={passing}
          max={total}
          label={`${passing}/${total} launch checks ready`}
          showValue
        />
      </div>

      <ul className={cn(s.auditList, "ts-body-sm")}>
        {items.map((item) => {
          const meta = statusMeta[item.status];
          return (
            <li key={item.label} className={s.auditRow}>
              <span>{item.label}</span>
              <span className={cn(s.auditStatus, "ts-label-sm")} data-status={item.status}>
                {meta.icon}
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
