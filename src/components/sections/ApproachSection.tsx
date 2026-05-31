import { approach } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/** Approach — how the work gets made. */
export function ApproachSection() {
  return (
    <section id="approach" className={cn(s.section, s.brandBand)}>
      <div className="container">
        <div className={s.head}>
          <p className={cn(s.eyebrow, "ts-label-md")}>Approach</p>
          <h2 className={cn(s.heading, "ts-display-section")}>
            How the work gets made
          </h2>
        </div>

        <ol className={s.approachRail}>
          {approach.map((step) => (
            <li key={step.id} className={s.stepItem}>
              <span className={cn(s.stepIndex, "ts-label-md")}>
                {step.index}
              </span>
              <h3 className={cn(s.stepTitle, "ts-title-md")}>{step.title}</h3>
              <p className={cn(s.stepDesc, "ts-body-sm")}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
