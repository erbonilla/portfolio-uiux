# `(ed)studio` — Navbar / Menu System: Technical Analysis & Action Plan v1.0

**Doc:** `edstudio-navbar-menu-analysis-action-plan-v1_0.md` · **Status:** Executable · **Date:** 2026-06-10
**Reviews & supersedes (for execution):** `edstudio-good-fella-navbar-menu-spec.md` (the "source spec")
**Reference:** <https://good-fella.com/> · **Repo:** `erbonilla/portfolio-uiux` · **Branch:** `feature/command-bar-menu`
**Related docs:** hero action plan v1.0 (Phases 5–8 are **partially superseded** — see §5/OD1) · loading-veil plan v1.0 (§12 integration)
**Labels:** Documented / Verified / Measured / Recommended / Expected / Hypothesis / Owner decision.

---

## 1. Deep technical analysis — Good Fella navbar/menu

### 1.1 Structural model (Verified from screenshots + live fetch)

Good Fella's header is **not a navbar — it's a command bar**. Three fixed regions on a full-width grid:

```txt
LOGO ············· MENU == ············· LET'S WORK TOGETHER  [+]
left (identity)    center (command)      right (conversion, persistent)
```

| Property | Closed (Verified, 1918×92 frame) | Open (Verified, 1851×73 frame) |
|---|---|---|
| Background | near-black ≈ `#141314` | charcoal ≈ `#333333` |
| Center command | `MENU` + 2-line glyph | `CLOSE` + `×` |
| Right CTA group | orange ≈`#FD551D`, ~40px tall, ~184px + ~40px square, ~5–6px gap, black text | **unchanged — still present and clickable** |
| Bottom edge | soft | hard black divider |

Two structural conclusions:

1. **The CTA never leaves.** The menu is not an interruption; it is a navigation surface with the conversion action persistently available. This is the signature behavior — and it has a hard architectural consequence (§1.4).
2. **No link list exists in the closed header at all.** Navigation lives exclusively in the overlay. The closed bar carries identity + one command + one conversion.

**Critical SSR finding (Verified 2026-06-10):** Good Fella's pre-hydration HTML contains *only* the loader text — the entire header/nav is client-rendered after hydration. **(ed)studio must not copy this.** Server-render the header and menu markup: SEO, no-JS resilience, and the existing axe/e2e suite all depend on real DOM at load. This is a deliberate, documented divergence from the reference.

### 1.2 Menu overlay anatomy (Verified from screenshots)

Two-column grid under the (still visible) header: left = oversized stacked nav links with a ~32×32px orange square marker on the active item; right = contact block, social links, `WORKING GLOBALLY` eyebrow, and orange-square availability bullets. Measured rhythm on the 1030px frame: ~66–68px horizontal padding, ~84px between link baselines, contact column at ~x648.

**Active/hover ambiguity resolved:** the two supplied frames (Home-active vs About-active with Home still orange, markerless) are best explained as *current-section marker* + *hover color preview* coexisting. The source spec's resolution is correct and kept: marker = `data-active` only; hover/focus = color preview only; the marker never follows hover. Deterministic, and satisfies "status never by color alone."

### 1.3 Interaction & timing model

| Interaction | Behavior | Timing (Hypothesis — inferred feel; tokens below) |
|---|---|---|
| Click `MENU` | overlay enters under header; command morphs to `CLOSE ×`; header surface shifts to charcoal | command swap 100–150ms; overlay 360–600ms expressive; links stagger 40–70ms/item, 500–700ms each; contact column +120ms delay |
| Click `CLOSE` / Escape / link | overlay exits **faster than open**, no stagger | content 220–320ms; overlay 360–420ms |
| Hover link | text → orange preview, no marker move | 100ms |
| Click `WORK TOGETHER` / `+` | orange transition veil; menu (if open) closes **instantly underneath** the veil — never animate the occluded close (veil-plan §1.3 principle) | veil constants |

Vanguard mapping (all Verified in design system): hover `--motion-duration-hover` (100ms) · open/close `--motion-duration-layout` (600ms / `duration/fast` in reduced mode) · easing `--motion-easing-default` / `-expressive` — note both duration and easing semantics **carry reduced-motion mode aliases**, so token-bound animations degrade partially for free; explicit `prefers-reduced-motion` blocks still required for stagger/slide removal.

### 1.4 The architectural consequence of the persistent CTA

If the header (and its CTA) must remain **interactive while the menu is open**, the menu **cannot be a modal dialog with a focus trap** — a trap would imprison focus inside the overlay and dead-zone the CTA, destroying the signature behavior. Per WAI-ARIA, a focus trap belongs to *modal* surfaces only. The faithful translation is a **non-modal, below-header navigation region**:

- trigger carries `aria-expanded` + `aria-controls`;
- Escape closes; selection closes; scroll locks;
- occluded page content (`<main>`, footer) gets the `inert` attribute while open — header stays live;
- DOM order: header → menu region → main, so Tab flows trigger → CTA → `+` → theme → menu links. Coherent without a trap.

This conflicts with the hero plan's Drawer-based menu (its Phases 5–6) — a modal Drawer traps focus and covers the header. **Owner decision OD1** picks the engine; recommendation in §5.

---

## 2. Measured contrast analysis — the charcoal problem (Measured, WCAG 2.x relative-luminance calc, 2026-06-10)

The source spec proposes `color-mix(82% hero, 18% white)` for the open header + overlay. That mix resolves to `#323232`, and it creates a small-text failure the spec doesn't catch:

| Pair | Ratio | Verdict |
|---|---:|---|
| brand-500 `#FF4F18` on mix `#323232` | **3.90:1** | AA **large text only** — fails 4.5:1 normal text |
| brand-500 on GF's actual `#333333` | 3.84:1 | (the reference itself would fail small brand text) |
| brand-500 on `--surface-bg-muted` dark = neutral-800 `#262626` (Verified token) | **4.60:1** | **passes normal text AA** |
| brand-400 `#FF7248` on `#323232` | 4.73:1 | passes — but no semantic *text* token exists for brand-400 |
| white on `#323232` / `#262626` | 12.82:1 / higher | pass |
| `--text-muted` dark (neutral-400 `#A3A3A3`, Verified) on `#262626` | ≥5.0:1 | pass — eyebrows safe |
| brand-500 on closed glass base `#050505` | 6.20:1 | pass any size (Verified, design-system table) |

**Ruling (supersedes source-spec §5.1 row 2):** use **`--surface-bg-muted`** for the open header and menu overlay — a single existing semantic token, no `color-mix`, visually charcoal against the `#050505` stage, and it lifts brand-500 small text to a normal-text AA pass. Consequences:

- Menu links (Syne, ≥48px): brand active/hover text passes on either surface — unaffected.
- `MENU/CLOSE` 12px brand hover: **passes on `#262626`** (4.60:1); would have failed on the spec's mix. Keep the brand hover, on this surface only.
- Marker and availability squares are non-text — 3:1 graphics threshold met everywhere.

---

## 3. Source-spec review — defects & improvements

Direction is right (command bar + full-screen menu; tokens; persistent CTA; marker-not-color-alone). Defects by severity:

| # | Sev | Defect | Fix |
|---|---|---|---|
| N1 | P0 | **§10 `SiteMenu` implements none of §11/§14's behavior**: no Escape handling, no scroll lock, no focus management, no inert background. The requirements are listed but the code ships an `opacity/pointer-events` div. | §4.3 behavior hook; `inert` on `<main>`/footer while open. |
| N2 | P0 | **Closed menu is hidden-but-reachable**: `opacity:0; pointer-events:none` leaves all links in tab order and in the accessibility tree — keyboard users tab into an invisible menu. | `visibility` two-step transition + `inert={!open}` on the region (§4.2). |
| N3 | P0 | **Engine conflict with hero plan** (Drawer `size="full"` modal menu) — two parallel menu systems would ship. | OD1: pick one engine; recommended non-modal command-bar path (§1.4, §5); hero plan Phases 5–6 updated accordingly (doc-set discipline — full supersession, no diff-only state). |
| N4 | P1 | **`inset-top` is not a CSS property** (§10.2 ≥1024px block) — silently invalid; desktop menu would keep the mobile top offset. | `top:` (or `inset-block-start:`). |
| N5 | P1 | **Charcoal mix small-text contrast failure** — §2 above. | `--surface-bg-muted`; drop the `color-mix`. |
| N6 | P1 | **Scroll lock unspecified**: "lock body scroll" with no mechanism; naive `overflow:hidden` causes scrollbar layout shift on desktop. | `html { scrollbar-gutter: stable; }` + `overflow:hidden` on open; restore on close (§4.3). |
| N7 | P1 | **`aria-current="page"` in code contradicts §14's own ruling** (`location` for same-page sections). | `aria-current="location"` for hash items; `page` only for `/work/*` routes. |
| N8 | P2 | **Stagger specified (§4.1) but never implemented** — no delay mechanism in any CSS. | Per-item `--i` custom property → `transition-delay: calc(var(--i) * 50ms)` on open only; delays zeroed on close (close is uniform, Verified-against-model §1.3). |
| N9 | P2 | **`MENU↔CLOSE` swap is a hard conditional render** — §4.1 specifies a 100–150ms morph; conditional mount can't animate, and swapping the icon subtree mid-press can drop focus styling. | Single persistent two-line glyph morphing to × via transforms (§4.4) — cheaper, GF-faithful, focus-stable. |
| N10 | P2 | **Open/close share one duration** — model says close must feel faster. | Close at `calc(var(--motion-duration-layout) * 0.6)` (≈360ms), open at full 600ms. |
| N11 | P2 | Availability bullets invite GF-style scarcity copy ("Only 3 spots left"). | Honesty rule: only true, current statements; "Open to roles" text is the existing **"Available for [TBC]"** open item — Owner content decision OD3, ships as explicit flag if unresolved. |
| N12 | P2 | Menu region z-index `calc(--z-index-sticky - 1)` (=199; sticky=200 Verified) is fine, but nothing prevents page content with `z-index/overlay` (400) bleeding above the menu. | Menu uses `--z-index-overlay` (400) and header gets `--z-index-overlay + 1` scoped while open — or simpler: keep sticky/199 pair and audit that no in-page element exceeds sticky; document the chosen rule. |
| N13 | P2 | `.list` display logic only coherent in compact mode; non-compact mobile with no trigger = no nav. | Acceptable (compact is the only shipped mode) — guard with a dev-time warning when `compact && !menuTrigger`. |

**Kept as-is (correct in source spec):** grid `1fr auto 1fr` header (true center command); 44px targets upgrading GF's ~40px; visible-label trigger as `<button>`; real links for CTA/`+`; marker scale/opacity transition; `clamp()` link sizing; veil only on high-intent actions; no global font changes; `(ed)studio` labels not GF copy; nav items Home/Work/Range/Approach/About/Résumé/Contact.

---

## 4. Corrected architecture (authority for code)

### 4.1 Files

```txt
src/components/layout/
  SiteHeader.tsx        # composition + menu state owner
  SiteMenu.tsx          # non-modal region (server-renderable markup)
  SiteMenu.module.css
  MenuCommand.tsx       # MENU/CLOSE morphing trigger
  MenuCommand.module.css
  SquarePlusLink.tsx    # unchanged from hero plan §4.4 (44×44)
src/components/navigation/top-navigation/   # compact + menuOpen attrs (source spec §7.2 kept)
src/hooks/useMenuController.ts              # N1/N6 behaviors
```

### 4.2 `SiteMenu` visibility & semantics (fixes N2, N4, N7)

```tsx
<div id="site-menu" className={styles.root} data-open={open || undefined}
     inert={open ? undefined : true}>           {/* N2: unreachable when closed */}
```

```css
.root {
  position: fixed;
  inset: calc(var(--nav-h-mobile) + var(--safe-top)) 0 0;
  z-index: calc(var(--z-index-sticky) - 1);
  background-color: var(--surface-bg-muted);     /* N5 — Measured 4.60:1 for brand text */
  opacity: 0; visibility: hidden;                 /* N2 */
  transform: translateY(calc(var(--size-4) * -1));
  transition:
    opacity calc(var(--motion-duration-layout) * 0.6) var(--motion-easing-expressive),
    transform calc(var(--motion-duration-layout) * 0.6) var(--motion-easing-expressive),
    visibility 0s linear calc(var(--motion-duration-layout) * 0.6);  /* hide after exit */
}
@media (min-width: 1024px) {
  .root { top: calc(var(--nav-h) + var(--safe-top)); }  /* N4: valid property */
}
.root[data-open="true"] {
  opacity: 1; visibility: visible; transform: translateY(0);
  transition:
    opacity var(--motion-duration-layout) var(--motion-easing-expressive),
    transform var(--motion-duration-layout) var(--motion-easing-expressive),
    visibility 0s;                                /* N10: open 600ms, close 360ms */
}
```

Links: `aria-current={active ? "location" : undefined}` (N7). Stagger (N8):

```tsx
<li key={item.href} style={{ "--i": index } as React.CSSProperties}>
```
```css
.link { opacity: 0; transform: translateY(var(--size-2)); }
.root[data-open="true"] .link {
  opacity: 1; transform: translateY(0);
  transition: opacity var(--motion-duration-layout) var(--motion-easing-expressive)
              calc(var(--i) * 50ms),
              transform var(--motion-duration-layout) var(--motion-easing-expressive)
              calc(var(--i) * 50ms);
}
/* close: no delays — inherit the uniform .root exit; reduced-motion block kills all of it */
```

### 4.3 `useMenuController` (fixes N1, N6)

```ts
function useMenuController() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";   // N6; gutter stable via global css
    const inertEls = document.querySelectorAll("main, footer");
    inertEls.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      inertEls.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);
  return { open, setOpen };
}
```
Global: `html { scrollbar-gutter: stable; }` (one-line base.css addition). Focus: stays on the trigger (it morphs in place to CLOSE — no focus move needed on open; none to restore on close). Non-modal per §1.4 — no trap, header CTA stays live.

### 4.4 `MenuCommand` morph (fixes N9)

One persistent glyph; no conditional icon mount:

```css
.glyph { position: relative; width: var(--size-4); height: var(--size-3); }
.glyph span {
  position: absolute; left: 0; width: 100%; height: var(--stroke-width-strong);
  background: currentColor;
  transition: transform calc(var(--motion-duration-hover) * 1.5) var(--motion-easing-default);
}
.glyph span:nth-child(1) { top: 0; }
.glyph span:nth-child(2) { bottom: 0; }
.root[data-open] .glyph span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
.root[data-open] .glyph span:nth-child(2) { transform: translateY(-5px) rotate(-45deg); }
```

Label swap `MENU↔CLOSE` may remain a text swap (announced via `aria-expanded`; the label is supplementary). 150ms morph = `hover × 1.5` — inside the spec's 100–150ms window without a new token. Hover color rule: brand on closed glass (6.20:1 ✓); on the open `--surface-bg-muted` header, brand at 12px is 4.60:1 ✓ (Measured) — brand hover allowed in **both** states under the §2 surface ruling.

### 4.5 Header open-state (replaces source-spec §7.3 open block)

```css
.root[data-menu-open="true"] {
  background-color: var(--surface-bg-muted);          /* N5 */
  border-bottom-color: var(--static-black);            /* GF hard divider, token-pure */
  backdrop-filter: none;                                /* solid surface while open */
}
```

Everything else in source-spec §7 (grid, compact, safe-area, 44px links, ≤599px action hiding) stands.

### 4.6 Veil integration (Documented — veil plan)

`Work together` + `+` use `useTransitionClick("#contact")`. If the menu is open when fired: `setOpen(false)` immediately after veil enter — closed instantly while occluded; never play the 360ms exit no one can see.

---

## 5. Engine decision & doc-set reconciliation

**OD1 (Owner decision, blocks Phase 2+):** menu engine.

| Option | Pros | Cons |
|---|---|---|
| **A — Non-modal command-bar menu (this doc; Recommended)** | Faithful: CTA persistently interactive (the GF signature §1.4); below-header surface; no trap needed; server-rendered markup | New behaviors hand-rolled (small, §4.3, fully testable); supersedes hero-plan Phases 5–6 |
| B — Reuse modal Drawer `size="full"` (hero plan) | Zero new behavior code; trap/Escape/scroll already e2e-tested | Focus trap dead-zones the header CTA while open; drawer covers header; loses both signature behaviors |

If A: update the hero action plan — its Phase 5 (Drawer `full`) is dropped, Phase 6 is replaced by Phases 2–3 below, Phases 7–8 (compact nav, `SquarePlusLink`, header wiring) survive intact and are consumed here. Per doc discipline, reissue the hero plan as v1.1 full-version at merge time, not a diff note.

---

## 6. Action plan

Standard gate per phase: `pnpm typecheck && pnpm lint && pnpm test`. Full gate (Phases 5–6): + `pnpm build` + `CI=1 pnpm test:e2e`.
**Sequencing:** requires hero-plan Phases 0–3 + 7 results (tokens, compact `TopNavigation`); coordinates with veil plan at §4.6.

### Phase 0 — Preflight & decisions
- [ ] 0.1 Resolve **OD1** (engine). Plan below assumes A.
- [ ] 0.2 Token check (all Verified in design system; confirm in `tokens.css`): `--z-index-sticky` (200), `--surface-bg-muted` (neutral-800 dark), `--stroke-width-strong` (2px), `--letter-spacing-tighter`, `--font-size-5xl/-7xl` (48/72px), `--radius-control-sm`, `--text-muted`. Sync-v2.0 set (`--nav-h*`, `--blur-glass`, safe-area, `--gutter`) — reuse hero-plan Phase 0 result.
- [ ] 0.3 Add `html { scrollbar-gutter: stable; }` to base layer (N6).
- [ ] 0.4 Confirm `inert` typing in the React version in use (React 19 supports the boolean prop — Expected).
- [ ] 0.5 Branch `feature/command-bar-menu` from the merged hero branch.
- **Gate 0:** decisions logged; tokens confirmed.

### Phase 1 — `MenuCommand`
- [ ] 1.1 Build per source-spec §8 + §4.4 morph (N9); `<button>`, `aria-expanded`, `aria-controls="site-menu"`, 44px min.
- [ ] 1.2 Hover/focus per §2 surface ruling; visible focus ring; reduced-motion kills the morph (state still swaps).
- **Gate 1:** standard; keyboard + SR name/state check. **Commit:** `Add MENU/CLOSE command trigger`

### Phase 2 — `SiteMenu` region (markup + styles)
- [ ] 2.1 Server-renderable two-column markup per source-spec §10.1 with N7 (`aria-current="location"`) and availability copy per **OD3** (flag if TBC).
- [ ] 2.2 Styles per §4.2: `--surface-bg-muted` (N5), visibility two-step (N2), valid `top` override (N4), open 600/close 360 (N10), marker scale/opacity, link clamp, contact column, availability squares, reduced-motion block.
- [ ] 2.3 Stagger per §4.2 (N8); zero delay + no transform under reduced motion.
- **Gate 2:** standard; closed menu unreachable by Tab and invisible to SR (manual check). **Commit:** `Add full-screen command-bar menu surface`

### Phase 3 — Behavior wiring
- [ ] 3.1 `useMenuController` (§4.3): Escape, scroll lock, `inert` on main/footer, cleanup on unmount.
- [ ] 3.2 `SiteHeader`: state owner; `menuOpen` → `TopNavigation data-menu-open` (§4.5 open surface); DOM order header → menu → main (§1.4 tab flow).
- [ ] 3.3 Link click closes menu; `useActiveSection` drives `activeHref`; hash scroll honors `scroll-margin-top: calc(var(--nav-h) + var(--safe-top))` on sections.
- [ ] 3.4 Veil integration (§4.6): instant close under veil.
- **Gate 3:** standard; full keyboard journey: open → Tab through CTA/+ /theme → links → Escape → focus still on trigger. **Commit:** `Wire non-modal menu behavior and header open state`

### Phase 4 — Responsive & content
- [ ] 4.1 Breakpoint table (source-spec §13): 320/375/600/768/1024/1440 — CTA group hides ≤599px; marker never overflows; link clamp verified at 320 with "Approach".
- [ ] 4.2 Contact column: real `mailto:`, Costa Rica / roles / languages lines — all true statements only; no dead links (Verified socials exist if reused here).
- **Gate 4:** no horizontal overflow anywhere; copy honest.

### Phase 5 — Accessibility & automated QA
- [ ] 5.1 e2e: open/close via mouse, keyboard, Escape; `inert` background unreachable; persistent CTA clickable while open; veil fires from open menu; `aria-current="location"` tracks scroll; axe AA dark/light incl. **open-state charcoal surfaces** (the §2 pairs).
- [ ] 5.2 Reduced-motion run: no stagger, no slide, instant state changes.
- [ ] 5.3 200% zoom + 44px target audit.
- **Gate 5:** full gate green; axe clean. **Commit:** `Extend e2e and a11y coverage for command-bar menu`

### Phase 6 — Design QA, docs, ship
- [ ] 6.1 `npx impeccable detect src/`; resolve or justify.
- [ ] 6.2 Reissue hero action plan as v1.1 (Phases 5–6 superseded per OD1) — full document, not a delta.
- [ ] 6.3 Colophon: "Command-bar navigation pattern inspired by good-fella.com; implemented independently on Vanguard tokens; nav server-rendered by design (reference is client-rendered)."
- [ ] 6.4 PR with §2 contrast table, N-defect resolutions, before/after captures; merge → Vercel → production verify (incl. SSR nav in view-source).
- **Gate 6 (DoD):** production verified; doc set reconciled.

---

## 7. Owner decisions

| # | Decision | Recommendation | Blocks |
|---|---|---|---|
| OD1 | Menu engine: non-modal command bar (A) vs modal Drawer reuse (B) | **A** — persistent CTA is the signature; behaviors are small and testable | Phase 1+ |
| OD2 | Open-header divider: `--static-black` hard line (GF-faithful) vs `--border-default` | static-black on dark; falls back to border-default in light theme via a theme guard | 3.2 |
| OD3 | Availability copy (ties to the standing "Available for [TBC]" open item) | Resolve the TBC; until then ship "Open to selected roles and projects" only if true | 2.1 |
| OD4 | Menu z-strategy: sticky/199 pair vs overlay/400+ promotion (N12) | sticky pair + audit; promote only if an in-page element ever exceeds 200 | 2.2 |

## 8. Risks & rollback

| Risk | Sev | Mitigation |
|---|---|---|
| Hand-rolled behaviors regress vs Drawer's tested ones | Med | §4.3 is ~20 lines, unit + e2e covered at Gates 3/5; OD1-B remains the fallback engine |
| `inert` gaps on older browsers | Low | Native in all evergreen targets (Expected); e2e asserts unreachability, not the attribute |
| Two menu systems ship by accident | Med | N3/OD1 + Phase 6.2 doc reissue; hero-plan Drawer `full` work is explicitly dropped |
| Charcoal surfaces silently revert to the color-mix | Low | §2 table in PR; axe open-state runs at Gate 5 |
| Scroll-lock layout shift | Low | `scrollbar-gutter: stable` at Phase 0.3 |

Rollback: branch-isolated; reverting restores the current (hero-plan or live) header/menu exactly.

## 9. Consolidated Definition of Done

- [ ] Command bar: brand left · `MENU/CLOSE` morph center (`<button>`, `aria-expanded/controls`, 44px) · persistent `Work together` + 44×44 `+` right · safe-area · no overflow 320→1440
- [ ] Open state: header + menu on `--surface-bg-muted`; hard divider per OD2; closed dark-glass intact
- [ ] Menu: non-modal below-header region; server-rendered markup; `inert` when closed **and** page `inert` while open; Escape/selection close; scroll locked without layout shift; focus remains on trigger
- [ ] Links: Syne clamp(48–72px), white default; hover/focus brand preview; active = brand text **+** square marker; `aria-current="location"`; stagger 50ms open-only; close 360ms uniform
- [ ] Contrast: all §2 Measured pairs pass on shipped surfaces; brand small text only on `#262626`-class surfaces or darker
- [ ] Contact/availability column: real links, true statements, OD3 resolved or flagged
- [ ] Veil fires from header CTA/+ (menu closes instantly beneath); never from regular menu links
- [ ] Reduced motion: no stagger/slide/morph animation; states instant; all e2e + axe AA (dark/light, open/closed) green; full build gate green
- [ ] Hero plan reissued v1.1; colophon updated; production verified incl. SSR nav

## 10. Effort estimate (Expected — solo; assumes hero branch merged)

| Phase | Est. |
|---|---:|
| 0 Preflight/decisions | 0.25 d |
| 1 MenuCommand | 0.5 d |
| 2 Menu surface | 1 d |
| 3 Behavior wiring | 0.75 d |
| 4 Responsive/content | 0.5 d |
| 5 A11y/e2e | 1 d |
| 6 QA/docs/ship | 0.5 d |
| **Total** | **~4.5 days** |

Estimates are planning aids, not commitments — label remains **Expected**.
