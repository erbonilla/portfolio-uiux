"use client";

import * as React from "react";
import { Drawer } from "@/components/overlays/drawer/Drawer";
import { RecruiterHubTrigger } from "./RecruiterHubTrigger";
import { ViewModePanel } from "./ViewModePanel";
import { PersonaFilterPanel } from "./PersonaFilterPanel";
import { LiveTokenizerPanel } from "./LiveTokenizerPanel";
import { SystemAuditPanel } from "./SystemAuditPanel";
import { BookingPanel } from "./BookingPanel";
import styles from "./RecruiterHub.module.css";

/**
 * The Recruiter Hub (recruiter-hub spec). A persistent trigger pill opens a
 * right-side Radix Dialog drawer with five honest, working panels.
 */
export function RecruiterHub() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      side="right"
      size="md"
      title="Hiring Manager Hub"
      description="Change the reading mode, add reader notes, review launch checks, or request a session."
      trigger={<RecruiterHubTrigger />}
    >
      <div className={styles.panels}>
        <ViewModePanel />
        <hr className={styles.divider} />
        <PersonaFilterPanel />
        <hr className={styles.divider} />
        <LiveTokenizerPanel />
        <hr className={styles.divider} />
        <SystemAuditPanel />
        <hr className={styles.divider} />
        <BookingPanel />
      </div>
    </Drawer>
  );
}
