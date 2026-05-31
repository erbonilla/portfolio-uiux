"use client";

import { useLiveTokens, radiusModes } from "./useLiveTokens";
import { cn } from "@/lib/cn";
import s from "./hub.module.css";

/**
 * Panel 03 — Live tokenizer. Mutates the real `:root[data-radius]` token mode
 * and shows the resolved `--radius-control-md` value in a polite live region.
 */
export function LiveTokenizerPanel() {
  const { mode, setMode, resolved } = useLiveTokens();

  return (
    <section className={s.panel} aria-labelledby="hub-tokenizer-title">
      <div className={s.panelHead}>
        <h3 id="hub-tokenizer-title" className={cn(s.panelTitle, "ts-title-sm")}>
          03 · Radius preview
        </h3>
        <p className={cn(s.panelHelp, "ts-body-sm")}>
          Preview how the portfolio responds when its radius token changes
          across the page.
        </p>
      </div>

      <div role="radiogroup" aria-label="Radius preview mode" className={s.choices}>
        {radiusModes.map((m) => {
          const checked = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={checked}
              className={cn(s.choice, "ts-label-md")}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <p className={cn(s.readout, "ts-code-md")} aria-live="polite">
        Active control radius:{" "}
        <span className={s.readoutValue}>{resolved}</span>
      </p>
    </section>
  );
}
