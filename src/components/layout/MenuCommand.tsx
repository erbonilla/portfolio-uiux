import styles from "./MenuCommand.module.css";

export function MenuCommand({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.root}
      data-open={open || undefined}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onClick}
    >
      <span className={styles.label}>{open ? "Close" : "Menu"}</span>
      <span className={styles.glyph} aria-hidden="true">
        <span />
        <span />
      </span>
    </button>
  );
}
