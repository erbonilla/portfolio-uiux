"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { Zap, Search } from "lucide-react";
import { useViewMode, type ViewMode } from "./useViewMode";
import { cn } from "@/lib/cn";
import s from "./hub.module.css";

const options: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  { value: "quick", label: "30s Quick Scan", icon: <Zap aria-hidden="true" /> },
  { value: "deep", label: "5m Deep Dive", icon: <Search aria-hidden="true" /> },
];

/**
 * Panel 01 — Adaptable view mode (LAUNCH SCOPE). Radiogroup with Lucide
 * Zap/Search icons (never emoji); drives `data-view-mode` so the page really
 * reflows (impl §2). Active mode announced via aria-live.
 */
export function ViewModePanel() {
  const { mode, setMode } = useViewMode();

  return (
    <section className={s.panel} aria-labelledby="hub-viewmode-title">
      <div className={s.panelHead}>
        <h3 id="hub-viewmode-title" className={cn(s.panelTitle, "ts-title-sm")}>
          01 · View mode
        </h3>
        <p className={cn(s.panelHelp, "ts-body-sm")}>
          Choose how much detail the portfolio shows for your review time.
        </p>
      </div>

      <RadioGroup.Root
        className={s.segmented}
        value={mode}
        onValueChange={(v) => setMode(v as ViewMode)}
        aria-label="Portfolio view mode"
        orientation="horizontal"
      >
        {options.map((opt) => (
          <RadioGroup.Item
            key={opt.value}
            value={opt.value}
            className={cn(s.segment, "ts-label-md")}
          >
            {opt.icon}
            {opt.label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>

      <p className="sr-only" aria-live="polite">
        {mode === "quick"
          ? "Quick Scan mode active. Supporting details are hidden."
          : "Deep Dive mode active. Full portfolio detail is shown."}
      </p>
    </section>
  );
}
