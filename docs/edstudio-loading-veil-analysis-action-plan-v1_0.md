# `(ed)studio` — Loading / Contact Transition Veil: Technical Analysis & Action Plan v1.0

**Doc:** `edstudio-loading-veil-analysis-action-plan-v1_0.md` · **Status:** Executable · **Date:** 2026-06-10
**Reviews & supersedes (for execution):** `edstudio-good-fella-loading-transition-spec.md` (the "source spec")
**Reference:** <https://good-fella.com/> · **Repo:** `erbonilla/portfolio-uiux` · **Branch:** `feature/loading-transition-veil`
**Framework:** phased, checklist-driven, gate-per-phase, evidence-labelled (Documented / Verified / Recommended / Expected / Hypothesis / Owner decision).

---

## 1. Deep technical analysis of the Good Fella loader

### 1.1 New forensic finding (Verified 2026-06-10)

A live fetch of `good-fella.com` pre-hydration HTML returns the loader label **duplicated**: `LOADINGLOADING`. This single data point resolves two of the source spec's open hypotheses:

1. **The veil is server-rendered visible.** The loader exists in static HTML before any JavaScript runs — there is **no flash of page content** followed by an orange takeover. The page boots *inside* the veil. This is the most important behavior to replicate and the one the source spec gets structurally wrong (see Defect D3).
2. **The label uses a duplicate-text roll, not a clip-only fade.** Two stacked copies of `LOADING` inside an `overflow: hidden` line box, translated vertically (or horizontally) in a loop, exactly produces the cropped `LOADIN` frame in the screenshot — one glyph mid-entry at the mask edge. The spec's `::after`-cover + `steps(7)` approach approximates the *look* but not the mechanism, and has a visible loop-snap (Defect D8).

What remains **Hypothesis** (private JS bundle not inspected; behavioral inspiration only, no code copied): exact timeline values, easing curves, and library (site tagline "websites that move" + frame pacing is consistent with a GSAP-class timeline, but unconfirmed and irrelevant — the (ed)studio build stays CSS-only per source spec §11).

### 1.2 Mechanism model (Verified where marked)

| Layer | Mechanism | Evidence |
|---|---|---|
| Veil surface | Fixed full-viewport solid-orange layer, top z-stack, occludes page | Verified (screenshot + SSR HTML) |
| No-flash boot | Veil present in server HTML; JS only schedules the **exit** | Verified (`LOADINGLOADING` pre-hydration) |
| Label | Duplicate-text roll inside overflow-hidden mask | Verified-by-inference (duplicated SSR text + cropped frame) |
| Mark | Two-slab skewed mark, small alternating oscillation | Hypothesis (visual) |
| Exit | Panel wipe (transform), destination already settled behind veil | Hypothesis (feel); see §1.3 |
| CTA reuse | "LET'S WORK TOGETHER" and `+` re-enter the same veil before the contact state | Documented (source spec observation) |

### 1.3 The core trick worth stealing (Recommended)

The veil's real job is **hiding the seam**. While the screen is fully occluded, the destination change (scroll, route, state) happens **instantly** — no smooth scrolling, no visible layout work. When the veil exits, the destination is already settled. This:

- eliminates the "exit reveals a still-scrolling page" race;
- makes `behavior: "smooth"` pointless *and* harmful under the veil (invisible animation burning main-thread time — Defect D5);
- is automatically reduced-motion-friendly for the scroll itself.

**Rule:** under the veil, jump (`behavior: "auto"`); never animate what no one can see.

### 1.4 Performance characteristics

- A solid-color fixed layer animated by `transform` is fully compositor-driven. The source spec animates `clip-path` + `opacity` (D11): `clip-path` animation triggers paint on several engines. On a flat-color layer the cost is small, but `transform: translateY` panel wipe is strictly cheaper, matches the Good Fella panel feel, and needs no `will-change`. **Recommendation: transform wipe as the primary enter/exit primitive; keep opacity as the reduced-motion fallback.**
- **Measured trade-off to disclose, not mask:** an initial veil delays the user-perceived first paint and will likely shift LCP later by roughly the veil's visible duration (Expected ~+0.7–1.4s as spec'd). Lighthouse perf will drop. Per the honesty rule this is a deliberate brand-moment cost, recorded in the PR — never described as "loading."

---

## 2. Source-spec review — defects & improvements

The spec's direction is right (transition veil, not fake loader; Vanguard tokens; black-on-orange). The defects below are ordered by severity. **P0 = ships broken, P1 = a11y/perf/correctness risk, P2 = polish.**

| # | Sev | Defect (spec ref) | Fix |
|---|---|---|---|
| D1 | P0 | **Untracked timers / race conditions** in `useLoadingTransition` (§6.1): `goToHash` and the enter→hold step use raw `window.setTimeout` outside `timeoutRef`; `hide()` overwrites the failsafe without clearing it. Rapid double-click on `Work together` → overlapping timers → veil hides mid-enter or a stale failsafe from click #1 kills veil #2. | Reducer-driven state machine; **all** timers in one registry cleared at the start of every transition and on unmount (§4.2). |
| D2 | P0 | **Provider + wrappers referenced but never defined**: `LoadingTransitionProvider`, `useLoadingTransitionContext` (§7.1), `TransitionButtonLink`, `TransitionSquarePlusLink` (§9.2) have no implementation. Spec is not buildable as written. | Define provider (§4.1). Replace the two wrapper components with a single `useTransitionClick(href)` hook spread onto the **existing** `ButtonLink`/`SquarePlusLink` — zero new button-like components, Button semantics untouched (§4.3). |
| D3 | P0 | **Initial veil flashes content** (§6.2): `setState("holding")` inside `useEffect` runs *after* first client paint → frame(s) of page, then orange takeover. Looks like a bug. Good Fella SSRs the veil visible (Verified §1.1). | Render veil in server HTML, default-visible via CSS when initial-veil is enabled; client JS only schedules exit (§4.4). `if (state==="hidden") return null` is replaced by always-mounted + `data-state` so SSR works. |
| D4 | P1 | **E2E suite will break**: 30 existing Playwright tests will click through a pointer-blocking veil at boot and after CTA clicks. Unaddressed in spec. | Tests wait for `[data-state="hidden"]` via shared helper; CI emulates `prefers-reduced-motion` where the veil short-circuits (§4.6, Phase 5). |
| D5 | P1 | **`scrollIntoView({behavior:"smooth"})` under an opaque veil** (§6.1): invisible animation; exit can reveal a page still scrolling; conflicts with reduced motion. | Instant jump under the veil (§1.3). |
| D6 | P1 | **`document.querySelector(hash)` throws** on selector-invalid hashes. | `document.getElementById(hash.slice(1))`. |
| D7 | P1 | **No already-there guard**: clicking `Work together` while `#contact` is in view still plays a ~1s veil — pure friction for the highest-intent action. | If target section is substantially in viewport (or hash already matches), skip the veil; move focus to the heading only. |
| D8 | P2 | **Label loop-snap**: `steps(7)` cover snaps back at 100%→0%; also approximates rather than reproduces the observed mechanism. | Duplicate-label roll (two stacked `LOADING` spans, container `translateY` loop in an overflow-hidden mask) — matches the Verified SSR evidence and loops seamlessly (§4.5). |
| D9 | P2 | **`label` prop ignored** (§5.1): component hardcodes `LOADING`; and visible text inside `role="status"` + `aria-label` risks double announcement. | Render `{label}`; mark the *visual* roll `aria-hidden="true"`; keep one SR-visible string via `aria-label`. Announce once — repeated "Loading" on every CTA click is noise. |
| D10 | P2 | **Reduced-motion initial veil still costs 700ms+** of blank brand screen with all animation stripped. | Under `prefers-reduced-motion: reduce`: **skip the initial veil entirely**; CTA veil degrades to a ≤200ms opacity dip or none (Owner decision OD3). Note: Vanguard motion tokens already alias to `duration/instant` / `easing/reduced` in the reduced mode (Verified, design-system §motion) — bind durations to tokens where possible so part of this comes free. |
| D11 | P2 | **`clip-path` enter/exit** (§5.2): paint-heavy vs. transform; see §1.4. | `transform: translateY` panel wipe primary; opacity fallback. |
| D12 | P2 | **Stale `tabindex` mutation** (§6.1) left on the heading after focus. | Author `tabIndex={-1}` on the contact heading in JSX; no DOM mutation. |
| D13 | P2 | **Veil-every-session**: Good Fella replays per load; for a recruiter-scanning portfolio, replaying on every back/forward is friction. | `sessionStorage` once-per-session gate for the *initial* veil (Owner decision OD2). |
| D14 | P2 | **Hardcoded CSS durations** (220/420ms literals) while TS constants duplicate them. | Single source: two sync-delta tokens `--motion-duration-veil-enter: 220ms`, `--motion-duration-veil-exit: 420ms` (motion tokens may be code-only per token rule 8, but CSS consumes them too — a custom property is the cleanest shared source). Documented as sync-v2.0-style deltas with doc citation. |

**What the spec already gets right (keep as-is):** veil ≠ spinner framing; Vanguard ember `#FF4F18` instead of sampled `#FB460D` (Verified token); black-on-orange contrast (`--text-on-brand`, 6.38:1 Verified; white-on-orange 3.29:1 correctly rejected); `--font-family-code` (JetBrains Mono, Verified) scoped to loader/technical labels only — **no global button typography change**; `--radius-control-md` (no new radius tokens); generic two-slab mark (no Good Fella identity copied); modified-click guard; failsafe timeout; high-intent-only triggering; 44px targets.

---

## 3. Token, color & font verification (Verified 2026-06-10 against `portfolio-premium-uiux-design-system.md`)

| Use | Token | Verified value/alias |
|---|---|---|
| Veil surface | `--surface-bg-brand` | brand/500 `#FF4F18` |
| Veil text/mark | `--static-black` / `--text-on-brand` | black; 6.38:1 on brand — pass |
| CTA fill / hover | `--surface-control-brand` / `-hover` | brand/500; hover brand/600 light · brand/400 dark |
| Focus ring | `--state-focus-ring` | brand/500 |
| Z-stack | `--z-index-toast` | `700` — highest semantic; no new z token needed |
| Micro-gap / mark geometry | `--size-0-5`, `--size-3`, `--size-4`, `--space-stack-2xs` | 2px base micro-gap; stack/2xs → size/0-5 |
| Label type | `--font-family-code`, `--font-size-xs` (12px), `--letter-spacing-wider` (1.2px) | all present |
| Motion | `--motion-easing-default/-expressive`, durations | present **with reduced-motion mode aliases** (`duration/instant`, `easing/reduced`) |
| Page behind CTA | `--surface-bg-hero` | **Documented (sync v2.0), still not re-verified** — covered by hero plan Phase 0; reuse that result |
| Safe-area paddings | `--safe-top/right/bottom/left` | Documented (sync v2.0) — same preflight |
| New deltas (D14) | `--motion-duration-veil-enter/-exit` | **To add** — 220ms / 420ms, cited as veil-spec deltas |

Font ruling (unchanged from spec, confirmed correct): loader label + scoped header CTA/MENU labels = `--font-family-code`; oversized menu links = `--font-family-heading` (Syne); `ButtonLink` global typography untouched.

---

## 4. Corrected architecture (authority for code in Phases 1–4)

### 4.1 Files & provider

```txt
src/components/loading/
  LoadingVeil.tsx            # presentational; always mounted; data-state driven
  LoadingVeil.module.css
  LoadingTransitionProvider.tsx  # context: { state, goToHref }
  useTransitionClick.ts      # onClick factory for existing links/buttons
```

Provider wraps the shell (in `ClientShell` if `app/layout.tsx` stays a Server Component); `<LoadingVeil />` renders last inside it.

### 4.2 State machine & timers (fixes D1)

```ts
type VeilState = "hidden" | "entering" | "holding" | "exiting";
// Reducer transitions: hidden→entering→holding→exiting→hidden.
// One timers ref: Set<number>. schedule(fn, ms) adds; clearAllTimers() on every
// new transition start and on unmount. Failsafe (1600ms) registered like any
// other timer — cleared by the next action, never orphaned.
```

Constants (single source, exposed as the D14 custom properties):
`ENTER 220 · MIN_HOLD 420 · EXIT 420 · INITIAL_MIN 700 · INITIAL_MAX 1400 · FAILSAFE 1600` (Documented, source spec §12 — values kept; only their plumbing fixed).

### 4.3 `useTransitionClick` (fixes D2 — no new button components)

```ts
function useTransitionClick(href: string) {
  const { goToHref } = useLoadingTransitionContext();
  return (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (href.startsWith("#")) { e.preventDefault(); goToHref(href); }
  };
}
// Usage — existing components, zero churn:
// <ButtonLink href="#contact" onClick={useTransitionClick("#contact")} …>
// <SquarePlusLink href="#contact" onClick={useTransitionClick("#contact")} />
```

`goToHref` internals: `getElementById` (D6) → already-in-view guard skips veil (D7) → enter → **instant** scroll + `history.pushState` + focus contact heading (`tabIndex={-1}` authored in JSX, D12) while occluded (D5) → hold → exit.

### 4.4 SSR-visible initial veil (fixes D3)

- `LoadingVeil` always mounted; visibility = `data-state` only.
- When initial veil enabled **and** not yet shown this session (D13/OD2): server renders `data-state="holding"`; a guard class on `<html>`/body CSS keeps it visible pre-hydration; client effect races `Promise.all([min 700ms, document.fonts.ready])` vs `1400ms` cap, then exits. JS never *shows* the initial veil — it only hides it. Failsafe still applies if hydration stalls.
- Reduced motion: initial veil short-circuits to hidden (D10/OD3).

### 4.5 Label roll (fixes D8/D9, matches Verified mechanism)

```html
<span class="labelMask" aria-hidden="true">
  <span class="labelRoll"><span>LOADING</span><span>LOADING</span></span>
</span>
<!-- root carries role="status" aria-label="Loading" — single SR announcement -->
```

```css
.labelMask { overflow: hidden; display: inline-block; line-height: var(--line-height-xs); }
.labelRoll { display: flex; flex-direction: column;
  animation: veil-label-roll 1400ms var(--motion-easing-expressive) infinite; }
@keyframes veil-label-roll { 0%, 30% { transform: translateY(0); }
  70%, 100% { transform: translateY(-50%); } } /* seamless: copy 2 ≡ copy 1 */
```

Enter/exit (D11): panel wipe `transform: translateY(-100%) → 0 → 100%` on the root, durations via the D14 tokens; reduced-motion falls back to short opacity or none.

### 4.6 Test strategy (fixes D4)

- `data-state` is the public test contract. Shared Playwright helper `awaitVeilHidden(page)` used in global `beforeEach`.
- Reduced-motion-emulating axe runs get the short-circuit path for free.
- New specs: veil on CTA click; skip-when-in-view; modified-click bypass; failsafe; focus lands on contact heading; once-per-session initial gate.

---

## 5. Action plan

Standard gate per phase: `pnpm typecheck && pnpm lint && pnpm test`. Full gate (Phases 5–6): + `pnpm build` + `CI=1 pnpm test:e2e`.
**Sequencing note:** if the Good Fella hero branch (`feature/good-fella-inspired-hero`) is in flight, land it first — this branch wires onto its header/hero CTAs and `SquarePlusLink`. Otherwise wire onto current CTAs; the hook is composition-only either way.

### Phase 0 — Preflight (no code)
- [ ] 0.1 Reuse hero-plan Phase 0 results for sync-v2.0 tokens (`--surface-bg-hero`, safe-area). If not yet run, run that check now.
- [ ] 0.2 Verify §3 core tokens resolve in `tokens.css` (Expected — all Verified in design system).
- [ ] 0.3 Add D14 deltas `--motion-duration-veil-enter/-exit` with comment citing this doc.
- [ ] 0.4 Confirm `ButtonLink` and `SquarePlusLink` accept/forward `onClick` (Expected; smallest additive change if not).
- [ ] 0.5 Confirm contact section heading exists and can carry `tabIndex={-1}`.
- **Gate 0:** all resolved; preflight note drafted for PR.

### Phase 1 — Veil component (presentational only)
- [ ] 1.1 `git checkout -b feature/loading-transition-veil` (from updated `main`).
- [ ] 1.2 Build `LoadingVeil` + CSS per §4.4–§4.5: always-mounted, `data-state`, brand surface, black mark + roll label, `--z-index-toast`, safe-area padding, transform wipe, reduced-motion block.
- [ ] 1.3 Storybook-style manual harness or unit test cycling the four states.
- **Gate 1:** standard gate; visual check of all states at 320/1440, both themes (veil is theme-invariant: brand + static black — confirm). **Commit:** `Add Vanguard loading veil component`

### Phase 2 — Provider, state machine, transition hook
- [ ] 2.1 Implement reducer + single timer registry per §4.2 (D1).
- [ ] 2.2 `goToHref`: getElementById, in-view guard, instant scroll under veil, pushState, heading focus (D5–D7, D12).
- [ ] 2.3 `useTransitionClick` per §4.3 (D2); unit-test modified-click and in-view bypasses, failsafe, rapid double-click.
- **Gate 2:** standard gate; deterministic unit tests for the race cases. **Commit:** `Add loading transition state machine and click hook`

### Phase 3 — Initial page veil (SSR, no flash)
- [ ] 3.1 SSR-visible initial state per §4.4 (D3); sessionStorage once-per-session gate behind OD2.
- [ ] 3.2 Fonts-ready race with 1400ms cap; failsafe; reduced-motion skip (OD3).
- [ ] 3.3 Verify zero flash with throttled CPU/network in DevTools; verify back/forward behavior.
- [ ] 3.4 Record Lighthouse before/after — disclose LCP delta in PR (honesty rule; Expected regression ~veil duration).
- **Gate 3:** no-flash confirmed; metrics recorded. **Commit:** `Add server-rendered initial page veil`

### Phase 4 — CTA wiring
- [ ] 4.1 Header `Work together` + `+`: spread `useTransitionClick("#contact")` onto existing components.
- [ ] 4.2 Hero `Work together` (secondary) likewise. `View work` stays untouched (low-intent rule, source spec §7.2).
- [ ] 4.3 Scoped `.workTogether` mono styling (source spec §8.1) on header CTA only — **no global Button changes**; square plus hover lift stays behind `no-preference`.
- [ ] 4.4 Contact heading gets `tabIndex={-1}` in JSX.
- **Gate 4:** standard gate; manual click-through incl. keyboard activation (Enter/Space on link). **Commit:** `Wire contact CTAs to transition veil`

### Phase 5 — Accessibility, performance, e2e
- [ ] 5.1 e2e helper `awaitVeilHidden`; update existing 30 specs' boot path (D4); add §4.6 new specs.
- [ ] 5.2 Axe dark/light incl. veil states; `role="status"` announced once; no focus trap; focus rings intact.
- [ ] 5.3 Reduced-motion run: initial veil skipped; CTA path per OD3; scroll instant.
- [ ] 5.4 Perf check: enter/exit composited (DevTools layers); no layout thrash; hydration not delayed.
- **Gate 5:** full gate green; axe clean. **Commit:** `Extend e2e and a11y coverage for transition veil`

### Phase 6 — QA, PR, ship
- [ ] 6.1 Run source-spec §13 QA checklist + this doc's D-fix verifications.
- [ ] 6.2 `npx impeccable detect src/`; resolve or justify.
- [ ] 6.3 Colophon entry (Recommended, not blocking — no third-party code enters): "Loading/transition veil pattern inspired by good-fella.com; implemented independently in CSS/React on Vanguard tokens." Fits the disclosure signature.
- [ ] 6.4 PR with: §1.1 evidence note, D-table resolution status, Lighthouse delta, OD resolutions, before/after capture. Merge → Vercel → verify production: no flash, CTA veil, skip-when-in-view, reduced-motion skip, PWA still installable.
- **Gate 6 (DoD):** production verified; docs updated (full-version doc discipline — this doc supersedes the source spec for execution).

---

## 6. Owner decisions

| # | Decision | Recommendation | Blocks |
|---|---|---|---|
| OD1 | Ship the **initial** page veil at all, vs CTA-only (Lighthouse/LCP cost, §1.4) | Ship, capped at 700–1400ms, once per session | Phase 3 |
| OD2 | Initial veil frequency | Once per session (`sessionStorage`) — recruiter-scan friendly; Good Fella replays per load | 3.1 |
| OD3 | Reduced-motion CTA veil | Skip entirely (cleanest) over ≤200ms opacity dip | 3.2 / 5.3 |
| OD4 | Veil label text | `LOADING` (reference-faithful) vs `(ed)studio` wordmark text | 1.2 |

## 7. Risks & rollback

| Risk | Sev | Mitigation |
|---|---|---|
| e2e suite breakage at boot | High | D4 plan in Phase 5.1 lands **with** Phase 3, not after |
| LCP regression read as perf bug | Med | Disclosed in PR with numbers (Phase 3.4); OD1 escape hatch = CTA-only |
| Hydration stall leaves veil up | Med | Failsafe timer + CSS-only fallback exit at `FAILSAFE_MS` |
| Double-announce / SR noise | Low | D9 fix; verify with VoiceOver/NVDA spot-check |
| Token deltas drift from sync doc | Low | D14 deltas carry doc citations; recorded in design-system sync notes at Phase 6.4 |

Rollback: provider + veil are additive; reverting the branch (or feature-flagging the provider to render children only) restores current behavior exactly.

## 8. Consolidated Definition of Done

- [ ] All P0 defects (D1–D3) and P1 defects (D4–D7) resolved; P2 resolved or justified
- [ ] Veil: `--surface-bg-brand` field, `--static-black` mark/label, `--font-family-code` label, `--z-index-toast`, safe-area padded, transform wipe
- [ ] Initial veil SSR-visible — zero content flash; fonts-ready race; ≤1400ms; once per session (per OD2); failsafe
- [ ] CTA veil on header `Work together` + `+` + hero `Work together` only; instant scroll under veil; skip when in view; modified clicks bypass
- [ ] Focus lands on contact heading; no focus trap; single SR announcement; no `href="#"`; no nested interactive controls; ≥44px targets
- [ ] Reduced motion: initial veil skipped; loops disabled; scroll instant
- [ ] D14 motion-token deltas added with citations; no other new tokens; no raw hex
- [ ] Full gate green: typecheck · lint · unit · build · e2e (updated 30 + new veil specs) · axe AA dark/light
- [ ] Lighthouse delta recorded and disclosed; PWA installable; `theme_color` alignment intact
- [ ] Colophon inspiration note added; PR documents evidence, decisions, metrics

## 9. Effort estimate (Expected — solo)

| Phase | Est. |
|---|---:|
| 0 Preflight | 0.25 d |
| 1 Veil component | 0.5 d |
| 2 State machine + hook | 0.75 d |
| 3 Initial SSR veil | 0.75 d |
| 4 CTA wiring | 0.25 d |
| 5 A11y/perf/e2e | 1 d |
| 6 QA + ship | 0.5 d |
| **Total** | **~4 days** |

Estimates are planning aids, not commitments — label remains **Expected**.
