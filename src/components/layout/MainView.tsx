"use client";

import { useViewMode } from "@/components/recruiter-hub/useViewMode";

/**
 * The `<main>` landmark. Carries `data-view-mode` so the Phase 3 CSS reflows
 * the page when the Recruiter Hub switches Quick Scan ↔ Deep Dive (impl §2.2).
 */
export function MainView({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();
  return (
    <main id="main-content" data-view-mode={mode}>
      {children}
    </main>
  );
}
