/**
 * Section anchors (`#work`) only resolve against elements on the home page.
 * From any other route (e.g. `/resume`, `/work/[slug]`) prefix with `/` so the
 * link navigates home first and then scrolls to the section, instead of being
 * an inert in-page anchor. On the home page the hash-only form is preserved so
 * existing same-page smooth scrolling is unchanged.
 */
export function resolveSectionHref(href: string, pathname: string): string {
  if (href.startsWith("#") && pathname !== "/") return `/${href}`;
  return href;
}
