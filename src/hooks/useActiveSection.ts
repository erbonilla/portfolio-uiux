"use client";

import * as React from "react";

/**
 * Tracks which in-page section is in view, returning its `#id` href so the
 * top navigation can mark the current section with aria-current.
 */
export function useActiveSection(hrefs: string[]): string | undefined {
  const [active, setActive] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const ids = hrefs
      .filter((h) => h.startsWith("#"))
      .map((h) => h.slice(1));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
}
