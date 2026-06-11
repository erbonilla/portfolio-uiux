"use client";

import * as React from "react";
import { useLoadingTransitionContext } from "./LoadingTransitionProvider";

function isModifiedClick(event: React.MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function canHandleHref(href: string) {
  if (!href.includes("#")) return false;
  if (typeof window === "undefined") return false;
  const isSamePageHash = href.startsWith("#");
  const isHomeHash = href.startsWith("/#") && window.location.pathname === "/";
  return isSamePageHash || isHomeHash;
}

export function useTransitionClick(href: string) {
  const { goToHref } = useLoadingTransitionContext();

  return React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;
      if (!canHandleHref(href)) return;

      event.preventDefault();
      goToHref(href);
    },
    [goToHref, href],
  );
}
