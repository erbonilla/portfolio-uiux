import type * as React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import styles from "./SquarePlusLink.module.css";

export function SquarePlusLink({
  href,
  onClick,
}: {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href={href}
      className={styles.root}
      aria-label="Go to contact"
      onClick={onClick}
    >
      <Plus aria-hidden="true" />
    </Link>
  );
}
