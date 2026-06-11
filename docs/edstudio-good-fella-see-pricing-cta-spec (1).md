# `(ed)studio` Primary Sliding-Plus CTA Spec — Good Fella “See Our Pricing” Analysis

**Scope:** Technical analysis of Good Fella’s `SEE OUR PRICING` / `+` CTA and implementation guidance for the `(ed)studio` portfolio.  
**Reference:** `https://good-fella.com/`  
**Primary inputs:** supplied screenshots + supplied Good Fella anchor markup.  
**Target use in portfolio:** primary hero CTA such as `View case studies` / `View work`, not pricing.  
**Status:** Implementation-ready documentation. No code changes applied.

---

## 1. Executive summary

Good Fella’s `SEE OUR PRICING` CTA uses the same compound-button mechanic as its `LET'S WORK TOGETHER` CTA, but with one important placement difference:

- `SEE OUR PRICING` is an **inline hero CTA** and is visible immediately.
- `LET'S WORK TOGETHER` is primarily a **header conversion CTA** and, in the supplied code, is hidden until the large breakpoint.

The `SEE OUR PRICING` button is a single anchor that visually behaves like a two-piece CTA:

```txt
Default:  [ SEE OUR PRICING ][ + ]
Hover:    [ + ][ SEE OUR PRICING ]
```

It achieves this without changing DOM order by animating three transform layers:

1. hidden leading plus tile scales/rotates in;
2. label tile slides from a negative offset to `0`;
3. visible trailing plus tile rotates/scales out.

For `(ed)studio`, translate this into a reusable **PrimarySlidingPlusCta** component for `View case studies` / `View work`. Do **not** add portfolio pricing language unless an actual pricing section exists.

---

## 2. Screenshot observations

The supplied screenshots show two CTA states:

### 2.1 Default state

Visual structure:

```txt
[ SEE OUR PRICING ][ + ]
```

Observed characteristics:

- Orange CTA surface.
- Black uppercase text.
- Black plus icon.
- Label tile and plus tile are adjacent.
- Overall height is approximately `40px` in the reference.
- Corners are square or minimally rounded.
- Text is mono/technical, uppercase, and tightly controlled.
- The button sits on a dark page background.

### 2.2 Hover state

Visual structure:

```txt
[ + ][ SEE OUR PRICING ]
```

Observed characteristics:

- Leading plus tile is now visible.
- Label tile has shifted right into natural layout position.
- Trailing plus tile is gone or visually collapsed.
- Surface and text colors remain the same.
- The movement reads as a smooth icon handoff, not a color-change hover.

### 2.3 Sampled screenshot colors

From the uploaded image pixels:

| Surface | Approximate sampled value | Vanguard target |
|---|---:|---:|
| Orange CTA fill | `#FF561D` / `#FD551D` range | `--surface-control-brand` / `#FF4F18` |
| Dark background | `#121214` to `#141414` range | `--surface-bg-hero` |
| Text / plus | near-black | `--text-on-brand` / `--static-black` |

Use Vanguard orange, not the sampled Good Fella orange.

---

## 3. Supplied Good Fella code anatomy

Simplified structure:

```html
<a class="group inline-flex ... font-mono uppercase text-body-sm" href="/pricing">
  <span class="relative flex w-full items-center gap-6">
    <span class="... size-32 lg:size-40 origin-left -rotate-45 scale-0 bg-brand text-black group-hover:rotate-0 group-hover:scale-100">
      <svg>+</svg>
    </span>

    <span class="... h-32 -translate-x-[calc(32px+6px)] px-8 lg:h-40 lg:-translate-x-[calc(40px+6px)] lg:px-12 bg-brand text-black group-hover:translate-x-0">
      <span style="overflow:hidden; height:20px; width:126px;">
        <span style="overflow:hidden; white-space:nowrap;">
          <span class="scramble-inherit">SEE OUR PRICING</span>
        </span>
      </span>
    </span>

    <span class="... size-32 lg:size-40 absolute right-0 z-10 origin-right rotate-0 scale-100 bg-brand text-black group-hover:-rotate-45 group-hover:scale-0">
      <svg>+</svg>
    </span>
  </span>
</a>
```

### 3.1 DOM roles

| Node | Function |
|---|---|
| `<a.group>` | Single interactive control and navigation target. |
| stage wrapper | Relative positioning context and flex layout. |
| leading plus tile | In-flow tile hidden by default; appears on hover. |
| label tile | Main text surface; translated left by default. |
| nested label masks | Fixed-size text viewport for scramble/crop behavior. |
| trailing plus tile | Absolutely positioned visible default icon; disappears on hover. |

### 3.2 Key mechanical values

| Mechanic | Good Fella value |
|---|---:|
| Base tile size | `32px` |
| Large tile size | `40px` |
| Base label height | `32px` |
| Large label height | `40px` |
| Gap | `6px` |
| Base label padding | `8px` |
| Large label padding | `12px` |
| Label mask width | `126px` for `SEE OUR PRICING` |
| Label mask height | `20px` |
| Main transition duration | `700ms` |
| Main timing function | `var(--ease-power4-in-out)` |
| Leading icon default | `rotate(-45deg) scale(0)` |
| Leading icon hover | `rotate(0deg) scale(1)` |
| Label default | `translateX(calc((tile + gap) * -1))` |
| Label hover | `translateX(0)` |
| Trailing icon default | `rotate(0deg) scale(1)` |
| Trailing icon hover | `rotate(-45deg) scale(0)` |

---

## 4. Core interaction mechanic

### 4.1 Default composition

Although the leading plus tile exists in the flex layout, it is hidden by transform. The label tile is pulled left by exactly:

```css
calc(tile-size + gap)
```

This cancels the leading tile’s occupied space, so the default visual state becomes:

```txt
[ label ][ trailing plus ]
```

Technical state:

```css
.iconStart {
  transform: rotate(-45deg) scale(0);
  transform-origin: left center;
}

.labelTile {
  transform: translateX(calc((var(--cta-size) + var(--cta-gap)) * -1));
}

.iconEnd {
  position: absolute;
  right: 0;
  transform: rotate(0deg) scale(1);
  transform-origin: right center;
}
```

### 4.2 Hover / focus composition

On hover, the leading icon becomes visible, the label returns to its natural position, and the trailing icon collapses out.

```css
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
```

The visual result:

```txt
[ leading plus ][ label ]
```

### 4.3 Why this is technically strong

- It uses `transform`, not layout animation.
- It does not reflow text.
- It gives hover/focus a clear directional behavior.
- It keeps the whole CTA as one anchor and one focus stop.
- The plus icon changes position without changing the accessible name.
- The animation is reversible and deterministic.

---

## 5. Mouse interactions

### 5.1 Hover

Hover triggers the full icon-handoff choreography.

Expected user perception:

- The right `+` feels pulled into the left side.
- The text moves right into alignment with the revealed icon.
- The action feels active without changing route or content.

### 5.2 Focus-visible

Keyboard focus should trigger the same visual state as hover.

Reason:

- The hover animation is meaningful feedback.
- Keyboard users should receive equivalent affordance.
- The global focus ring still remains visible.

### 5.3 Click

Good Fella routes to `/pricing`.

For `(ed)studio`:

- map this CTA to `#work` or `#case-studies`;
- recommended label: `View case studies`;
- recommended href: `#work`.

If the portfolio later adds a service/pricing page, the CTA can be remapped, but do not introduce pricing copy before that content exists.

### 5.4 Active / pressed

Good Fella code does not show a dedicated active state. Add one using Vanguard tokens:

```css
.root:active .iconStart,
.root:active .iconEnd,
.root:active .labelTile {
  background-color: var(--surface-control-brand-pressed);
}
```

---

## 6. Animation behavior and timing

### 6.1 Good Fella timing

Good Fella uses:

```css
transition-duration: 700ms;
transition-timing-function: var(--ease-power4-in-out);
```

This produces a deliberate, premium-feeling transition. It is slower than a conventional hover state because it is not just feedback; it is a micro-interaction.

### 6.2 Vanguard timing translation

Use a component-local mapping to stay inside the design system:

```css
--primary-cta-duration: var(--motion-duration-layout);
--primary-cta-easing: var(--motion-easing-expressive);
```

Where Vanguard provides:

- `--motion-duration-layout`: `600ms`;
- `--motion-easing-expressive`: `cubic-bezier(0.16, 1, 0.3, 1)`.

If visual QA requires closer Good Fella timing, use a documented local override:

```css
--primary-cta-duration: 700ms;
--primary-cta-easing: cubic-bezier(0.76, 0, 0.24, 1);
```

Recommendation: start with Vanguard’s `600ms` expressive timing. Escalate to `700ms` only if the movement feels too quick.

### 6.3 Reduced motion

Under `prefers-reduced-motion: reduce`:

- remove scale/rotate/translate choreography;
- show a simple label + plus;
- preserve color hover/focus;
- keep visible focus.

---

## 7. Variants and state matrix

### 7.1 Variants

| Variant | Purpose | Recommended label |
|---|---|---|
| `hero-primary` | Main hero action | `View case studies` |
| `section-primary` | Section-level primary action | `View work` |
| `compact` | Small space fallback | `View work` or plus-only with `aria-label` |
| `external` | External full case-study link | Label-specific |
| `disabled` | Not generally needed for links | Avoid unless no action exists |

### 7.2 State matrix

| State | Leading plus | Label tile | Trailing plus | Surface |
|---|---|---|---|---|
| default | hidden, `-45deg`, `scale(0)` | shifted left | visible | brand orange |
| hover | visible, `0deg`, `scale(1)` | shifted to `0` | hidden, `-45deg`, `scale(0)` | brand hover |
| focus-visible | same as hover | same as hover | same as hover | brand hover + focus ring |
| active | same as hover | same as hover | hidden | brand pressed |
| disabled | no motion | muted | no motion | opacity disabled |
| reduced motion | static hidden or static inline | no transform | static inline | color-only hover/focus |

---

## 8. Vanguard design-system adjustments

### 8.1 Color mapping

| Good Fella class | Meaning | `(ed)studio` token |
|---|---|---|
| `bg-brand` | orange CTA fill | `--surface-control-brand` |
| hover orange | brighter active orange | `--surface-control-brand-hover` |
| pressed orange | pressed state | `--surface-control-brand-pressed` |
| `text-black` | readable foreground on orange | `--text-on-brand` |
| focus brand | ring color | `--state-focus-ring` |
| dark stage | background behind CTA | `--surface-bg-hero` |

Important contrast rule:

- Black on Vanguard orange is correct.
- White on Vanguard orange is not recommended for normal small CTA text.

### 8.2 Font mapping

| Good Fella | `(ed)studio` |
|---|---|
| `font-mono` | `--font-family-code` |
| `font-medium` | `--font-weight-medium` |
| `uppercase` | `text-transform: uppercase` |
| `text-body-sm` | `--font-size-xs` / `--line-height-xs` |
| letter rhythm | `--letter-spacing-wider` |

### 8.3 Size mapping

Good Fella’s large control is `40px`. `(ed)studio` should use at least `44px`.

| Role | Good Fella | `(ed)studio` |
|---|---:|---:|
| base tile | `32px` | avoid for touch CTA |
| large tile | `40px` | `44px` minimum |
| hero tile | `40px` | `52px` optional |
| gap | `6px` | `calc(var(--size-1) + var(--size-0-5))` |
| label padding | `8–12px` | `var(--space-inset-xl)` |
| hero label padding | `12px` | `var(--space-inset-2xl)` |

---

## 9. Recommended implementation

### 9.1 Component name

Create a reusable generic CTA, not a pricing-specific component.

Recommended path:

```txt
src/components/actions/sliding-plus-cta/
  SlidingPlusCta.tsx
  SlidingPlusCta.module.css
```

This can power:

- `View case studies`;
- `View work`;
- `Work together`;
- `Read case study`.

### 9.2 `SlidingPlusCta.tsx`

```tsx
import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./SlidingPlusCta.module.css";

export type SlidingPlusCtaSize = "md" | "lg";

export interface SlidingPlusCtaProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  label: string;
  size?: SlidingPlusCtaSize;
}

export function SlidingPlusCta({
  href,
  label,
  size = "md",
  className,
  ...props
}: SlidingPlusCtaProps) {
  const isExternal = /^https?:\/\//.test(href);

  const content = (
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
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(styles.root, className)}
        data-size={size}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(styles.root, className)}
      data-size={size}
      {...props}
    >
      {content}
    </Link>
  );
}
```

### 9.3 `SlidingPlusCta.module.css`

```css
.root {
  --sliding-cta-size: var(--component-size-control-md);
  --sliding-cta-gap: calc(var(--size-1) + var(--size-0-5));
  --sliding-cta-duration: var(--motion-duration-layout);
  --sliding-cta-easing: var(--motion-easing-expressive);

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

.root[data-size="lg"] {
  --sliding-cta-size: var(--component-size-control-lg);
}

.stage {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: var(--sliding-cta-gap);
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
    transform var(--sliding-cta-duration) var(--sliding-cta-easing),
    background-color var(--motion-duration-hover) var(--motion-easing-default),
    color var(--motion-duration-hover) var(--motion-easing-default);
}

.iconStart,
.iconEnd {
  width: var(--sliding-cta-size);
  height: var(--sliding-cta-size);
  flex: 0 0 var(--sliding-cta-size);
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
  height: var(--sliding-cta-size);
  flex: 1 1 auto;
  min-width: 0;
  padding-inline: var(--space-inset-xl);
  transform: translateX(
    calc((var(--sliding-cta-size) + var(--sliding-cta-gap)) * -1)
  );
}

.root[data-size="lg"] .labelTile {
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

---

## 10. Portfolio-specific usage

### 10.1 Hero primary CTA

Good Fella:

```txt
SEE OUR PRICING
```

`(ed)studio` equivalent:

```txt
VIEW CASE STUDIES
```

Usage:

```tsx
<SlidingPlusCta href="#work" label="View case studies" size="lg" />
```

Alternative shorter label:

```tsx
<SlidingPlusCta href="#work" label="View work" size="lg" />
```

Recommendation:

- Use `View case studies` if the hero needs specificity.
- Use `View work` if header/spacing is tight.

### 10.2 Secondary hero CTA

Do not use the same high-emphasis orange CTA twice in the same row.

Recommended pairing:

```tsx
<div className={s.heroCtas}>
  <SlidingPlusCta href="#work" label="View case studies" size="lg" />
  <ButtonLink href="#contact" variant="secondary" size="lg">
    Work together
  </ButtonLink>
</div>
```

If using the animated `WorkTogetherCta` as well, visually separate the two so they do not compete.

### 10.3 Section-level CTAs

For case-study cards:

```tsx
<SlidingPlusCta href="/work/osteoplus" label="Read summary" size="md" />
```

For external case studies:

```tsx
<SlidingPlusCta
  href="https://..."
  label="Open case study"
  size="md"
  target="_blank"
  rel="noreferrer"
/>
```

---

## 11. Optional scramble text

Good Fella uses a `scramble-inherit` span inside a fixed overflow mask.

For `(ed)studio`, scramble is optional and should be restrained.

Rules:

- Do not scramble continuously.
- Do not scramble screen-reader text.
- Respect reduced motion.
- Keep the readable label in the DOM.
- Use scramble only on hover/focus or transition veil start.

Recommended accessibility pattern if scramble is added:

```tsx
<span className={styles.labelMask} aria-hidden="true">
  <span className={styles.labelText}>{visualScrambledLabel}</span>
</span>
<span className="sr-only">{label}</span>
```

If no scramble is added, the current visible label is sufficient.

---

## 12. Integration with loading transition

If this CTA is used for `#work`, do **not** trigger the orange full-page loading veil by default. Scrolling to work should be fast.

Use the transition veil only for high-intent conversion actions:

- `Work together`;
- `+` contact shortcut;
- contact form route;
- booking/contact flow.

For `View case studies`, use normal anchor scroll with existing `scroll-margin-top`.

---

## 13. Accessibility requirements

- The CTA must be one anchor and one focus stop.
- Plus icons must be `aria-hidden="true"`.
- Visible text must provide the accessible name.
- If label is visually hidden in a compact variant, add `aria-label`.
- Use real links: `#work`, `/work/slug`, or external URLs.
- Do not use `href="#"`.
- Do not nest anchors inside buttons.
- Focus-visible should trigger the hover-equivalent state.
- Global focus ring must remain visible.
- Target height must be at least `44px`.
- Reduced motion must disable transform choreography.
- Color contrast must use black text on orange.

---

## 14. QA checklist

### Visual

- [ ] Default state reads `[View case studies][+]`.
- [ ] Hover/focus state reads `[+][View case studies]`.
- [ ] No layout jump occurs on hover.
- [ ] CTA fill uses `--surface-control-brand`.
- [ ] CTA foreground uses `--text-on-brand`.
- [ ] CTA font uses `--font-family-code`.
- [ ] Label is uppercase.
- [ ] Label tracking uses `--letter-spacing-wider`.
- [ ] Header/hero dark background uses existing dark surface tokens.

### Motion

- [ ] Leading plus scales/rotates in.
- [ ] Label translates from negative offset to `0`.
- [ ] Trailing plus scales/rotates out.
- [ ] Motion is transform-only.
- [ ] Timing uses `--motion-duration-layout` or documented local `700ms`.
- [ ] Easing uses `--motion-easing-expressive` or documented local power4 curve.
- [ ] Reduced motion disables transform choreography.

### Interaction

- [ ] Hover and focus-visible produce equivalent visual affordance.
- [ ] Active state uses pressed brand token.
- [ ] Click navigates to a real portfolio destination.
- [ ] No full-page loading veil on regular `View case studies` scroll.
- [ ] No duplicated focus stops.

### Responsive

- [ ] CTA remains usable at `320px`.
- [ ] CTA wraps or switches to a simpler button if the label is too long.
- [ ] No horizontal overflow at `320`, `375`, `768`, `1024`, `1440`.
- [ ] Hero CTA spacing remains stable with secondary CTA.

### Build

- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `CI=1 pnpm test:e2e`

---

## 15. Final recommendation

Implement Good Fella’s `SEE OUR PRICING` interaction as a reusable `(ed)studio` **SlidingPlusCta** component.

Use it primarily for:

```txt
VIEW CASE STUDIES
```

or, if space is constrained:

```txt
VIEW WORK
```

Do not copy `SEE OUR PRICING` unless the portfolio has a real pricing section.

The final `(ed)studio` translation should preserve the premium mechanical behavior:

- one anchor;
- incoming leading plus;
- sliding label tile;
- outgoing trailing plus;
- transform-only animation;
- mono uppercase label;
- black foreground on orange;
- minimum `44px` control height;
- reduced-motion-safe fallback.

This gives the portfolio the same strong CTA affordance as Good Fella while remaining honest, accessible, and fully aligned with the Vanguard design system.
