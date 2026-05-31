import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "@/components/actions/link/Link";
import { cn } from "@/lib/cn";
import s from "./resume.module.css";

const PDF_HREF = "/edgar-bonilla-resume.pdf";

export const metadata: Metadata = {
  title: "Résumé | Edgar Bonilla G. — UX/UI Designer",
  description:
    "Résumé of Edgar Bonilla G., UX/UI designer for accessible health, wellness, fitness, and endurance products. Download the PDF or read the web version.",
  openGraph: {
    title: "Edgar Bonilla G. — Résumé",
    description:
      "UX/UI designer for accessible health, wellness, fitness, and endurance products.",
    images: ["/og/home.png"],
  },
};

type Skill = { label: string; value: string };
const skills: Skill[] = [
  {
    label: "UX",
    value:
      "Research synthesis · journey mapping · information architecture · core-flow design · usability-test planning · accessibility-led decisions",
  },
  {
    label: "UI",
    value:
      "Design systems & tokens · responsive interfaces · component libraries · visual / brand systems",
  },
  {
    label: "Accessibility",
    value:
      "WCAG 2.2 AA · token-enforced touch targets & contrast · focus-visible · reduced-motion · screen-reader testing (VoiceOver / TalkBack / NVDA)",
  },
  {
    label: "Tools",
    value:
      "Figma · Adobe Creative Cloud · Next.js / React · CSS design tokens · Radix · Tailwind · shadcn/ui",
  },
  {
    label: "AI workflow",
    value: "Claude / Claude Code · ChatGPT · Gemini · Cursor · GitHub Copilot",
  },
  {
    label: "Languages",
    value: "Spanish (native) · English (bilingual)",
  },
];

type Work = {
  title: string;
  org: string;
  meta: string;
  kind: string;
  desc: string;
  href: string;
  hrefLabel: string;
};
const selectedWork: Work[] = [
  {
    title: "Osteóplus",
    org: "Digital Health / Rehabilitation",
    meta: "End-to-end UX/UI · 2025–present",
    kind: "PWA-first, bilingual rehabilitation product for post-op & chronic-pain patients (optimized for users 60+)",
    desc: "Reframed a content-heavy medical repository into an action-first “Today” recovery dashboard; designed a guest-first 3-step booking flow (no login); built safety-first patterns (Pain Interrupt modal at pain ≥ 7, non-punitive streaks); architected an accessibility-led design system (39 components, 442 variants) with 18px body type, 48–56px touch targets, and 2px focus rings — WCAG 2.2 AA, validated on VoiceOver, TalkBack, and NVDA. Measurement strategy defined and honestly labeled as concept-stage targets.",
    href: "https://case-study-osteoplus.vercel.app/",
    hrefLabel: "case-study-osteoplus.vercel.app",
  },
  {
    title: "Atlan Performance",
    org: "Sports & Endurance Telemetry",
    meta: "End-to-end UX/UI · 2026",
    kind: "Open-water performance interface for endurance swimmers and coaches",
    desc: "Translated cadence and cardiovascular signals into high-contrast pacing views engineered to stay readable under glare, fatigue, and motion; designed a high-legibility “wet mode” theme and an endurance-focused, tokenized design system. Grounded in 25+ years of real swimming and triathlon coaching — domain expertise, not a hypothetical brief.",
    href: "https://case-study-atlan.vercel.app/",
    hrefLabel: "case-study-atlan.vercel.app",
  },
];

type Role = { title: string; org: string; date: string; desc: string };
const experience: Role[] = [
  {
    title: "Technical Support Specialist",
    org: "Kyndryl",
    date: "Sep 2021 – Present",
    desc: "Frontline multilingual technical support; user-research input that drives product and service improvement for a diverse clientele.",
  },
  {
    title: "Resolution Specialist / Supervisor (VCS)",
    org: "Amazon",
    date: "Jun 2020 – Jun 2021",
    desc: "Customer-obsession at scale; escalation ownership; surfaced systemic issues and prevention recommendations.",
  },
  {
    title: "Technical Server Support Engineer (ISS)",
    org: "HP",
    date: "Sep 2005 – Mar 2013",
    desc: "Diagnosed complex server systems (ProLiant/Blade; Windows, Linux, VMware) for global IT support — systems-thinking and methodical troubleshooting.",
  },
  {
    title: "Founder, Head Coach & CEO",
    org: "Oxygeno Coaching",
    date: "Oct 2015 – Apr 2020",
    desc: "Built and ran an endurance-coaching practice (sprint → Olympic → 70.3 → Ironman → ultramarathon). The domain expertise behind the sports and fitness work in my portfolio.",
  },
];

/** Native /resume page — dark-glass canonical, content mirrors the ATS PDF. */
export default function ResumePage() {
  return (
    <article className={cn(s.page, "container")}>
      <div className={s.topRow}>
        <Link href="/" variant="muted" className={s.back}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
        <div className={s.actions}>
          <Link href="/resume/es" variant="muted" lang="es" hrefLang="es">
            Español
          </Link>
          <a className={s.download} href={PDF_HREF} download>
            <Download size={16} aria-hidden="true" />
            Download résumé (PDF)
          </a>
        </div>
      </div>

      <header className={s.header}>
        <p className={cn(s.eyebrow, "ts-label-md")}>Résumé</p>
        <h1 className={cn(s.name, "ts-display-section")}>Edgar Bonilla G.</h1>
        <p className={cn(s.role, "ts-title-md")}>
          UX/UI Designer{" "}
          <span className={s.domains}>
            — Accessible Health, Wellness, Fitness &amp; Endurance Products
          </span>
        </p>
        <ul className={cn(s.contact, "ts-body-sm")} aria-label="Contact details">
          <li>Zarcero, Alajuela, Costa Rica</li>
          <li>Remote-ready</li>
          <li>Bilingual ES / EN</li>
          <li>
            <Link href="mailto:erbonilla@outlook.com" variant="brand">
              erbonilla@outlook.com
            </Link>
          </li>
          <li>
            <Link href="https://www.linkedin.com/in/edgarbonillag" variant="brand">
              LinkedIn
            </Link>
          </li>
        </ul>
      </header>

      <section className={s.section} aria-labelledby="resume-summary">
        <h2 id="resume-summary" className={cn(s.heading, "ts-label-md")}>
          Summary
        </h2>
        <p className={cn(s.summary, "ts-body-lg")}>
          UX/UI designer specializing in accessible product interfaces for
          health, wellness, fitness, and endurance audiences. I pair 20+ years of
          frontline technical support with two decades of endurance-sports
          coaching to design for real user constraints — vulnerable post-care
          states, low digital confidence, fatigue, and glare. I own work
          end-to-end: research synthesis, information architecture, design
          systems, accessibility (WCAG 2.2 AA), and high-fidelity UI. Over the
          last two years I&rsquo;ve integrated Gen AI to accelerate research
          collection and first drafts by ~30% — while every decision, iteration,
          trade-off, and final output remains mine, keeping accountable human
          judgment at the center of the craft.
        </p>
      </section>

      <section className={s.section} aria-labelledby="resume-skills">
        <h2 id="resume-skills" className={cn(s.heading, "ts-label-md")}>
          Skills
        </h2>
        <dl className={s.skills}>
          {skills.map((sk) => (
            <div key={sk.label} className={s.skillRow}>
              <dt className={cn(s.skillLabel, "ts-label-sm")}>{sk.label}</dt>
              <dd className={cn(s.skillValue, "ts-body-sm")}>{sk.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={s.section} aria-labelledby="resume-work">
        <h2 id="resume-work" className={cn(s.heading, "ts-label-md")}>
          Selected design work
        </h2>
        <div className={s.entries}>
          {selectedWork.map((w) => (
            <div key={w.title} className={s.entry}>
              <div className={s.entryHead}>
                <p className={cn(s.entryTitle, "ts-title-sm")}>
                  {w.title} <span className={s.org}>— {w.org}</span>
                </p>
                <p className={cn(s.entryDate, "ts-caption-sm")}>{w.meta}</p>
              </div>
              <p className={cn(s.entryKind, "ts-caption-sm")}>{w.kind}</p>
              <p className={cn(s.entryDesc, "ts-body-sm")}>{w.desc}</p>
              <Link href={w.href} variant="brand" className={s.entryLink}>
                {w.hrefLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className={s.section} aria-labelledby="resume-experience">
        <h2 id="resume-experience" className={cn(s.heading, "ts-label-md")}>
          Experience
        </h2>
        <div className={s.entries}>
          {experience.map((r) => (
            <div key={r.org} className={s.entry}>
              <div className={s.entryHead}>
                <p className={cn(s.entryTitle, "ts-title-sm")}>
                  {r.title} <span className={s.org}>— {r.org}</span>
                </p>
                <p className={cn(s.entryDate, "ts-caption-sm")}>{r.date}</p>
              </div>
              <p className={cn(s.entryDesc, "ts-body-sm")}>{r.desc}</p>
            </div>
          ))}
          <p className={cn(s.note, "ts-caption-sm")}>
            Swimming &amp; triathlon coach, various Costa Rican associations · 25+
            years (1991–2020) — the lived expertise powering the endurance and
            wellness UX.
          </p>
        </div>
      </section>

      <section className={s.section} aria-labelledby="resume-education">
        <h2 id="resume-education" className={cn(s.heading, "ts-label-md")}>
          Education &amp; certifications
        </h2>
        <ul className={cn(s.eduList, "ts-body-sm")}>
          <li>
            <strong>Alura Latam</strong> — Artificial Intelligence (2025)
          </li>
          <li>
            <strong>Memorisely</strong> — UX/UI Design &amp; Visual Communication;
            Figma (2025)
          </li>
        </ul>
        <p className={cn(s.note, "ts-caption-sm")}>
          <strong>Certifications:</strong> React (developing with JavaScript) ·
          HTML &amp; CSS · Leveraging AI in Adobe Photoshop &amp; Creative Cloud ·
          Explore Emerging Tech · Photoshop 2024 Essential Training
        </p>
      </section>

      <div className={s.footerCta}>
        <a className={s.download} href={PDF_HREF} download>
          <Download size={16} aria-hidden="true" />
          Download résumé (PDF)
        </a>
      </div>
    </article>
  );
}
