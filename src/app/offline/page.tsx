import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | (ed)studio",
};

/** Offline fallback served by the service worker when the network is down. */
export default function Offline() {
  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-stack-lg)",
        alignItems: "flex-start",
        paddingBlock: "var(--space-section-lg)",
        minHeight: "60dvh",
        justifyContent: "center",
      }}
    >
      <p className="ts-label-md" style={{ color: "var(--text-brand)" }}>
        Offline
      </p>
      <h1 className="ts-display-section" style={{ color: "var(--color-neutral-50)" }}>
        You&rsquo;re offline
      </h1>
      <p className="ts-body-lg" style={{ color: "var(--text-muted)", maxWidth: "48ch" }}>
        This page isn&rsquo;t available without a connection. Reconnect and try
        again.
      </p>
    </div>
  );
}
