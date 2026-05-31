# Portfolio Hiring-Conversion Action Plan

**Project:** `(ed)studio` portfolio, Edgar Bonilla G.  
**Date:** 2026-05-31  
**Primary goal:** turn the launch-ready portfolio into a faster hiring-conversion surface.  
**Strategy:** hybrid case-study summaries in the portfolio, full narratives on standalone case-study sites.

## Executive Review

### Senior UX Portfolio Reviewer

The portfolio already feels distinctive and intentional: the orange first viewport, portrait, Recruiter Hub, and system language create a memorable read. The main conversion gap was evidence depth. Hiring readers need the proof path to be obvious in under 30 seconds: summary first, full case study second, contact third.

The two standalone case studies solve the depth problem. The portfolio should not duplicate them wholesale. It should summarize the strongest proof, then route readers to the full studies with clear labels.

### Product Design Lead

The strongest product-design signal is decision quality: Osteóplus has the Medical Repository to Action Dashboard pivot, and Atlan has the schedule-disruption-as-default premise. Those decisions should be surfaced before visual polish, because they show judgment under constraint.

The homepage should keep the bold brand treatment, but the case-study cards and internal pages need to make the design logic inspectable: problem, audience, key decision, trade-off, proof artifact, and evidence boundary.

### UX Research Synthesizer

Both case studies are strongest when they are transparent about research limits. Osteóplus frames Carmen as an AI-assisted synthesized archetype, not a real patient transcript. Atlan frames The Optimizer as synthesis, not ethnography. That honesty is an advantage and should remain visible in the portfolio.

The action plan should protect against invented metrics. Use measurement strategies, hypotheses, validation targets, and guardrails where launched-user outcomes do not exist.

### Senior Visual / UI Designer

The visual identity has a strong point of view and should be preserved. The portfolio does not need a new aesthetic. It needs sharper hierarchy, clearer proof links, and small accessibility refinements: better screen-reader names, clear external-link labels, and focused recruiter scan paths.

The case-study summary pages should feel like portfolio-native editorial surfaces, not stripped-down placeholders. They need enough structure to reward scanning while still pushing deep reading to the standalone studies.

## Priority Backlog

### P0: Conversion-Critical

- Replace `/work/osteoplus` and `/work/atlan` stubs with compact internal recruiter summaries.
- Add links from each summary page to the full standalone case study:
  - Osteóplus: <https://case-study-osteoplus.vercel.app/>
  - Atlan: <https://case-study-atlan.vercel.app/>
- Keep homepage cards routed to internal summaries, with a secondary "Full case study" link to the standalone page.
- Fix accessible naming issues:
  - H1 should read as "Product UI/UX designer", not `ProductUI UX`.
  - Wordmark link should expose one clean accessible name, not duplicated visible and hidden text.
- Keep evidence honest:
  - No invented metrics.
  - Label concept work and validation plans clearly.
  - Keep pre-launch outcome language framed as measurement strategy or hypothesis.
- Resolve launch trust blockers when owner input is available: real social URLs, final app icons, deploy state, and contact endpoint decision.

### P1: Hiring Scan Strength

- Tighten homepage recruiter scan:
  - Name Edgar fully in the first viewport.
  - Show domains with concrete labels: health and rehab PWAs, endurance coaching, design systems.
  - Make the case-study section explain that summaries lead to full evidence.
- Add stronger proof snippets to case-study cards:
  - Osteóplus: Medical Repository to Action Dashboard, guest-first booking, Daily Rehab Loop, 60+ accessibility, WCAG 2.2 AA.
  - Atlan: offline-first bilingual PWA, executive endurance athlete, Wet Mode, adaptive session logic, honesty and disclosure.
- Improve Graphic and Digital sections with clearer item context: contribution, status, and artifact type.
- Use the Recruiter Hub as a decision aid by tying checklist items to visible proof on the page.

### P2: Polish and Trust

- Generate final OG images for the portfolio and case-study summary routes.
- Add final social links only when real URLs are available.
- Review motion pacing after content changes, especially first viewport and card hover states.
- Re-run responsive QA from 320px through 1440px.
- Consider a light analytics layer after launch, privacy-conscious and documented.

## 30-Day Execution Plan

### Week 1: Case-Study Summary Architecture

- Extend the case-study content model with summary fields:
  - full case-study URL
  - live product or deck URL where applicable
  - audience
  - problem
  - key decision
  - proof artifacts
  - accessibility and system notes
  - outcome framing
  - honesty note
- Rebuild `/work/osteoplus` and `/work/atlan` as compact recruiter summaries.
- Update homepage case-study cards to separate internal summary and external full-study actions.

### Week 2: Homepage Hiring Read

- Tighten hero copy for role, domains, availability, and evidence path.
- Fix accessible text output for hero and wordmark.
- Tune case-study section copy so the reader understands the hybrid structure.
- Add short proof language without increasing first-page cognitive load.

### Week 3: Trust Blockers and Metadata

- Add real social links when available; otherwise continue omitting placeholder entries.
- Generate final app icons from the approved wordmark export.
- Add route-specific metadata and OG image strategy.
- Decide whether contact remains `mailto:` for launch or upgrades to Formspree, Resend, or a Vercel function.

### Week 4: QA and Final Review

- Run the full gate:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm test:e2e`
- Manually verify homepage, Recruiter Hub, and internal case-study pages at 375, 768, 1024, and 1440 widths.
- Re-check accessibility for headings, link names, focus states, drawer behavior, reduced motion, and no horizontal overflow.
- Final review should answer: can a hiring reader understand fit, judgment, evidence, and contact path in one pass?

## Acceptance Checklist

- [ ] `/work/osteoplus` has a recruiter summary, not a placeholder.
- [ ] `/work/atlan` has a recruiter summary, not a placeholder.
- [ ] Each internal case-study page links to its full standalone case study.
- [ ] External case-study links clearly communicate that they open a full case study.
- [ ] Homepage cards keep internal summaries as the primary path.
- [ ] Homepage cards include secondary full-case-study links.
- [ ] Hero H1 has a clean accessible name: "Product UI/UX designer".
- [ ] Wordmark link has one accessible name.
- [ ] No `href="#"` links exist.
- [ ] No placeholder social URLs render.
- [ ] No invented outcomes, metrics, or unsupported user quotes are added.
- [ ] Case-study pages describe evidence boundaries clearly.
- [ ] Responsive checks pass at 375, 768, 1024, and 1440 widths.
- [ ] Keyboard navigation reaches all primary case-study actions.
- [ ] Recruiter Hub still opens, closes, traps focus, returns focus, and reflows view mode.
- [ ] Full validation gate passes before launch.

## Canonical Case-Study Sources

- Osteóplus full case study: <https://case-study-osteoplus.vercel.app/>
- Osteóplus live product: <https://osteoplus-v2-9.vercel.app/es>
- Atlan full case study: <https://case-study-atlan.vercel.app/>
- Atlan deck: <https://case-study-atlan.vercel.app/Atlan%20Deck.html>
