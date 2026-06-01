"use client";

import * as React from "react";

export type ViewMode = "quick" | "deep";

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const ViewModeContext = React.createContext<ViewModeContextValue | null>(null);

const STORAGE_KEY = "ed-view-mode";
const CHANGE_EVENT = "ed-view-mode-change";

function readStoredMode(): ViewMode {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === "quick" || stored === "deep" ? stored : "deep";
  } catch {
    return "deep";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Shared app state for the Recruiter Hub view mode (recruiter-hub §3.3).
 * Default `deep` — the full portfolio is the baseline. The choice persists for
 * the browser session (sessionStorage) so it survives navigation to a case
 * study and back, but resets on a fresh visit. Read via `useSyncExternalStore`
 * so SSR/first paint render `deep` (no hydration mismatch), then reconcile to
 * the stored value.
 */
export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const mode = React.useSyncExternalStore(
    subscribe,
    readStoredMode,
    () => "deep" as ViewMode,
  );

  const setMode = React.useCallback((next: ViewMode) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode / blocked) — still notify in-tab */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const value = React.useMemo(() => ({ mode, setMode }), [mode, setMode]);
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
