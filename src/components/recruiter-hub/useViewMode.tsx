"use client";

import * as React from "react";

export type ViewMode = "quick" | "deep";

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const ViewModeContext = React.createContext<ViewModeContextValue | null>(null);

/**
 * Shared app state for the Recruiter Hub view mode (recruiter-hub §3.3).
 * Default `deep` — the full portfolio is the baseline. No browser storage.
 */
export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ViewMode>("deep");
  const value = React.useMemo(() => ({ mode, setMode }), [mode]);
  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextValue {
  const ctx = React.useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return ctx;
}
