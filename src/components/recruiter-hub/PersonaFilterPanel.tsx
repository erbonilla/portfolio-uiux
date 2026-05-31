"use client";

import { Check } from "lucide-react";
import { usePersonaAnnotations, personas } from "./usePersonaAnnotations";
import { cn } from "@/lib/cn";
import s from "./hub.module.css";

/**
 * Panel 02 — Persona filter. Single-select listbox that applies real
 * DOM-text annotations to the relevant sections (hub §4).
 */
export function PersonaFilterPanel() {
  const { persona, setPersona } = usePersonaAnnotations();

  return (
    <section className={s.panel} aria-labelledby="hub-persona-title">
      <div className={s.panelHead}>
        <h3 id="hub-persona-title" className={cn(s.panelTitle, "ts-title-sm")}>
          02 · Reader notes
        </h3>
        <p className={cn(s.panelHelp, "ts-body-sm")}>
          Add notes for a hiring manager, design lead, or recruiter beside
          relevant sections.
        </p>
      </div>

      <ul role="listbox" aria-label="Reader note audience" className={s.choices}>
        {personas.map((p) => {
          const selected = persona === p.id;
          return (
            <li key={p.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(s.choice, "ts-label-md")}
                onClick={() => setPersona(p.id)}
              >
                {selected ? <Check aria-hidden="true" size={16} /> : null}
                {p.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
