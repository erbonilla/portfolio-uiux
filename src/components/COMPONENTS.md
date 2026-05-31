# Component library — launch subset

Vanguard design-system components built for launch (action plan Phase 5). All
are **Beta** (§36) until full QA. Every component consumes **semantic tokens
only** (no raw hex/numbers, no component-specific tokens — §39) and styles
variants/states via `data-*` attributes + CSS (handoff §33). Typography comes
from the global `.ts-*` local text styles (§25).

| Component | Path | Batch | Key props | A11y notes |
|---|---|---|---|---|
| Button | `actions/button` | A | `variant` (primary/secondary/tertiary/ghost/danger), `size`, `loading`, `iconLeading`, `iconTrailing` | `aria-busy` on loading; icon-only → use IconButton; one primary per group |
| Icon Button | `actions/icon-button` | A | `ariaLabel` (required), `variant`, `size`, `icon` | Requires accessible name; visible focus ring |
| Link | `actions/link` | A | `href`, `variant` (default/muted/brand/inverse), `external` | External → `target=_blank rel=noopener noreferrer` + "opens in new tab"; internal via next/link |
| Badge | `feedback/badge` | C | `tone`, `size`, `icon` | Status by text/icon, never color alone |
| Progress Bar | `feedback/progress-bar` | C | `value`, `max`, `tone`, `label`, `showValue` | Radix exposes `aria-valuenow/min/max`; determinate |
| Form Field | `forms/form-field` | B | `label`, `helperText`, `error`, `success`, `required`; render-prop wires `id`/`aria-describedby`/`invalid` | Label programmatically associated; error `role="alert"` |
| Card | `data/card` | F | `variant` (flat/raised/glass/interactive), `selected`, `as` | Interactive cards wrap a real link/button (own role + keyboard) |
| Drawer | `overlays/drawer` | E | `open`, `onOpenChange`, `side`, `size`, `title`, `description`, `footer` | Radix Dialog: focus trap, ESC, scrim, focus return; reduced-motion safe |
| Top Navigation | `navigation/top-navigation` | D | `brand`, `items`, `actions`, `menuTrigger`, `variant`, `activeHref` | nav landmark; `aria-current="page"`; collapses to menu trigger |

**Deferred** (maturity phase): the rest of Batches A–F + the 10 non-launch
patterns. The token layer (Phase 3) is already complete, so they drop in
without retokenizing.
