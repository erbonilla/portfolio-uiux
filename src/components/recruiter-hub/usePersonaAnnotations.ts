"use client";

import * as React from "react";

export type PersonaId = "none" | "hiring-manager" | "design-lead" | "recruiter";

export const personas: { id: PersonaId; label: string }[] = [
  { id: "none", label: "No notes" },
  { id: "hiring-manager", label: "Hiring manager" },
  { id: "design-lead", label: "Design lead" },
  { id: "recruiter", label: "Recruiter" },
];

/** Section id -> the note this persona cares about. */
const ANNOTATIONS: Record<PersonaId, Record<string, string>> = {
  none: {},
  "hiring-manager": {
    work: "Role and outcomes",
    approach: "Process maturity",
    contact: "Availability",
  },
  "design-lead": {
    work: "System decisions",
    range: "Domain range",
    approach: "Craft rationale",
  },
  recruiter: {
    about: "Background & positioning",
    contact: "Fastest way to reach me",
    work: "Headline projects",
  },
};

const ANNOTATION_CLASS = "persona-annotation";

/**
 * Persona filter (hub §4): applies REAL DOM-text annotations — small labelled
 * notes injected next to the relevant section headings for the chosen persona,
 * and removed when the persona changes (honest, not a fake toggle).
 */
export function usePersonaAnnotations() {
  const [persona, setPersona] = React.useState<PersonaId>("none");

  React.useEffect(() => {
    // Clear any previous annotations.
    document
      .querySelectorAll(`.${ANNOTATION_CLASS}`)
      .forEach((el) => el.remove());

    const map = ANNOTATIONS[persona];
    const created: HTMLElement[] = [];

    for (const [sectionId, text] of Object.entries(map)) {
      const section = document.getElementById(sectionId);
      const heading = section?.querySelector("h2, h1");
      if (!heading) continue;
      const note = document.createElement("span");
      note.className = `${ANNOTATION_CLASS} ts-label-sm`;
      note.setAttribute("data-persona-note", "");
      note.textContent = text;
      heading.insertAdjacentElement("afterend", note);
      created.push(note);
    }

    return () => {
      created.forEach((el) => el.remove());
    };
  }, [persona]);

  return { persona, setPersona };
}
