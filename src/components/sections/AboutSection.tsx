import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/** About — positioning + short bio. */
export function AboutSection() {
  return (
    <section id="about" className={s.section}>
      <div className="container">
        <div className={s.aboutPanel}>
          <div className={s.head}>
            <p className={cn(s.eyebrow, "ts-label-md")}>About</p>
            <h2 className={cn(s.heading, "ts-display-section")}>
              Product design for high-pressure, everyday use.
            </h2>
          </div>
          <div className={s.aboutBody}>
            <p className="ts-body-lg">{aboutCopy.about}</p>
            <p className="ts-body-lg">{aboutCopy.body}</p>
            <p className="ts-body-lg">
              <strong>{aboutCopy.evidence}</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
