import { Card } from "@/components/data/card/Card";
import { Badge } from "@/components/feedback/badge/Badge";
import { rangeProjects } from "@/content/rangeProjects";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

const rangeGroups = [
  {
    id: "graphic",
    eyebrow: "Range · 2024-2026",
    title: "Graphic design",
    projects: rangeProjects.filter((project) => project.category === "graphic"),
  },
  {
    id: "digital",
    eyebrow: "Range · 2024-2026",
    title: "Digital content",
    projects: rangeProjects.filter((project) => project.category === "digital"),
  },
];

/**
 * Range — breadth across domains. Descriptions hide in Quick Scan via
 * `.range-card-desc` (view-mode contract). Grid is fluid 1/2/3-up.
 */
export function RangeSection() {
  return (
    <>
      {rangeGroups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          className={cn(s.section, s.rangeSection)}
        >
          <div className="container">
            <div className={cn(s.head, s.centerHead)}>
              <p className={cn(s.eyebrow, "ts-label-md")}>{group.eyebrow}</p>
              <h2 className={cn(s.heading, "ts-display-section")}>
                {group.title}
              </h2>
            </div>

            <div className={s.autoGrid}>
              {group.projects.map((p) => (
                <Card key={p.id} variant="interactive" className={s.rangeCard}>
                  <div
                    className={s.rangePreview}
                    data-art={p.id}
                    aria-hidden="true"
                  >
                    <span className={s.artifact}>
                      <span className={s.artifactPrimary} />
                      <span className={s.artifactSecondary} />
                      <span className={s.artifactTertiary} />
                    </span>
                  </div>
                  <div className={s.rangeCardBody}>
                    <div className={s.tagRow}>
                      <Badge tone="brand" size="sm">
                        {p.tag}
                      </Badge>
                    </div>
                    <h3 className={cn(s.rangeTitle, "ts-title-md")}>
                      {p.title}
                    </h3>
                    <p
                      className={cn(
                        s.rangeDesc,
                        "ts-body-sm",
                        "range-card-desc",
                      )}
                    >
                      {p.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
