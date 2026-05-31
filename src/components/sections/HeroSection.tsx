import Image from "next/image";
import { ButtonLink } from "@/components/actions/button/ButtonLink";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

const disciplines = ["Health products", "Design systems", "Accessible UI"];

/** Hero — name, positioning, CTAs, domain meta, portrait (impl §1.1). */
export function HeroSection() {
  return (
    <section id="top" className={cn(s.section, s.hero)}>
      <div className="container">
        <div className={s.heroGrid}>
          <div className={s.heroContent}>
            <p className={cn(s.heroGreeting, "ts-body-lg")}>
              Hey, I&rsquo;m Edgar, a
            </p>
            <h1 className={cn(s.heroTitle, "ts-display-hero")}>
              <span>Product</span>
              <strong>UI UX</strong>
            </h1>
            <p className={cn(s.lead, s.heroLead, "ts-body-lg")}>
              {aboutCopy.positioning}
            </p>
            <ul className={s.heroDisciplines} aria-label="Creative services">
              {disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
            <div className={s.heroCtas}>
              <ButtonLink href="#work" variant="primary" size="lg">
                View case studies
              </ButtonLink>
              <ButtonLink href="#contact" variant="secondary" size="lg">
                Get in touch
              </ButtonLink>
            </div>
            <p className={cn(s.heroMeta, "ts-label-md")}>
              Based in Costa Rica · Open to roles · Spanish and English
            </p>
          </div>

          <div className={s.heroPortrait}>
            <Image
              src="/assets/hero-photo.jpg"
              alt="Portrait of Edgar Bonilla G."
              width={864}
              height={1184}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
