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
    subtitle: "Brand, type, and editorial explorations — supporting range, not standalone case studies.",
    projects: rangeProjects.filter((project) => project.category === "graphic"),
  },
  {
    id: "digital",
    eyebrow: "Range · 2024-2026",
    title: "Digital content",
    subtitle: "Launch, social, and content-design pieces produced around the product work.",
    projects: rangeProjects.filter((project) => project.category === "digital"),
  },
];

/**
 * Range — breadth across domains, framed honestly as supporting focus areas
 * (not clickable case studies, no placeholder thumbnails). Descriptions hide in
 * Quick Scan via `.range-card-desc` (view-mode contract). Grid is fluid 1/2/3-up.
 */
export function RangeSection() {
  return (
    <div id="range">
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
              <p className={cn(s.rangeSubtitle, "ts-body-md", "range-card-desc")}>
                {group.subtitle}
              </p>
            </div>

            <ul className={s.autoGrid}>
              {group.projects.map((p) => (
                <li key={p.id}>
                  <Card variant="flat" className={s.rangeCard}>
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
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
