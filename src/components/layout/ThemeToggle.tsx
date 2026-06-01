"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/actions/icon-button/IconButton";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ed-theme";
const CHANGE_EVENT = "ed-theme-change";

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
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
 * Light/dark toggle. Dark is canonical; first load is resolved before paint by
 * the inline script in the root layout (stored choice → else prefers-color-
 * scheme → else dark). This control flips `data-theme` on <html>, persists the
 * choice, and notifies same-tab subscribers. Read via `useSyncExternalStore` so
 * SSR/first paint match (no hydration mismatch).
 */
export function ThemeToggle() {
  const theme = React.useSyncExternalStore(
    subscribe,
    getTheme,
    () => "dark" as Theme,
  );
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = React.useCallback(() => {
    const target: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = target;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, target);
    } catch {
      /* storage unavailable — still flip + notify for this session */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return (
    <IconButton
      ariaLabel={`Switch to ${next} theme`}
      variant="ghost"
      onClick={toggle}
      icon={theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    />
  );
}
