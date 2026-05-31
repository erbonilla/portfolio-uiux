import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Card } from "@/components/data/card/Card";
import { Badge } from "@/components/feedback/badge/Badge";
import { caseStudies } from "@/content/caseStudies";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/**
 * Selected work. Cards reflow with view mode: teaser collapses to one line
 * (`.tile-teaser-line`) and role rows hide (`.tile-roles`) in Quick Scan.
 */
export function CaseStudiesSection() {
  return (
    <section id="work" className={s.section}>
      <div className="container">
        <div className={s.head}>
          <p className={cn(s.eyebrow, "ts-label-md")}>Selected work</p>
          <h2 className={cn(s.heading, "ts-display-section")}>Case studies</h2>
          <p className={cn(s.lead, "ts-body-lg")}>
            Two product stories showing accessibility, interface structure, and
            visual-system decisions across health and endurance.
          </p>
        </div>

        <div className={s.workStack}>
          {caseStudies.map((cs) => (
            <Card
              key={cs.slug}
              as="article"
              variant="interactive"
              className={cn(s.workCard, s.workTile)}
            >
              <div className={s.workBody}>
                <div className={s.tagRow}>
                  <Badge tone={cs.statusTone}>{cs.status}</Badge>
                  <Badge tone="neutral">{cs.domain}</Badge>
                </div>
                <div className={s.workHeading}>
                  <p className={cn(s.workDomain, "ts-label-sm")}>{cs.brand}</p>
                  <h3 className={cn(s.workTitle, "ts-title-lg")}>
                    <Link href={cs.href} className={s.stretched}>
                      {cs.title}
                    </Link>
                  </h3>
                </div>
                <p className={cn(s.workTeaser, "ts-body-lg", "tile-teaser-line")}>
                  {cs.teaser}
                </p>
                <p className={cn(s.workRoles, "ts-caption-sm", "tile-roles")}>
                  Role · {cs.roles.join(" · ")}
                </p>
                <div className={s.tagRow}>
                  {cs.tags.map((tag) => (
                    <Badge key={tag} tone="neutral" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className={cn(s.workCta, "ts-label-md")} aria-hidden="true">
                  Read case study <ArrowUpRight size={16} />
                </span>
              </div>
              <div className={s.workMedia}>
                <Image
                  src={cs.image.src}
                  alt={cs.image.alt}
                  width={cs.image.width}
                  height={cs.image.height}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </Card>
          ))}

          {/* Upcoming work surface, no dead link. */}
          <div className={s.workComingSoon} role="presentation">
            <span className={s.comingSoonIcon} aria-hidden="true">
              <Plus size={18} />
            </span>
            <p className={cn(s.comingSoonLabel, "ts-label-md")}>
              Next case study in progress
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
