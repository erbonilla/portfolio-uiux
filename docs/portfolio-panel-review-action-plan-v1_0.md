# (ed)studio — Portfolio Panel Review & Action Plan v1.0

**Project:** `(ed)studio` — UI/UX portfolio of Edgar Bonilla G.
**Reviewed build:** `feat/portfolio-build-phase2-12` @ `3c23ecd` (2026-05-31)
**Reviewers (one voice):** Senior UX Portfolio Reviewer · Product Design Lead · UX Research Synthesizer · Senior Visual/UI Designer
**Method:** Source read (`src/**`, `src/content/**`), live DOM inspection at `localhost:3000`, doc cross-check.

---

## 1. Executive verdict

> **You have built an exceptional *frame* and under-filled it with *content*.**

The engineering, design-system, and accessibility foundation is genuinely top-decile for a personal portfolio: token layer, WCAG 2.2 AA gate with axe e2e, PWA, a real component kit, and a standout **Recruiter Hub** signature interaction. That work is done and it shows craft.

But a recruiter or hiring manager landing here today meets **two self-initiated concept case studies, both of which are stubs** ("Full case-study narrative is in progress"), **no working social/LinkedIn links**, **no résumé**, and a **mailto-only contact path**. The thing a portfolio exists to do — prove you can *think through and ship product design* — is the part that is least complete.

The good news: the hard, slow infrastructure is finished. What remains is mostly **content and credibility**, which is faster to add and where the next hour of effort returns the most.

### Scorecard

| Dimension | Score | One-line |
|---|:--:|---|
| Engineering & tech foundation | **9/10** | Next 16 / React 19 / tokens / PWA / a11y gate — excellent. |
| Accessibility | **8/10** | AA gate + axe e2e; watch heavy all-caps & focus proof in prod. |
| Visual / UI craft | **7/10** | Strong system; over-reliance on uppercase; needs real product screens. |
| UX / IA / navigation | **7/10** | Clear flow; Recruiter Hub is a real differentiator. |
| **Content depth & storytelling** | **3/10** | **Two stub case studies, no process, no outcomes — the core gap.** |
| **Credibility & proof** | **4/10** | Concepts only; no LinkedIn, résumé, testimonials, or shipped work. |
| Conversion / recruiter-readiness | **5/10** | mailto-only; no CV download; dead-end on socials. |

---

## 2. Findings by lens

### 2.1 Senior UX Portfolio Reviewer — *"Does this get him hired?"*

- **Case-study depth is the #1 blocker.** `src/app/work/[slug]/page.tsx` renders title + badge + hero image + one teaser paragraph + a role list + "Full case-study narrative is in progress." There is no problem framing, no research, no IA/flow artifacts, no before/after, no decisions-and-tradeoffs, no result. Recruiters skim the homepage but *hire on the case study*. Right now there is nothing to read.
- **Only two projects, both self-initiated concepts** ("Concept · Solo · 2026" / "Built · Solo · 2026" in `src/content/caseStudies.ts`). Honest and fine as a foundation, but it reads as *early-career / pre-shipped*. There is no client, team, or production work to anchor credibility.
- **No résumé / CV download** anywhere in the shell. This is the single most-requested artifact for a job search and it's missing.
- **The "Next case study in progress" card** is honest but signals an unfinished portfolio on first impression. Acceptable for one slot, not as the dominant impression.

### 2.2 Product Design Lead — *"Does the work show product thinking?"*

- **Copy is metric-free *by design*** (`caseStudies.ts` comment: "no invented outcomes"). The honesty discipline is admirable and rare — keep it. But "no fake metrics" must not become "no outcomes at all." You can tell impact *qualitatively and truthfully*: the decision you made, who it served, what changed, what you'd do next. Right now even the qualitative arc is missing from the detail pages.
- **The Range section is focus-areas, not artifacts** (`src/content/rangeProjects.ts`) — six titled cards ("Typography poster series", "Brand motion stills") with descriptions but, as far as the model shows, **no images**. Breadth claims without visual proof read as aspirational. Either show the artifacts or reframe as a short "also works in" line.
- **Recruiter Hub is a genuine product-thinking signal.** The view-mode reflow (Quick Scan ↔ Deep Dive), live tokenizer, persona filter, and system audit demonstrate systems thinking better than most case studies could. **Lean into it** — but make sure every panel's claim is backed (the audit count must equal its rows; the toggle must truly reflow — both already called out in CLAUDE.md honesty rules).

### 2.3 UX Research Synthesizer — *"Is the user's journey complete and evidenced?"*

- **Audience is stated, not evidenced.** Hero says "accessible health, wellness, fitness, sports, lifestyle." Strong positioning — but there is no research artifact anywhere (no persona, no problem statement, no journey) that shows *how* you arrive at design decisions. For a UX role this is the discipline recruiters most want to see and it's the most absent.
- **Dead-end journeys.** The footer renders **zero** social links because `src/content/socials.ts` keeps all three as `href: 'TODO'` (filtered by `visibleSocials`). The no-dead-links rule is respected, but the *consequence* is a recruiter who wants to verify you on LinkedIn hits nothing. LinkedIn is not optional for a job search.
- **Contact has no closure.** `ContactSection` composes a `mailto:` and hands off to the OS mail client. There's no success state, no confirmation, no fallback if the user has no configured mail client, and no way for *you* to know a message was attempted. The journey ends in ambiguity.

### 2.4 Senior Visual / UI Designer — *"Is the craft consistent and legible?"*

- **All-caps is doing too much work.** `text-transform: uppercase` is applied across nav, eyebrows, hero disciplines, badges, case-study titles, range titles, story panel, tool strip — confirmed in the live DOM (headings and body-ish labels alike render uppercased). Uppercase at display size is a strong brand move; uppercase on *running/secondary* text hurts scannability and reading speed. Audit where it earns its place vs. where it's noise.
- **Real product screens are thin.** The case-study images are composite mockups; the portfolio leans on type and color for impact. That works for the brand band but a *UI/UX* portfolio is ultimately judged on showing actual interfaces — flows, states, components in context.
- **The system itself is strong.** Dark glass canonical, brand-orange hero band (black text ≈ 6.4:1 on `#FF4F18` — passes AA), Syne display, semantic tokens, radius modes. The visual language is coherent and distinctive. The gap is *applied* craft (real screens), not *system* craft.

### 2.5 Cross-cutting engineering notes

- **Not yet deployed or committed.** Work lives uncommitted on `feat/portfolio-build-phase2-12`; only Phase 12 (Vercel) remains (owner action).
- **Dev-time runtime error observed:** `Internal Next.js error: Router action dispatched before initialization.` seen in the dev console on reload. Likely a Turbopack-dev transient, **but verify it does not appear in a production `next build --webpack` + `start`** before deploy.
- **Open blockers (by design, using fallbacks):** B1 social URLs, B2 final app-icon export, B3 contact endpoint, B4 case-study destinations. These are documented — they now need *resolution*, not just fallbacks, to ship a credible v1.

---

## 3. Prioritized action plan

Effort: **S** ≤2h · **M** ½–1 day · **L** multi-day. Owner: **E** = Edgar (content/decisions) · **D** = dev/build.

### P0 — Ship-blockers for a *credible* launch (do before sending the link to anyone)

| # | Action | Why | Effort | Owner |
|---|---|---|:--:|:--:|
| P0-1 | **Write one full case study end-to-end** (Osteóplus first): context → user & problem → constraints → key decisions & tradeoffs → interface walkthrough with real screens → honest outcome / "what I'd do next". Replace the stub in `work/[slug]`. | The portfolio's core job is currently empty. One deep study beats two stubs. | L | E + D |
| P0-2 | **Provide the real LinkedIn URL** (min.) and wire `socials.ts`; un-stub the footer. Add Facebook/Instagram only if real. | A job-search portfolio with no LinkedIn is a dead end (B1). | S | E |
| P0-3 | **Add a résumé/CV** — a "Download résumé (PDF)" action in header or About, served from `public/`. | Most-requested recruiter artifact; currently absent. | S | E + D |
| P0-4 | **Confirm the contact path closes the loop.** Either (a) add an on-submit success/empty-mail-client fallback message, or (b) upgrade B3 to a real endpoint (Formspree/Resend/Vercel fn) with a confirmation state. | mailto-only ends in ambiguity and is unverifiable. | S–M | E + D |
| P0-5 | **Verify the prod build is clean:** `pnpm build && pnpm start`, confirm the "Router action dispatched before initialization" error does **not** occur in production, then run `pnpm test:e2e` against prod. | Don't ship a console error you've only seen in dev. | S | D |

### P1 — Credibility & depth (the next week)

| # | Action | Why | Effort | Owner |
|---|---|---|:--:|:--:|
| P1-1 | **Bring the second case study (Atlan) to full depth** matching P0-1's structure. | Two strong studies is the minimum to read as "a designer with range." | L | E + D |
| P1-2 | **Add one research artifact per case study** — a persona, a problem statement, or a journey map. Truthful, even if lightweight. | The single most-wanted UX-role signal; currently absent. | M | E |
| P1-3 | **Give the Range section real images** or reframe it as a one-line "also works across" statement. | Breadth claims need visual proof, or they read as aspirational. | M | E |
| P1-4 | **Replace B2 placeholder app icons** with the final wordmark export; verify maskable/apple-touch at install. | PWA install impression; current icons are derived placeholders. | S | E + D |
| P1-5 | **Add a lightweight outcome line to each study** — qualitative, honest, no invented numbers (e.g. "reduced the booking flow from 6 taps to 2"). | Keeps the honesty rule while still telling impact. | S | E |

### P2 — Polish & differentiation (post-launch)

| # | Action | Why | Effort | Owner |
|---|---|---|:--:|:--:|
| P2-1 | **All-caps audit.** Keep uppercase for display/eyebrows/nav; revert running and secondary text (story panel, long descriptions) to sentence case for readability. | Scannability and reading speed; reduce all-caps fatigue. | M | D |
| P2-2 | **Add SEO/share polish** — per-page OG images for each case study (you already generate `/og/home.png`), JSON-LD `Person`/`CreativeWork`, sitemap. | Discoverability and link-preview credibility. | M | D |
| P2-3 | **Add a testimonial / recommendation** (even one LinkedIn quote with attribution). | Third-party proof is disproportionately persuasive. | S | E |
| P2-4 | **Add subtle analytics** (privacy-respecting, e.g. Vercel Analytics) to learn which sections recruiters reach. | Currently flying blind on engagement. | S | D |
| P2-5 | **Recruiter Hub honesty pass** — re-verify the audit count equals its rows and every toggle truly reflows, then *feature* the Hub more prominently (it's your strongest differentiator and easy to miss). | Protects the signature interaction's credibility and visibility. | S | D |
| P2-6 | **Deploy to Vercel** (Phase 12), connect a custom domain, commit the branch. | The portfolio can't be shared until it's live. | S | E + D |

---

## 4. The one-paragraph "if you only do three things"

1. **Write one complete case study with real screens and honest reasoning** (P0-1) — this is 80% of a portfolio's value and currently 0% present.
2. **Wire your real LinkedIn and add a résumé** (P0-2, P0-3) — remove the two dead-ends a recruiter hits.
3. **Close the contact loop and ship to Vercel** (P0-4, P2-6) — make it reachable and make replies possible.

Everything else is already built to a high standard. Fill the frame.

---

## 5. What's genuinely strong (keep / protect)

- The token-driven design system and component kit — coherent, semantic, themeable.
- WCAG 2.2 AA discipline with an automated axe gate in e2e.
- The **Recruiter Hub** view-mode reflow — a real, demonstrable product-thinking artifact most portfolios don't attempt.
- The **honesty stance** (no fake metrics, no dead links, accurate tech strip). Rare and worth keeping — just don't let it leave the case studies empty.
- The PWA / offline / installable polish.

---

*Generated as a panel review deliverable. Treat §3 as a working backlog; re-score after P0 lands.*
