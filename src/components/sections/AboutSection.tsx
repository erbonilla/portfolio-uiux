import { ArrowUpRight, Download } from "lucide-react";
import { ButtonLink } from "@/components/actions/button/ButtonLink";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/** About — positioning + short bio + résumé entry point. */
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
            <p className={cn("ts-body-sm", s.colophon)}>
              <em>Colophon: {aboutCopy.colophon}</em>
            </p>
          </div>
          <div className={s.aboutCta}>
            <ButtonLink
              href="/resume"
              variant="secondary"
              size="md"
              iconTrailing={<ArrowUpRight size={16} />}
            >
              View résumé
            </ButtonLink>
            <a
              className={s.aboutDownloadLink}
              href="/edgar-bonilla-resume.pdf"
              download
            >
              <Download size={16} aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
