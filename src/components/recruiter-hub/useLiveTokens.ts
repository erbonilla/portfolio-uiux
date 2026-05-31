"use client";

import * as React from "react";

export type RadiusMode = "default" | "rounded" | "no-corner-radius";

export const radiusModes: { id: RadiusMode; label: string }[] = [
  { id: "default", label: "Default corners" },
  { id: "rounded", label: "Rounded corners" },
  { id: "no-corner-radius", label: "Sharp corners" },
];

/**
 * Live tokenizer (hub §4 / spec §3 honesty rule): mutates the REAL CSS
 * variable system by setting `:root[data-radius]`, and reports the resolved
 * `--radius-control-md` value so the readout reflects actual state.
 */
export function useLiveTokens() {
  const [mode, setModeState] = React.useState<RadiusMode>("default");
  const [resolved, setResolved] = React.useState<string>("");

  const readResolved = React.useCallback(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--radius-control-md")
      .trim();
    setResolved(value || "Not available");
  }, []);

  const setMode = React.useCallback(
    (next: RadiusMode) => {
      const root = document.documentElement;
      if (next === "default") {
        root.removeAttribute("data-radius");
      } else {
        root.setAttribute("data-radius", next);
      }
      setModeState(next);
      // Read after the attribute applies.
      requestAnimationFrame(readResolved);
    },
    [readResolved],
  );

  React.useEffect(() => {
    // Defer the initial read out of the synchronous effect body.
    const raf = requestAnimationFrame(readResolved);
    return () => cancelAnimationFrame(raf);
  }, [readResolved]);

  return { mode, setMode, resolved };
}
