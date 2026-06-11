# `(ed)studio` Work-Together / Plus CTA Spec — Good Fella–Inspired

**Scope:** Technical analysis of the Good Fella `LET'S WORK TOGETHER` / `+` button pair and Vanguard-compliant implementation guidance for `(ed)studio`.  
**Reference:** `https://good-fella.com/`  
**Primary source inputs:** supplied screenshots + supplied Good Fella anchor markup.  
**Target:** `erbonilla/portfolio-uiux` portfolio.  
**Status:** Implementation-ready documentation. No code changes applied.

---

## 1. Executive summary

Good Fella’s CTA is not two independent static buttons. It is a single animated compound anchor with three visual layers:

1. **Leading plus tile** — hidden by default, revealed on hover.
2. **Label tile** — translated left by exactly one icon-tile width plus the inter-item gap by default; returns to natural position on hover.
3. **Trailing plus tile** — visible by default, absolutely positioned on the right; rotates/scales out on hover.

This creates a reversible “icon handoff” interaction:

```txt
Default:  [ LET'S WORK TOGETHER ][ + ]
Hover:    [ + ][ LET'S WORK TOGETHER ]
```

For `(ed)studio`, implement the same interaction grammar but remap all color, font, sizing, radius, focus, and timing to the Vanguard Portfolio UI System.

---

## 2. Observed Good Fella code structure

Supplied anchor structure, simplified:

```html
<a class="group ... font-mono uppercase ... lg:inline-flex" href="/pricing">
  <span class="relative flex w-full items-center gap-6">
    <span class="... size-32 lg:size-40 origin-left -rotate-45 scale-0 bg-brand text-black group-hover:rotate-0 group-hover:scale-100">
      <svg>+</svg>
    </span>

    <span class="... h-32 -translate-x-[calc(32px+6px)] px-8 lg:h-40 lg:-translate-x-[calc(40px+6px)] lg:px-12 bg-brand text-black group-hover:translate-x-0">
      <span style="overflow:hidden; height:20px; width:160px;">
        <span style="overflow:hidden; white-space:nowrap;">
          <span class="scramble-inherit">LET'S WORK TOGETHER</span>
        </span>
      </span>
    </span>

    <span class="... size-32 lg:size-40 absolute right-0 z-10 origin-right rotate-0 scale-100 bg-brand text-black group-hover:-rotate-45 group-hover:scale-0">
      <svg>+</svg>
    </span>
  </span>
</a>
```

### 2.1 DOM anatomy

| Node | Role | Default state | Hover state |
|---|---|---|---|
| `<a.group>` | Single interactive anchor | desktop-visible only via `lg:inline-flex` | owns group hover/focus state |
| `.relative flex ... gap-6` | Animation stage | contains in-flow start icon + label, absolute end icon | stable click area |
| leading plus tile | incoming icon | `scale(0)`, `rotate(-45deg)` | `scale(1)`, `rotate(0deg)` |
| label tile | main text surface | translated left by icon width + gap | translated to `0` |
| trailing plus tile | outgoing icon | `scale(1)`, `rotate(0deg)` | `scale(0)`, `rotate(-45deg)` |
| nested label masks | text/scramble stage | fixed `160×20px`, overflow hidden | supports scramble/reveal without layout shift |

### 2.2 Important implementation detail

The label tile is not simply adjacent to the plus icon. It is translated left by:

```css
calc(icon-size + gap)
```

Good Fella values:

```txt
mobile/base: 32px + 6px
large:       40px + 6px
```

This means the hidden leading icon still occupies layout space, but the label is visually pulled left so the default state reads as a normal label-plus pair. On hover, the label moves back to its natural position while the leading icon becomes visible.

This is the core mechanic to reproduce.

---

## 3. Visual measurements from screenshots and code

### 3.1 Button sizing

| Element | Good Fella value | Source |
|---|---:|---|
| Base icon tile | `32px` | `size-32` |
| Desktop icon tile | `40px` | `lg:size-40` |
| Base label height | `32px` | `h-32` |
| Desktop label height | `40px` | `lg:h-40` |
| Inter-part gap | `6px` | `gap-6` |
| Base label padding | `8px` inline | `px-8` |
| Desktop label padding | `12px` inline | `lg:px-12` |
| Text mask | `160×20px` | inline style |
| Transition duration | `700ms` | `duration-700` |
| Easing | `var(--ease-power4-in-out)` | arbitrary Tailwind timing function |
| CTA visibility | desktop only | `hidden ... lg:inline-flex` |

### 3.2 Color

From screenshots and code:

| Surface | Observed |
|---|---|
| CTA fill | bright orange, near `#FD551D` |
| CTA foreground | black |
| Header background | near-black / charcoal |
| Focus ring | brand-tinted ring |

For `(ed)studio`, do **not** copy Good Fella’s sampled orange. Use Vanguard’s brand token:

```css
--color-brand-500: #FF4F18;
```

---

## 4. Mouse and pointer interactions

### 4.1 Default state

```txt
[ label tile ][ trailing plus tile ]
```

Technical state:

- anchor is visible only at large breakpoint in Good Fella;
- leading plus exists in the DOM and layout flow but is visually hidden via transform:
  - `scale(0)`;
  - `rotate(-45deg)`;
  - `transform-origin: left`;
- label is shifted left by icon width + gap:
  - base: `translateX(calc((32px + 6px) * -1))`;
  - desktop: `translateX(calc((40px + 6px) * -1))`;
- trailing plus is absolutely positioned at the right:
  - `scale(1)`;
  - `rotate(0deg)`;
  - `transform-origin: right`;
  - `z-index: 10`.

### 4.2 Hover state

```txt
[ leading plus tile ][ label tile ]
```

Technical state:

- leading plus rotates and scales in:
  - `rotate(-45deg)` → `rotate(0deg)`;
  - `scale(0)` → `scale(1)`;
- label slides to its natural layout position:
  - negative `translateX` → `0`;
- trailing plus rotates and scales out:
  - `rotate(0deg)` → `rotate(-45deg)`;
  - `scale(1)` → `scale(0)`;
- all three transform transitions share the same duration/easing, so the handoff feels like one continuous motion.

### 4.3 Focus-visible

Good Fella applies:

```css
focus-visible:ring-2
focus-visible:ring-brand/50
focus-visible:ring-offset-2
focus-visible:ring-offset-background
```

For `(ed)studio`, use the existing global focus-visible system. Do not suppress outlines.

Recommended:

```css
:where(a, button):focus-visible {
  outline: var(--stroke-width-focus) solid var(--state-focus-ring);
  outline-offset: 2px;
}
```

### 4.4 Active / pressed

Good Fella’s snippet does not show an explicit pressed state. For `(ed)studio`, add a subtle tokenized pressed state:

```css
.root:active .label,
.root:active .iconStart,
.root:active .iconEnd {
  background-color: var(--surface-control-brand-pressed);
}
```

Use this only if it does not visually conflict with the transition veil.

---

## 5. Animation behavior

### 5.1 Transform-only animation

The Good Fella CTA uses transform animation only:

- `translateX`;
- `rotate`;
- `scale`.

This is technically sound because transform animations are compositor-friendly and avoid layout thrashing.

### 5.2 No opacity dependency

Visibility is handled primarily by `scale(0)` rather than `opacity: 0`.

Implications:

- the tiles remain in the accessibility tree only as part of the anchor;
- the SVG plus icons should be `aria-hidden`;
- transform-origin controls the direction of disappearance;
- no layout reflow occurs during hover.

### 5.3 Easing

Good Fella uses:

```css
transition-timing-function: var(--ease-power4-in-out);
```

This is a high-energy in-out curve. It starts deliberately, accelerates through the middle, and settles firmly.

For `(ed)studio`, strict Vanguard mapping should use:

```css
var(--motion-easing-expressive)
```

If exact feel is prioritized, a local component implementation detail can use:

```css
--work-cta-easing: cubic-bezier(0.76, 0, 0.24, 1);
```

Recommendation: use Vanguard’s expressive easing first. Add a local power4 curve only if motion QA finds the interaction too soft.

### 5.4 Duration

Good Fella uses:

```css
duration-700
```

For `(ed)studio`:

| Option | Duration | Recommendation |
|---|---:|---|
| Strict Vanguard | `var(--motion-duration-layout)` / `600ms` | Preferred for design-system purity. |
| Faithful Good Fella feel | `700ms` local component variable | Acceptable as a scoped exception if documented. |
| Existing hover token | `100ms` | Too fast for this icon handoff. Do not use for the main transform. |

Recommended component-local variable:

```css
.root {
  --work-cta-duration: var(--motion-duration-layout);
  --work-cta-easing: var(--motion-easing-expressive);
}
```

---

## 6. Variants and states

### 6.1 Required variants

| Variant | Use | Default composition |
|---|---|---|
| `icon-end` | Header / navbar default | label + trailing plus |
| `icon-start` | Optional hover-persistent or menu state | leading plus + label |
| `compact` | narrow layout | plus-only or hidden label |
| `large` | hero CTA | taller label and larger text mask |
| `disabled` | unavailable action | disabled opacity and no pointer events |

### 6.2 State matrix

| State | Leading icon | Label | Trailing icon | Notes |
|---|---|---|---|---|
| default | hidden, rotated `-45deg` | shifted left | visible | Good Fella closed state |
| hover | visible, `0deg` | shifted to `0` | hidden, rotated `-45deg` | icon handoff |
| focus-visible | same as hover recommended | same as hover | same as hover | keyboard users get equivalent feedback |
| active | same as hover + pressed color | pressed brand | hidden | optional |
| disabled | hidden | no transform | hidden or visible static | no animation |
| reduced motion | no transform animation | static | static | preserve clear affordance |

### 6.3 Mobile behavior

Good Fella hides this CTA below `lg`.

For `(ed)studio`:

- header CTA group should be hidden below `1024px` if it risks overflow;
- the menu command must remain visible at all widths;
- the `+` may remain visible on tablet only if width permits;
- hero CTA can use the same animation at larger sizes but should degrade to a simple button on small screens.

---

## 7. Vanguard token mapping

### 7.1 Color

| Good Fella class | Meaning | `(ed)studio` token |
|---|---|---|
| `bg-brand` | orange CTA surface | `--surface-control-brand` |
| hover brand | hotter orange | `--surface-control-brand-hover` |
| pressed brand | pressed orange | `--surface-control-brand-pressed` |
| `text-black` | foreground on orange | `--text-on-brand` or `--static-black` |
| focus brand ring | focus affordance | `--state-focus-ring` |
| page dark | header/hero background | `--surface-bg-hero` |

### 7.2 Typography

| Good Fella class | Meaning | `(ed)studio` token |
|---|---|---|
| `font-mono` | technical CTA text | `--font-family-code` |
| `font-medium` | medium weight | `--font-weight-medium` |
| `uppercase` | command style | `text-transform: uppercase` |
| `text-body-sm` | small label | `--font-size-xs` or `ts-label-md` |
| scramble mask | fixed text viewport | `.labelMask` with overflow hidden |

### 7.3 Size and spacing

Good Fella uses `32px` / `40px` controls. `(ed)studio` must preserve the ≥`44px` tap target rule.

| Role | Good Fella | `(ed)studio` |
|---|---:|---:|
| header tile | `40px` | `44px` |
| hero tile | `40px` | `52px` optional |
| gap | `6px` | `calc(var(--size-1) + var(--size-0-5))` = `6px` |
| header label padding | `12px` | `var(--space-inset-lg)` or `var(--space-inset-xl)` |
| hero label padding | `12px+` | `var(--space-inset-2xl)` |

---

## 8. Recommended implementation for `(ed)studio`

### 8.1 Component file

Create:

```txt
src/components/actions/work-together-cta/
  WorkTogetherCta.tsx
  WorkTogetherCta.module.css
```

### 8.2 `WorkTogetherCta.tsx`

```tsx
import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./WorkTogetherCta.module.css";

export type WorkTogetherCtaSize = "header" | "hero";

export interface WorkTogetherCtaProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  label?: string;
  size?: WorkTogetherCtaSize;
}

export function WorkTogetherCta({
  href = "#contact",
  label = "Work together",
  size = "header",
  className,
  ...props
}: WorkTogetherCtaProps) {
  return (
    <Link
      href={href}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
      <span className={styles.stage}>
        <span className={styles.iconStart} aria-hidden="true">
          <Plus />
        </span>

        <span className={styles.labelTile}>
          <span className={styles.labelMask}>
            <span className={styles.labelText}>{label}</span>
          </span>
        </span>

        <span className={styles.iconEnd} aria-hidden="true">
          <Plus />
        </span>
      </span>
    </Link>
  );
}
```

Notes:

- Use `Link` because this is navigation.
- `Plus` is decorative because the accessible label comes from visible text.
- Do not nest a link inside a button.
- If the CTA becomes plus-only at small widths, add `aria-label`.

### 8.3 `WorkTogetherCta.module.css`

```css
.root {
  --work-cta-size: 44px;
  --work-cta-gap: calc(var(--size-1) + var(--size-0-5));
  --work-cta-duration: var(--motion-duration-layout);
  --work-cta-easing: var(--motion-easing-expressive);

  display: inline-flex;
  min-width: 0;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: var(--text-on-brand);
  text-decoration: none;
  white-space: nowrap;
  outline: none;
}

.root[data-size="hero"] {
  --work-cta-size: var(--component-size-control-lg);
}

.stage {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--work-cta-gap);
}

.iconStart,
.iconEnd,
.labelTile {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-control-brand);
  color: var(--text-on-brand);
  transition:
    transform var(--work-cta-duration) var(--work-cta-easing),
    background-color var(--motion-duration-hover) var(--motion-easing-default),
    color var(--motion-duration-hover) var(--motion-easing-default);
}

.iconStart,
.iconEnd {
  width: var(--work-cta-size);
  height: var(--work-cta-size);
  flex: 0 0 var(--work-cta-size);
}

.iconStart {
  transform: rotate(-45deg) scale(0);
  transform-origin: left center;
}

.iconEnd {
  position: absolute;
  right: 0;
  z-index: 1;
  transform: rotate(0deg) scale(1);
  transform-origin: right center;
}

.iconStart svg,
.iconEnd svg {
  width: 0.75em;
  height: 0.75em;
  stroke-width: 1.5;
}

.labelTile {
  height: var(--work-cta-size);
  flex: 1 1 auto;
  min-width: 0;
  padding-inline: var(--space-inset-xl);
  transform: translateX(
    calc((var(--work-cta-size) + var(--work-cta-gap)) * -1)
  );
}

.root[data-size="hero"] .labelTile {
  padding-inline: var(--space-inset-2xl);
}

.labelMask {
  display: inline-block;
  max-width: 100%;
  height: var(--line-height-xs);
  overflow: hidden;
}

.labelText {
  display: block;
  overflow: hidden;
  color: currentColor;
  font-family: var(--font-family-code);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-xs);
  letter-spacing: var(--letter-spacing-wider);
  text-transform: uppercase;
  white-space: nowrap;
}

.root:hover .iconStart,
.root:focus-visible .iconStart {
  transform: rotate(0deg) scale(1);
}

.root:hover .labelTile,
.root:focus-visible .labelTile {
  transform: translateX(0);
}

.root:hover .iconEnd,
.root:focus-visible .iconEnd {
  transform: rotate(-45deg) scale(0);
}

.root:hover .iconStart,
.root:hover .iconEnd,
.root:hover .labelTile,
.root:focus-visible .iconStart,
.root:focus-visible .iconEnd,
.root:focus-visible .labelTile {
  background-color: var(--surface-control-brand-hover);
}

.root:active .iconStart,
.root:active .iconEnd,
.root:active .labelTile {
  background-color: var(--surface-control-brand-pressed);
}

.root[aria-disabled="true"] {
  pointer-events: none;
  opacity: var(--opacity-disabled);
}

@media (prefers-reduced-motion: reduce) {
  .iconStart,
  .iconEnd,
  .labelTile {
    transition:
      background-color var(--motion-duration-hover) var(--motion-easing-default),
      color var(--motion-duration-hover) var(--motion-easing-default);
  }

  .iconStart {
    display: none;
  }

  .labelTile {
    transform: none;
  }

  .iconEnd {
    position: static;
    transform: none;
  }
}
```

### 8.4 Header usage

```tsx
<WorkTogetherCta href="#contact" label="Work together" size="header" />
```

Recommended header rule:

```css
@media (max-width: 1023px) {
  .workTogetherSlot {
    display: none;
  }
}
```

This matches Good Fella’s desktop-only CTA behavior and protects narrow layouts.

### 8.5 Hero usage

```tsx
<WorkTogetherCta href="#contact" label="Work together" size="hero" />
```

For mobile hero, consider falling back to the existing `ButtonLink` if the animated compound CTA consumes too much width.

---

## 9. Optional text scramble integration

The supplied Good Fella markup wraps the label in a fixed overflow mask and applies:

```html
<span class="scramble-inherit">LET'S WORK TOGETHER</span>
```

This suggests the text may inherit a scramble animation from a parent script or text utility.

For `(ed)studio`, text scramble is optional. If added, it must be:

- deterministic;
- reduced-motion safe;
- not required for comprehension;
- not noisy for screen readers.

Recommended approach:

```tsx
<span aria-hidden="true" className={styles.labelText}>
  {scrambledLabel}
</span>
<span className="sr-only">{label}</span>
```

Do not continuously scramble text while idle. Trigger only on:

- pointer enter;
- focus-visible;
- transition veil start.

---

## 10. Interaction with the loading transition veil

The Good Fella CTA points to `/pricing`, but visually belongs to the same “work together” conversion flow as the loading overlay. For `(ed)studio`, wire it to contact.

Recommended click flow:

```txt
click WorkTogetherCta
  -> prevent default for same-page #contact
  -> start orange transition veil
  -> close menu if open
  -> scroll to #contact
  -> update URL hash
  -> focus contact heading
  -> exit veil
```

This preserves the Good Fella feeling without routing to a fake pricing page.

---

## 11. Accessibility requirements

- The entire control must be one anchor.
- Do not split the label and plus into separate focusable controls unless they perform different actions.
- Plus SVGs must be `aria-hidden`.
- Visible label must remain readable without animation.
- If label becomes hidden in any variant, add an `aria-label`.
- Focus-visible must trigger the same visual state as hover.
- Hit target must be ≥`44px`.
- Reduced motion must remove transform choreography.
- Text contrast on orange must use black / `--text-on-brand`.
- Do not use white text on orange for normal-size CTA text.
- Do not use `href="#"`.

---

## 12. QA checklist

### Visual

- [ ] Default state reads as `[Work together][+]`.
- [ ] Hover/focus state reads as `[+][Work together]`.
- [ ] No layout jump occurs during hover.
- [ ] CTA fill uses `--surface-control-brand`.
- [ ] CTA text uses `--text-on-brand`.
- [ ] Header size uses `44px` minimum, not Good Fella’s `40px`.
- [ ] Hero size can use `var(--component-size-control-lg)`.
- [ ] Font uses `--font-family-code`.
- [ ] Tracking uses `--letter-spacing-wider`.

### Motion

- [ ] Main transform duration uses `--motion-duration-layout` or a documented local `700ms`.
- [ ] Main transform easing uses `--motion-easing-expressive` or documented local power4-in-out.
- [ ] Hover/focus trigger the same transform state.
- [ ] Reduced motion disables transform choreography.
- [ ] Animation is transform-only.

### Accessibility

- [ ] One focus stop only.
- [ ] Plus icons are decorative.
- [ ] Focus ring remains visible.
- [ ] Link target is real.
- [ ] Same-page contact navigation moves focus to contact heading.
- [ ] No nested interactive elements.
- [ ] No `href="#"`.

### Responsive

- [ ] Header CTA hides below `1024px` if needed.
- [ ] No horizontal overflow at `320`, `375`, `768`, `1024`, `1440`.
- [ ] Hero CTA wraps or falls back on narrow screens.
- [ ] Menu-trigger remains available even when CTA is hidden.

### Build

- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `CI=1 pnpm test:e2e`

---

## 13. Final recommendation

Implement the Good Fella CTA as a **single compound anchor** in `(ed)studio`, not as two independent buttons.

The correct Vanguard translation is:

1. Use a single `WorkTogetherCta` component.
2. Keep the label and both plus tiles inside one anchor.
3. Use the Good Fella transform choreography:
   - incoming leading plus;
   - sliding label;
   - outgoing trailing plus.
4. Replace Good Fella values with Vanguard tokens:
   - orange → `--surface-control-brand`;
   - black foreground → `--text-on-brand`;
   - mono text → `--font-family-code`;
   - size → minimum `44px`;
   - duration → `--motion-duration-layout`;
   - easing → `--motion-easing-expressive`.
5. Trigger the existing Good Fella-inspired orange loading/transition veil only on high-intent contact actions.
6. Hide the header CTA below desktop if it risks overflow.
7. Preserve keyboard, reduced-motion, and focus-visible behavior.

This keeps the interaction’s premium mechanical quality while aligning it to `(ed)studio`’s system: one ember accent, dark glass, accessible controls, and product-focused conversion.
