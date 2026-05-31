import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import { Brand } from "./Brand";
import { LinkedInGlyph } from "./LinkedInGlyph";
import { navItems } from "@/content/navItems";
import { visibleSocials } from "@/content/socials";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import styles from "./SiteFooter.module.css";

// LinkedIn is self-hosted (Simple Icons dropped the mark); FB/IG via Simple Icons.
const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <LinkedInGlyph size={22} />,
  facebook: <SiFacebook size={22} aria-hidden="true" />,
  instagram: <SiInstagram size={22} aria-hidden="true" />,
};

/**
 * Site footer. Social row renders ONLY entries with a real URL (B1) — no dead
 * links. Icons are monochrome (currentColor → --text-muted, hover brand).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root}>
      <div className={cn(styles.inner, "container")}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Brand />
            <p className={cn(styles.tagline, "ts-body-sm")}>
              {aboutCopy.positioning}
            </p>
          </div>

          <nav aria-label="Footer" className={styles.nav}>
            <ul className={cn(styles.navList, "ts-label-md")}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={cn(styles.copyright, "ts-caption-sm")}>
            © {year} {aboutCopy.name}. Built with Next.js.
          </p>

          {visibleSocials.length > 0 ? (
            <ul className={styles.socials} aria-label="Social links">
              {visibleSocials.map((social) => {
                const icon = socialIcons[social.id];
                if (!icon) return null;
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      className={styles.social}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {icon}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
