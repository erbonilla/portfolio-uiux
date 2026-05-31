import { cn } from "@/lib/cn";
import styles from "./Brand.module.css";

/** The `(ed)studio` wordmark, rendered as theme-aware text (brand-led). */
export function Brand({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      className={cn(styles.brand, "ts-title-md", className)}
      aria-label="(ed)studio, Edgar Bonilla G., home"
    >
      <span className={styles.ed} aria-hidden="true">
        (ed)
      </span>
      <span className={styles.studio} aria-hidden="true">
        studio
      </span>
    </a>
  );
}
