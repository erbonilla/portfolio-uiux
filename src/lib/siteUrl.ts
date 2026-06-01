/**
 * Canonical production origin — the single source of truth for absolute URLs
 * (metadataBase, OG/Twitter images, sitemap, robots, JSON-LD).
 *
 * Override with NEXT_PUBLIC_SITE_URL in the Vercel project once a custom domain
 * is live. The fallback MUST be a domain that actually serves this app, or
 * og:image/twitter:image resolve to a 404 and link-share previews break.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-uiux-smoky.vercel.app";
