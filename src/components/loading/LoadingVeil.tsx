import styles from "./LoadingVeil.module.css";
import type { VeilState } from "./LoadingTransitionProvider";

export function LoadingVeil({
  state,
  label = "Loading",
}: {
  state: VeilState;
  label?: string;
}) {
  const visualLabel = label.toUpperCase();

  return (
    <div
      className={styles.root}
      data-loading-veil
      data-state={state}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.inner}>
        <span className={styles.mark} aria-hidden="true">
          <span className={styles.markSquare} />
          <span className={styles.markSquare} />
          <span className={styles.markSquare} />
          <span className={styles.markSquare} />
        </span>
        <span className={styles.labelMask} aria-hidden="true">
          <span className={styles.labelRoll}>
            <span>{visualLabel}</span>
            <span>{visualLabel}</span>
          </span>
        </span>
      </div>
    </div>
  );
}
