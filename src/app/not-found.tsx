import { ButtonLink } from "@/components/actions/button/ButtonLink";

export default function NotFound() {
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
        404
      </p>
      <h1 className="ts-display-section" style={{ color: "var(--color-neutral-50)" }}>
        Page not found
      </h1>
      <p className="ts-body-lg" style={{ color: "var(--text-muted)", maxWidth: "48ch" }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <ButtonLink href="/" variant="primary" size="lg">
        Back to home
      </ButtonLink>
    </div>
  );
}
