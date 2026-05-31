import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { Badge } from "@/components/feedback/badge/Badge";
import { Link } from "@/components/actions/link/Link";
import { cn } from "@/lib/cn";
import s from "./work.module.css";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Work not found | (ed)studio" };
  return {
    title: `${cs.title} | ${cs.domain} · (ed)studio`,
    description: cs.teaser,
    openGraph: { title: cs.title, description: cs.teaser, images: [cs.image.src] },
  };
}

/**
 * Case-study detail (Detail-page pattern, §30). Stub for launch (B4):
 * page-header title + status + hero image + teaser. Full narrative is
 * roadmap Phase 2.
 */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <article className={cn(s.page, "container")}>
      <Link href="/" variant="muted" className={s.back}>
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>

      <header className={s.header}>
        <p className={cn(s.eyebrow, "ts-label-md")}>{cs.domain}</p>
        <div className={s.titleRow}>
          <h1 className={cn(s.title, "ts-display-section")}>{cs.title}</h1>
          <Badge tone={cs.statusTone}>{cs.status}</Badge>
        </div>
        <p className={cn(s.teaser, "ts-body-lg")}>{cs.teaser}</p>
      </header>

      <div className={s.media}>
        <Image
          src={cs.image.src}
          alt={cs.image.alt}
          width={cs.image.width}
          height={cs.image.height}
          sizes="(min-width: 1024px) 960px, 100vw"
          priority
        />
      </div>

      <section className={s.meta}>
        <h2 className={cn(s.metaHeading, "ts-label-md")}>Role</h2>
        <ul className={cn(s.roles, "ts-body-md")}>
          {cs.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className={cn(s.note, "ts-caption-sm")}>
          Full case-study narrative is in progress.
        </p>
      </section>
    </article>
  );
}
