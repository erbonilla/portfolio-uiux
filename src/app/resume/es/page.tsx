import type { Metadata } from "next";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "@/components/actions/link/Link";
import { cn } from "@/lib/cn";
import s from "../resume.module.css";

const PDF_HREF = "/edgar-bonilla-resume-es.pdf";

export const metadata: Metadata = {
  title: "Currículum | Edgar Bonilla G. — Diseñador UX/UI",
  description:
    "Currículum de Edgar Bonilla G., diseñador UX/UI de productos accesibles de salud, bienestar, fitness y resistencia. Descarga el PDF o léelo en la web.",
  openGraph: {
    title: "Edgar Bonilla G. — Currículum",
    description:
      "Diseñador UX/UI de productos accesibles de salud, bienestar, fitness y resistencia.",
    images: ["/og/home.png"],
  },
};

type Skill = { label: string; value: string };
const skills: Skill[] = [
  {
    label: "UX",
    value:
      "Síntesis de investigación · mapas de experiencia · arquitectura de información · diseño de flujos clave · planificación de pruebas de usabilidad · decisiones guiadas por accesibilidad",
  },
  {
    label: "UI",
    value:
      "Sistemas de diseño y tokens · interfaces responsivas · librerías de componentes · sistemas visuales / de marca",
  },
  {
    label: "Accesibilidad",
    value:
      "WCAG 2.2 AA · áreas táctiles y contraste por tokens · focus-visible · movimiento reducido · pruebas con lectores de pantalla (VoiceOver / TalkBack / NVDA)",
  },
  {
    label: "Herramientas",
    value:
      "Figma · Adobe Creative Cloud · Next.js / React · tokens de diseño CSS · Radix · Tailwind · shadcn/ui",
  },
  {
    label: "Flujo con IA",
    value: "Claude / Claude Code · ChatGPT · Gemini · Cursor · GitHub Copilot",
  },
  {
    label: "Idiomas",
    value: "Español (nativo) · Inglés (bilingüe)",
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
    org: "Salud digital / rehabilitación",
    meta: "UX/UI integral · 2025–presente",
    kind: "Producto bilingüe de rehabilitación (PWA-first) para pacientes posoperatorios y con dolor crónico (optimizado para usuarios de 60+)",
    desc: "Reformulé un repositorio médico cargado de contenido en un panel de recuperación “Hoy” orientado a la acción; diseñé un flujo de reserva en 3 pasos sin registro; construí patrones centrados en la seguridad (modal Pain Interrupt con dolor ≥ 7, rachas no punitivas); definí un sistema de diseño guiado por accesibilidad (39 componentes, 442 variantes) con texto base de 18px, áreas táctiles de 48–56px y anillos de foco de 2px — WCAG 2.2 AA, validado en VoiceOver, TalkBack y NVDA. Estrategia de medición definida y etiquetada honestamente como objetivos en fase de concepto.",
    href: "https://case-study-osteoplus.vercel.app/",
    hrefLabel: "case-study-osteoplus.vercel.app",
  },
  {
    title: "Atlan Performance",
    org: "Telemetría deportiva y de resistencia",
    meta: "UX/UI integral · 2026",
    kind: "Interfaz de rendimiento en aguas abiertas para nadadores de resistencia y entrenadores",
    desc: "Traduje señales de cadencia y cardiovasculares en vistas de ritmo de alto contraste, diseñadas para mantenerse legibles bajo reflejos, fatiga y movimiento; creé un tema “wet mode” de alta legibilidad y un sistema de diseño tokenizado enfocado en resistencia. Basado en más de 25 años de entrenamiento real de natación y triatlón: experiencia de dominio, no un brief hipotético.",
    href: "https://case-study-atlan.vercel.app/",
    hrefLabel: "case-study-atlan.vercel.app",
  },
];

type Role = { title: string; org: string; date: string; desc: string };
const experience: Role[] = [
  {
    title: "Especialista en Soporte Técnico",
    org: "Kyndryl",
    date: "Sep 2021 – Presente",
    desc: "Soporte técnico multilingüe en primera línea; aportes de investigación de usuarios que impulsan la mejora de productos y servicios para una clientela diversa.",
  },
  {
    title: "Especialista en Resolución / Supervisor (VCS)",
    org: "Amazon",
    date: "Jun 2020 – Jun 2021",
    desc: "Obsesión por el cliente a escala; gestión de escalaciones; detección de problemas sistémicos y recomendaciones de prevención.",
  },
  {
    title: "Ingeniero de Soporte de Servidores (ISS)",
    org: "HP",
    date: "Sep 2005 – Mar 2013",
    desc: "Diagnóstico de sistemas de servidores complejos (ProLiant/Blade; Windows, Linux, VMware) para soporte global de TI — pensamiento sistémico y resolución metódica de problemas.",
  },
  {
    title: "Fundador, Head Coach y CEO",
    org: "Oxygeno Coaching",
    date: "Oct 2015 – Abr 2020",
    desc: "Construí y dirigí una práctica de entrenamiento de resistencia (sprint → olímpico → 70.3 → Ironman → ultramaratón). La experiencia de dominio detrás del trabajo deportivo y de fitness de mi portafolio.",
  },
];

/** Página /resume/es — versión en español del currículum (dark-glass). */
export default function ResumePageES() {
  return (
    <article className={cn(s.page, "container")} lang="es">
      <div className={s.topRow}>
        <Link href="/" variant="muted" className={s.back}>
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al inicio
        </Link>
        <div className={s.actions}>
          <Link href="/resume" variant="muted" lang="en" hrefLang="en">
            English
          </Link>
          <a className={s.download} href={PDF_HREF} download>
            <Download size={16} aria-hidden="true" />
            Descargar currículum (PDF)
          </a>
        </div>
      </div>

      <header className={s.header}>
        <p className={cn(s.eyebrow, "ts-label-md")}>Currículum</p>
        <h1 className={cn(s.name, "ts-display-section")}>Edgar Bonilla G.</h1>
        <p className={cn(s.role, "ts-title-md")}>
          Diseñador UX/UI{" "}
          <span className={s.domains}>
            — Productos accesibles de salud, bienestar, fitness y resistencia
          </span>
        </p>
        <ul className={cn(s.contact, "ts-body-sm")} aria-label="Datos de contacto">
          <li>Zarcero, Alajuela, Costa Rica</li>
          <li>Disponible en remoto</li>
          <li>Bilingüe ES / EN</li>
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

      <section className={s.section} aria-labelledby="cv-perfil">
        <h2 id="cv-perfil" className={cn(s.heading, "ts-label-md")}>
          Perfil
        </h2>
        <p className={cn(s.summary, "ts-body-lg")}>
          Diseñador UX/UI especializado en interfaces de producto accesibles para
          audiencias de salud, bienestar, fitness y deportes de resistencia.
          Combino más de 20 años de soporte técnico en primera línea con dos
          décadas de entrenamiento en deportes de resistencia para diseñar
          pensando en restricciones reales de las personas usuarias: estados
          posoperatorios vulnerables, baja confianza digital, fatiga y reflejos.
          Llevo el trabajo de principio a fin: síntesis de investigación,
          arquitectura de información, sistemas de diseño, accesibilidad (WCAG 2.2
          AA) e interfaces de alta fidelidad. En los últimos dos años he integrado
          IA generativa para acelerar la recopilación de investigación y los
          primeros borradores en ~30%, mientras cada decisión, iteración,
          compromiso y entregable final sigue siendo mío, manteniendo el juicio
          humano responsable en el centro del oficio.
        </p>
      </section>

      <section className={s.section} aria-labelledby="cv-habilidades">
        <h2 id="cv-habilidades" className={cn(s.heading, "ts-label-md")}>
          Habilidades
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

      <section className={s.section} aria-labelledby="cv-trabajo">
        <h2 id="cv-trabajo" className={cn(s.heading, "ts-label-md")}>
          Trabajo de diseño seleccionado
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

      <section className={s.section} aria-labelledby="cv-experiencia">
        <h2 id="cv-experiencia" className={cn(s.heading, "ts-label-md")}>
          Experiencia
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
            Entrenador de natación y triatlón en varias asociaciones
            costarricenses · más de 25 años (1991–2020) — la experiencia vivida
            que impulsa la UX de resistencia y bienestar.
          </p>
        </div>
      </section>

      <section className={s.section} aria-labelledby="cv-educacion">
        <h2 id="cv-educacion" className={cn(s.heading, "ts-label-md")}>
          Educación y certificaciones
        </h2>
        <ul className={cn(s.eduList, "ts-body-sm")}>
          <li>
            <strong>Alura Latam</strong> — Inteligencia Artificial (2025)
          </li>
          <li>
            <strong>Memorisely</strong> — Diseño UX/UI y Comunicación Visual;
            Figma (2025)
          </li>
        </ul>
        <p className={cn(s.note, "ts-caption-sm")}>
          <strong>Certificaciones:</strong> React (desarrollo con JavaScript) ·
          HTML y CSS · Uso de IA en Adobe Photoshop y Creative Cloud · Explore
          Emerging Tech · Photoshop 2024 Essential Training
        </p>
      </section>

      <div className={s.footerCta}>
        <a className={s.download} href={PDF_HREF} download>
          <Download size={16} aria-hidden="true" />
          Descargar currículum (PDF)
        </a>
      </div>
    </article>
  );
}
