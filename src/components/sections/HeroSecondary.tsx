'use client';

import dynamic from "next/dynamic";
import { ButtonLink } from "@/components/actions/button/ButtonLink";
import { SlidingPlusCta } from "@/components/actions/sliding-plus-cta/SlidingPlusCta";
import { useTransitionClick } from "@/components/loading/useTransitionClick";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

const HeroCylinderGrid = dynamic(
  () => import('./HeroCylinderGrid'),
  { ssr: false },
);

const disciplines = [
  "Health & rehab PWAs",
  "Endurance coaching",
  "Design systems",
];

/** Hero — name, positioning, CTAs, domain meta (impl §1.1). */
export function HeroSecondary() {
  const handleContactTransition = useTransitionClick("#contact");

  return (
    <section id="top" className={cn(s.section, s.hero)}>
      <div className={s.heroCanvas} aria-hidden="true">
        <HeroCylinderGrid />
      </div>
      <div className={s.heroOverlay} aria-hidden="true" />
      <div className="container">
        <div className={s.heroGrid}>
          <div className={s.heroContent}>
            <p className={cn(s.heroKicker, "ts-label-md")}>
              Edgar Bonilla G. · Product UI/UX
            </p>
            <h1 className={cn(s.heroTitle, "ts-display-hero")}>
              <span>Product UI/UX systems.</span>
              <span>Built for pressure.</span>
            </h1>
            <p className={cn(s.lead, s.heroLead, "ts-body-lg")}>
              {aboutCopy.positioning}
            </p>
            <div className={s.heroCtas}>
              <SlidingPlusCta href="#work" label="View Work" size="lg" />
              <ButtonLink
                href="#contact"
                variant="secondary"
                size="lg"
                onClick={handleContactTransition}
              >
                Work together
              </ButtonLink>
            </div>
            <p className={cn(s.heroMeta, "ts-label-md")}>
              Based in Costa Rica · Open to roles · Spanish and English
            </p>
          </div>
        </div>
        <ul className={s.heroDisciplines} aria-label="Portfolio focus areas">
          {disciplines.map((discipline) => (
            <li key={discipline}>{discipline}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
