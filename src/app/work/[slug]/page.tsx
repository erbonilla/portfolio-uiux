import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { ButtonLink } from "@/components/actions/button/ButtonLink";
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
    description: cs.summary,
    openGraph: {
      title: cs.title,
      description: cs.summary,
      images: [cs.image.src],
    },
  };
}

/**
 * Case-study detail (Detail-page pattern, §30). Hybrid summary:
 * fast recruiter read here, full standalone case study linked externally.
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
        <p className={cn(s.teaser, "ts-body-lg")}>{cs.summary}</p>
        <div className={s.ctas}>
          <ButtonLink
            href={cs.fullCaseStudyUrl}
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read the full ${cs.brand} case study (opens in a new tab)`}
            iconTrailing={<ArrowUpRight size={18} />}
          >
            Read full case study
          </ButtonLink>
          {cs.liveProductUrl ? (
            <Link
              href={cs.liveProductUrl}
              variant="brand"
              className={s.inlineCta}
            >
              View live product
            </Link>
          ) : null}
          {cs.deckUrl ? (
            <Link href={cs.deckUrl} variant="brand" className={s.inlineCta}>
              View the deck
            </Link>
          ) : null}
        </div>
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
        <div className={s.summaryCard}>
          <h2 className={cn(s.metaHeading, "ts-label-md")}>15-second read</h2>
          <ul className={cn(s.proofList, "ts-body-md")}>
            <li>{cs.problem}</li>
            <li>{cs.keyDecision}</li>
            <li>{cs.outcomeFraming}</li>
          </ul>
        </div>

        <dl className={s.factGrid}>
          <div>
            <dt className="ts-label-sm">Role</dt>
            <dd>{cs.roles.join(" · ")}</dd>
          </div>
          <div>
            <dt className="ts-label-sm">Status</dt>
            <dd>{cs.status}</dd>
          </div>
          <div>
            <dt className="ts-label-sm">Audience</dt>
            <dd>{cs.audience}</dd>
          </div>
        </dl>
      </section>

      <section className={s.detailGrid} aria-label="Case study summary">
        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Problem</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>
            What needed to change
          </h2>
          <p className="ts-body-md">{cs.problem}</p>
        </div>

        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Key decision</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>
            The product move
          </h2>
          <p className="ts-body-md">{cs.keyDecision}</p>
        </div>

        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Proof artifacts</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>What to inspect</h2>
          <ul className={cn(s.proofList, "ts-body-md")}>
            {cs.proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Accessibility & system</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>
            How craft shows up
          </h2>
          <p className="ts-body-md">{cs.a11yNotes}</p>
        </div>

        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Outcome framing</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>
            Evidence boundary
          </h2>
          <p className="ts-body-md">{cs.outcomeFraming}</p>
        </div>

        <div className={s.detailBlock}>
          <p className={cn(s.kicker, "ts-label-sm")}>Honesty note</p>
          <h2 className={cn(s.blockHeading, "ts-title-lg")}>
            What this work is
          </h2>
          <p className="ts-body-md">{cs.honestyNote}</p>
        </div>
      </section>
    </article>
  );
}
