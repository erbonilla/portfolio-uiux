"use client";

import * as React from "react";

export function useMenuController() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    const inertElements = document.querySelectorAll<HTMLElement>("main, footer");

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";
    inertElements.forEach((element) => element.setAttribute("inert", ""));

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
      inertElements.forEach((element) => element.removeAttribute("inert"));
    };
  }, [open]);

  React.useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document
        .querySelectorAll<HTMLElement>("main, footer")
        .forEach((element) => element.removeAttribute("inert"));
    };
  }, []);

  return { open, setOpen };
}
