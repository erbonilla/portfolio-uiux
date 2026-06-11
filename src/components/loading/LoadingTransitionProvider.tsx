"use client";

import * as React from "react";
import { LoadingVeil } from "./LoadingVeil";

export type VeilState = "hidden" | "entering" | "holding" | "exiting";

type TransitionContextValue = {
  state: VeilState;
  goToHref: (href: string) => void;
};

type Action =
  | { type: "HIDE" }
  | { type: "ENTER" }
  | { type: "HOLD" }
  | { type: "EXIT" };

const ENTER_MS = 220;
const MIN_HOLD_MS = 420;
const EXIT_MS = 420;
const INITIAL_MIN_MS = 700;
const INITIAL_MAX_MS = 1400;
const FAILSAFE_MS = 1600;

const LoadingTransitionContext =
  React.createContext<TransitionContextValue | null>(null);

function reducer(_state: VeilState, action: Action): VeilState {
  switch (action.type) {
    case "ENTER":
      return "entering";
    case "HOLD":
      return "holding";
    case "EXIT":
      return "exiting";
    case "HIDE":
      return "hidden";
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function targetIsInView(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top >= 0 && rect.top < viewportHeight * 0.65;
}

function focusTarget(target: HTMLElement) {
  const heading = target.querySelector<HTMLElement>(
    "h1, h2, h3, [tabindex='-1']",
  );
  (heading ?? target).focus({ preventScroll: true });
}

export function LoadingTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(reducer, "holding");
  const timersRef = React.useRef<Set<number>>(new Set());

  const clearTimers = React.useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current.clear();
  }, []);

  const schedule = React.useCallback((fn: () => void, ms: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      fn();
    }, ms);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const hide = React.useCallback(() => {
    dispatch({ type: "HIDE" });
  }, []);

  React.useEffect(() => {
    // Reduced-motion users: the inline boot script already set
    // data-loading-veil="skip" pre-paint; just sync React state and bail.
    if (prefersReducedMotion()) {
      hide();
      return;
    }

    let cancelled = false;
    const fontsReady =
      "fonts" in document
        ? (document.fonts.ready as Promise<FontFaceSet>)
        : Promise.resolve();

    Promise.race([
      Promise.all([delay(INITIAL_MIN_MS), fontsReady]),
      delay(INITIAL_MAX_MS),
    ]).then(() => {
      if (cancelled) return;
      dispatch({ type: "EXIT" });
      schedule(hide, EXIT_MS);
    });

    schedule(hide, FAILSAFE_MS);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [clearTimers, hide, schedule]);

  const goToHref = React.useCallback(
    (href: string) => {
      if (!href.includes("#")) return;
      const hash = href.slice(href.indexOf("#"));
      const id = hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      clearTimers();

      if (targetIsInView(target)) {
        history.pushState(null, "", hash);
        focusTarget(target);
        return;
      }

      if (prefersReducedMotion()) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        history.pushState(null, "", hash);
        focusTarget(target);
        hide();
        return;
      }

      dispatch({ type: "ENTER" });
      schedule(() => {
        dispatch({ type: "HOLD" });
        target.scrollIntoView({ block: "start", behavior: "auto" });
        history.pushState(null, "", hash);
        focusTarget(target);
      }, ENTER_MS);
      schedule(() => {
        dispatch({ type: "EXIT" });
      }, ENTER_MS + MIN_HOLD_MS);
      schedule(hide, ENTER_MS + MIN_HOLD_MS + EXIT_MS);
      schedule(hide, FAILSAFE_MS);
    },
    [clearTimers, hide, schedule],
  );

  React.useEffect(() => clearTimers, [clearTimers]);

  const value = React.useMemo(
    () => ({ state, goToHref }),
    [goToHref, state],
  );

  return (
    <LoadingTransitionContext.Provider value={value}>
      {children}
      <LoadingVeil state={state} />
    </LoadingTransitionContext.Provider>
  );
}

export function useLoadingTransitionContext() {
  const context = React.useContext(LoadingTransitionContext);
  if (!context) {
    throw new Error(
      "useLoadingTransitionContext must be used inside LoadingTransitionProvider",
    );
  }
  return context;
}
