# Recruiter Hub — Spec Addendum v2.0

**Owner:** Edgar Bonilla G. · `(ed)studio`
**Date:** May 29, 2026
**Supersedes:** `portfolio-recruiter-hub-spec-v1_4.md`
**Stack:** Next.js (App Router) + Radix Dialog
**Key change:** Panel 01 (Adaptable view mode) is now **launch scope** and must reflow the page; emojis replaced with icons.

## 1. Purpose

A persistent `RECRUITER HUD` trigger opens a `HIRING MANAGER HUB` drawer that lets a recruiter operate the portfolio. v2.0 promotes the view-mode panel from optional to required, because the project now wants users to switch between modes at launch.

## 2. Honesty rules (unchanged, still central)

- Audit panel reflects real state or is a dated static snapshot.
- Live tokenizer mutates real CSS variables (`:root[data-radius]`).
- No invented metrics.
- Audit count, rows, and progress bar must agree (the v1.6 `4/8` vs four-pass-one-TODO mismatch must be fixed).
- **New:** the view-mode control must actually reflow the page. A toggle that only swaps its own label is the same inflated-claim failure the audit rule guards against.

## 3. Panel 01 — Adaptable view mode (LAUNCH SCOPE)

> **Section copy:** "01 · Adaptable view mode — Optimize the page layout for the user's available time."

### 3.1 Control
Two-option segmented control with radiogroup semantics:

| Option | Icon | Label | Note |
|---|---|---|---|
| Quick Scan | Lucide `Zap` | `30s Quick Scan` | replaces `⚡` |
| Deep Dive | Lucide `Search` | `5m Deep Dive` | replaces `🔍` |

**Emoji replacement is required.** Use `lucide-react` components, sized to match the label cap-height, `aria-hidden="true"` (the text label is the accessible name). Active option uses `--surface-bg-brand`/selected styling; tokens `--radius-control-md`, label type.

### 3.2 Effect (must be real)
Active mode sets `data-view-mode` on `<main>` and is shared via React context:

| Surface | `quick` | `deep` |
|---|---|---|
| Tile teaser | one line | full |
| Story long-form | hidden | shown |
| Tile body | headline + status chip + CTA | + role rows + evidence |
| Range card description | hidden | shown |

CSS-driven (`[data-view-mode="quick"] …`) so it's cheap and reduced-motion safe. Default `deep` (full portfolio is the baseline).

### 3.3 Accessibility
Radiogroup; arrow-key navigation; active mode announced via `aria-live="polite"`; icons decorative; visible focus on each option.

```ts
type ViewMode = 'quick' | 'deep';
// useViewMode(): { mode, setMode }
```

## 4. Panels 02–05 (unchanged from v1.4)

- **02 Persona filter** — real DOM-text annotations per persona; single-select listbox; default unannotated.
- **03 Live tokenizer** — `DEFAULT / ROUNDED / BRUTALIST SHARP`; mutates `:root[data-radius]`; monospace live-region readout.
- **04 System audit** — PASS/TODO/FAIL by text + color; progress bar with `aria-valuenow/min/max`; wired or dated snapshot; **count must match rows**.
- **05 Booking** — date/time/session-type + `SCHEDULE SESSION`; until wired, opens `mailto:erbonilla@outlook.com`; visible labels.

## 5. Trigger, drawer, motion

`RECRUITER HUD` pill (`--radius-pill`, `--border-brand`, `--text-brand`, leading live dot). Radix Dialog styled as right-side drawer: focus trap, inert background, ESC, scrim click, focus return to trigger. Open motion slide+fade `--dur-layout` / `--ease-expressive`; reduced-motion → instant + scrim fade only. Z-index: trigger `--z-overlay` (400), drawer `--z-modal` (500).

## 6. Component file map

```txt
src/components/overlays/RecruiterHubDrawer.tsx        ('use client')
src/components/recruiter-hub/
  RecruiterHubTrigger.tsx
  ViewModePanel.tsx          (Panel 01 — Zap / Search icons, real reflow)
  PersonaFilterPanel.tsx
  LiveTokenizerPanel.tsx
  SystemAuditPanel.tsx
  BookingPanel.tsx
  useViewMode.ts
  usePersonaAnnotations.ts
  useLiveTokens.ts
```

## 7. Accessibility checklist

- [ ] Drawer traps focus; ESC closes; focus returns to trigger.
- [ ] View-mode radiogroup keyboard-operable; active mode announced; icons `aria-hidden`.
- [ ] View-mode change reflows real content.
- [ ] Tokenizer + audit readouts polite live regions.
- [ ] Audit status by text, not color alone; count matches rows.
- [ ] Persona annotations real DOM text.
- [ ] Scheduler fields have visible associated labels.
- [ ] Entire Hub operable under reduced motion.

## 8. Changelog

| Version | Date | Change |
|---|---|---|
| `v1.3` | 2026-05 | Initial five-panel addendum. |
| `v1.4` | 2026-05-29 | Reconciled to v1.6 HTML + Vite target; Radix implementation; audit count-mismatch fix. |
| `v2.0` | 2026-05-29 | Next.js target. Panel 01 promoted to launch scope with required real page reflow. Emojis (`⚡`/`🔍`) replaced with Lucide `Zap`/`Search`. `data-view-mode` contract specified. |
