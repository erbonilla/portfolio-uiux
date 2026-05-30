# Vanguard Premium UI/UX Design System

**Version:** alpha.1  
**Status:** Complete design-system specification; Figma/MCP implementation QA pending  
**System name:** Vanguard - Premium Apparel  
**Primary use:** Premium responsive UI/UX portfolio surfaces, case-study pages, component libraries, and product-interface patterns  
**Engineering target:** React + CSS custom properties  
**Accessibility target:** WCAG 2.2 AA  
**Source basis:** `Portfolio UIUX Premium Design - Syne Inter.md` and the referenced complete-design-system Figma MCP prompt.

---

## 1. Source hierarchy

1. **Visual source of truth:** `Portfolio UIUX Premium Design - Syne Inter.md`
   - Governs palette, typography pairing, composition cues, glass material, spacing rhythm, radius behavior, icon style, detected button styles, and motion feel.
2. **System architecture source:** `complete-design-system-figma-mcp-prompt`
   - Governs token architecture, Figma variable strategy, semantic aliasing, page structure, component-kit scope, pattern documentation, governance, and QA.
3. **This document**
   - Consolidates both sources into a production-ready design-system specification.
4. **Future Figma audit**
   - Must override this document only for implementation facts such as actual page names, existing variables, local component collisions, unsupported MCP operations, and verified variable IDs.

When sources conflict, use the attached premium design document for visual decisions and the complete-design-system prompt for system structure, naming, governance, and QA.

---

## 2. Known gaps and reversible assumptions

| Gap | Impact | Reversible assumption used |
|---|---|---|
| No target Figma file link was provided. | Existing Figma pages, variables, components, and conflicts cannot be inspected. | This document defines the system to build; Figma-specific QA remains pending. |
| The source design is primarily dark/glassy, while the MCP prompt requires light and dark modes. | Light mode is not explicitly specified. | Dark mode is canonical; light mode is a neutral accessible companion mode. |
| The source gives custom neutrals: `#050505`, `#262626`, `#A3A3A3`. | A standard gray/slate/zinc/stone ramp cannot be selected without drift. | Use a custom neutral ramp anchored to the provided values; nearest conventional family is neutral/zinc. |
| Gradient border shell is described, but exact gradient stops are not supplied. | A precise gradient token would require invention. | Document the shell as a material recipe; do not create unsupported gradient stops. |
| Source easing strings include malformed/incomplete fragments: `1)` and incomplete `cubic-bezier(...)`. | They cannot be implemented safely as-is. | Preserve source durations and expressive feel; use valid easing fallbacks and document the limitation. |
| Logo, photography, illustration, and brand asset rules are not supplied. | A full asset system would require unsupported invention. | Exclude logo/imagery rules; govern only UI iconography and visual-system behavior. |
| Only `display-lg`, `body-md`, and `label-md` typography styles are source-defined. | A complete type scale requires extension. | Preserve those exact styles; extend the rest using the same family, weight, rhythm, and casing logic. |

---

## 3. Chosen setup

| Decision | Value |
|---|---|
| Brand color | `#FF4F18` |
| Secondary/accent color | `#A08C6C` |
| Reserved tertiary color | `#6B5C43` |
| Neutral foundation | `#050505` |
| Primary dark surface | `#050505` |
| Primary dark border | `#262626` |
| Secondary text | `#A3A3A3` |
| Heading font | Syne |
| Body/UI font | Inter |
| Code fallback | JetBrains Mono or system monospace |
| Icon style | Solar linear |
| Canonical radius family | `0px`, `2px`, `9999px` |
| Spacing rhythm | 4px base with documented 2px micro-gap |
| Canonical mode | Dark glass |

---

## 4. Design principles

1. **Glass first.** Surfaces should read as premium dark glass before they read as flat cards.
2. **Accent-led contrast.** `#FF4F18` is the primary emphasis color for text, active states, CTA surfaces, focus, and brand moments.
3. **Full-bleed composition.** Layouts preserve a flex-based, full-bleed frame with minimal grid visibility.
4. **Semantic before specific.** Components consume semantic tokens only; primitives are reference values.
5. **4px rhythm with source exceptions.** Spacing follows a 4px rhythm, with a documented 2px micro-gap exception.
6. **Tight shape language.** Default surfaces are sharp/tight, anchored by 0px-2px radii; pill treatment is reserved for selected controls.
7. **Linear iconography.** Solar-style linear icons are the canonical icon treatment.
8. **Expressive but focused motion.** Motion may be premium and expressive, but it must support comprehension rather than decoration.
9. **Accessible by default.** Approved foreground/background pairs must meet contrast requirements before release.
10. **Documented limitations.** Unsupported or ambiguous Figma/MCP operations must be logged on the System QA page.

---

# Figma architecture

## 5. Page structure

Create or update these pages in order:

| Page | Purpose |
|---|---|
| `00 System audit` | Preflight file audit, collisions, limitations, implementation notes |
| `01 Foundations` | System overview, source hierarchy, principles |
| `02 Color` | Primitive ramps, semantic swatches, contrast pairs |
| `03 Typography` | Type styles, font pairing, specimens |
| `04 Spacing` | Inset, stack, inline, section, and component-size scales |
| `05 Radius` | Default, rounded, and no-corner-radius mode previews |
| `06 Elevation` | Glass, border, shadow, blur, and focus-ring previews |
| `07 Accessibility` | Contrast, focus, disabled states, form errors, reduced motion |
| `08 Developer handoff` | CSS variables, DTCG export model, React usage |
| `09 Components` | Starter component kit and documentation frames |
| `10 Patterns` | Production-like patterns assembled from system components |
| `11 Governance` | Contribution, versioning, naming, token rules |
| `12 System QA` | Final validation checklist, limitations, pass/warning/fail status |

## 6. Variable collections and modes

| Collection | Type | Modes |
|---|---:|---|
| `primitives.color` | Primitive | Single mode |
| `primitives.dimension` | Primitive | Single mode |
| `primitives.radius` | Primitive | Single mode |
| `primitives.typography` | Primitive | Single mode |
| `primitives.number` | Primitive | Single mode |
| `primitives.shadow` | Primitive/effect | Single mode unless native effect variables require otherwise |
| `primitives.motion` | Optional primitive | Single mode; code-oriented if Figma binding is unsupported |
| `primitives.z-index` | Optional primitive | Code-oriented |
| `semantic.color` | Semantic | `light`, `dark` |
| `semantic.dimension` | Semantic | Single mode |
| `semantic.radius` | Semantic | `default`, `rounded`, `no-corner-radius` |
| `semantic.typography` | Semantic | Single mode |
| `semantic.elevation` | Semantic | `light`, `dark` |
| `semantic.number` | Semantic | Single mode |
| `semantic.motion` | Optional semantic | `default`, `reduced-motion` |
| `semantic.z-index` | Optional semantic | Code-oriented |

## 7. Naming and code syntax

Use slash naming in Figma and convert slashes to CSS custom-property syntax in code.

| Figma variable | CSS custom property |
|---|---|
| `color/brand/500` | `--color-brand-500` |
| `surface/bg/default` | `--surface-bg-default` |
| `text/default` | `--text-default` |
| `heading/h1/font-size` | `--heading-h1-font-size` |
| `space/inset/md` | `--space-inset-md` |
| `radius/control/md` | `--radius-control-md` |
| `elevation/shadow/focus` | `--elevation-shadow-focus` |

Semantic variables must alias primitive variables wherever Figma supports aliasing. Do not hardcode raw hex, raw numbers, or raw strings into semantic variables when a primitive exists.

---

# Foundations

## 8. Primitive color tokens

### 8.1 Core colors

| Token | Value |
|---|---:|
| `color/transparent` | `transparent` |
| `color/black` | `#000000` |
| `color/white` | `#FFFFFF` |

### 8.2 Color ramps

Color ramps are primitive reference values. The provided source values are preserved at their canonical steps; intermediate ramp values are reversible approximations for system completeness.

| Step | `color/neutral/*` | `color/brand/*` | `color/accent/*` | `color/tertiary/*` | `color/success/*` | `color/warning/*` | `color/danger/*` | `color/info/*` |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 50 | `#FAFAFA` | `#FFF4F0` | `#F9F8F6` | `#F9F8F6` | `#F0FDF4` | `#FFFBEB` | `#FEF2F2` | `#EFF6FF` |
| 100 | `#F5F5F5` | `#FFE4DA` | `#F0EEEA` | `#F0EEEA` | `#DCFCE7` | `#FEF3C7` | `#FEE2E2` | `#DBEAFE` |
| 200 | `#E5E5E5` | `#FFC5B2` | `#E1DBD1` | `#E2DBD0` | `#BBF7D0` | `#FDE68A` | `#FECACA` | `#BFDBFE` |
| 300 | `#D4D4D4` | `#FF9E80` | `#CDC2B2` | `#CEC3B1` | `#86EFAC` | `#FCD34D` | `#FCA5A5` | `#93C5FD` |
| 400 | `#A3A3A3` | `#FF7248` | `#B5A58C` | `#B6A68B` | `#4ADE80` | `#FBBF24` | `#F87171` | `#60A5FA` |
| 500 | `#737373` | `#FF4F18` | `#A08C6C` | `#6B5C43` | `#16A34A` | `#D97706` | `#DC2626` | `#2563EB` |
| 600 | `#525252` | `#E63D0D` | `#827054` | `#5D503B` | `#15803D` | `#B45309` | `#B91C1C` | `#1D4ED8` |
| 700 | `#404040` | `#B8320D` | `#635640` | `#4F432F` | `#166534` | `#92400E` | `#991B1B` | `#1E40AF` |
| 800 | `#262626` | `#8F2A10` | `#4D4332` | `#3F3628` | `#14532D` | `#78350F` | `#7F1D1D` | `#1E3A8A` |
| 900 | `#171717` | `#5F1E0D` | `#302B21` | `#30291F` | `#052E16` | `#451A03` | `#450A0A` | `#172554` |
| 950 | `#050505` | `#321006` | `#1E1B15` | `#1E1A14` | `#022C12` | `#2E1001` | `#2A0606` | `#0B1437` |

### 8.3 Color usage rules

| Role | Rule |
|---|---|
| Brand | Use `brand/500` for primary emphasis, action surfaces, active states, focus, and expressive text. |
| Accent | Use `accent/500` for secondary premium emphasis, warm supporting badges, or editorial metadata. |
| Tertiary | Use `tertiary/500` sparingly for earth-toned support moments; do not use as normal text on dark surfaces. |
| Neutral | Use neutral for surfaces, borders, disabled states, body text, and structural chrome. |
| Feedback | Use success, warning, danger, and info only for semantic system states. |
| Full-bleed background | The canonical dark visual mode may use `brand/500` as a full-bleed canvas behind dark glass surfaces. |
| Surface | The canonical glass surface foundation is `neutral/950`. |
| Border | The canonical dark border is `neutral/800`. |

## 9. Primitive dimension tokens

The base rhythm is 4px. `size/0-5` preserves the source-detected 2px micro-gap.

| Token | Value |
|---|---:|
| `size/0` | `0px` |
| `size/0-5` | `2px` |
| `size/1` | `4px` |
| `size/2` | `8px` |
| `size/3` | `12px` |
| `size/4` | `16px` |
| `size/5` | `20px` |
| `size/6` | `24px` |
| `size/7` | `28px` |
| `size/8` | `32px` |
| `size/10` | `40px` |
| `size/12` | `48px` |
| `size/14` | `56px` |
| `size/16` | `64px` |
| `size/20` | `80px` |
| `size/24` | `96px` |
| `size/32` | `128px` |

Source-aligned layout values:

| Use | Values |
|---|---|
| Base unit | `4px` |
| Micro gap | `2px` |
| Common gaps | `8px`, `12px`, `16px` |
| Card padding | `24px`, `32px` |
| Section padding | `24px`, `32px`, `56px` |
| Large layout span | `80px` |

## 10. Primitive radius tokens

The source shape language is tight: 0px, 2px, and 9999px are canonical. Additional radius values exist only to support required mode switching and larger responsive surfaces.

| Token | Value | Source status |
|---|---:|---|
| `radius/none` | `0px` | Source-defined |
| `radius/tight` | `2px` | Source-defined |
| `radius/sm` | `2px` | Source-aligned |
| `radius/md` | `2px` | Source-aligned |
| `radius/lg` | `2px` | Source-aligned |
| `radius/xl` | `4px` | Reversible extension |
| `radius/2xl` | `8px` | Reversible extension |
| `radius/pill` | `9999px` | Source-defined |

Rounded-mode primitives:

| Token | Value |
|---|---:|
| `radius-rounded/sm` | `2px` |
| `radius-rounded/md` | `4px` |
| `radius-rounded/lg` | `8px` |
| `radius-rounded/xl` | `12px` |
| `radius-rounded/2xl` | `16px` |
| `radius-rounded/pill` | `9999px` |

No-corner-radius primitives:

| Token | Value |
|---|---:|
| `radius-none/sm` | `0px` |
| `radius-none/md` | `0px` |
| `radius-none/lg` | `0px` |
| `radius-none/xl` | `0px` |
| `radius-none/2xl` | `0px` |
| `radius-none/pill` | `0px` |

## 11. Primitive typography tokens

### 11.1 Font family

| Token | Value |
|---|---|
| `font-family/heading` | `Syne` |
| `font-family/body` | `Inter` |
| `font-family/code` | `JetBrains Mono`, fallback monospace |

### 11.2 Font weight

| Token | CSS weight | Figma string |
|---|---:|---|
| `font-weight/regular` | `400` | `Regular` |
| `font-weight/medium` | `500` | `Medium` |
| `font-weight/semibold` | `600` | `SemiBold` |
| `font-weight/bold` | `700` | `Bold` |

### 11.3 Font size

| Token | Value |
|---|---:|
| `font-size/2xs` | `11px` |
| `font-size/xs` | `12px` |
| `font-size/sm` | `14px` |
| `font-size/md` | `16px` |
| `font-size/lg` | `18px` |
| `font-size/xl` | `20px` |
| `font-size/2xl` | `24px` |
| `font-size/3xl` | `30px` |
| `font-size/4xl` | `36px` |
| `font-size/5xl` | `48px` |
| `font-size/6xl` | `64px` |
| `font-size/7xl` | `72px` |

### 11.4 Line height

| Token | Value |
|---|---:|
| `line-height/2xs` | `14px` |
| `line-height/xs` | `16px` |
| `line-height/sm` | `20px` |
| `line-height/md` | `24px` |
| `line-height/lg` | `28px` |
| `line-height/xl` | `28px` |
| `line-height/2xl` | `32px` |
| `line-height/3xl` | `38px` |
| `line-height/4xl` | `44px` |
| `line-height/5xl` | `48px` |
| `line-height/6xl` | `56px` |
| `line-height/7xl` | `72px` |

### 11.5 Letter spacing

| Token | Value |
|---|---:|
| `letter-spacing/tighter` | `-0.02em` |
| `letter-spacing/tight` | `-0.01em` |
| `letter-spacing/normal` | `0` |
| `letter-spacing/wide` | `0.1em` |
| `letter-spacing/wider` | `1.2px` |

### 11.6 Paragraph spacing and indent

| Token | Value |
|---|---:|
| `paragraph-spacing/none` | `0px` |
| `paragraph-spacing/xs` | `2px` |
| `paragraph-spacing/sm` | `4px` |
| `paragraph-spacing/md` | `8px` |
| `paragraph-spacing/lg` | `12px` |
| `paragraph-spacing/xl` | `16px` |
| `paragraph-indent/none` | `0px` |

## 12. Primitive number tokens

### 12.1 Opacity

| Token | Value |
|---|---:|
| `opacity/0` | `0%` |
| `opacity/5` | `5%` |
| `opacity/10` | `10%` |
| `opacity/20` | `20%` |
| `opacity/30` | `30%` |
| `opacity/40` | `40%` |
| `opacity/50` | `50%` |
| `opacity/60` | `60%` |
| `opacity/70` | `70%` |
| `opacity/80` | `80%` |
| `opacity/90` | `90%` |
| `opacity/100` | `100%` |

### 12.2 Stroke width

| Token | Value |
|---|---:|
| `stroke-width/0` | `0px` |
| `stroke-width/1` | `1px` |
| `stroke-width/2` | `2px` |
| `stroke-width/3` | `3px` |
| `stroke-width/4` | `4px` |

### 12.3 Z-index

Code-oriented; create in Figma only if safe.

| Token | Value |
|---|---:|
| `z-index/base` | `0` |
| `z-index/docked` | `10` |
| `z-index/dropdown` | `100` |
| `z-index/sticky` | `200` |
| `z-index/overlay` | `400` |
| `z-index/modal` | `500` |
| `z-index/popover` | `600` |
| `z-index/toast` | `700` |
| `z-index/tooltip` | `800` |

## 13. Primitive shadow and blur tokens

Use native Effect variables if supported. If unsupported, create local Effect Styles with the same names. Do not use string variables for shadows.

| Token | Value / recipe |
|---|---|
| `shadow/none` | No shadow |
| `shadow/xs` | Hairline inset highlight; reversible extension |
| `shadow/sm` | `rgba(0,0,0,0.25) 0px 25px 50px -12px` |
| `shadow/md` | `rgba(0,0,0,0.4) 0px 3px 5px 0px inset`, `rgba(255,255,255,0.3) 0px 1px 1px 0px` |
| `shadow/lg` | `rgba(255,255,255,0.05) 0px 0px 0px 1px inset`, `rgba(255,255,255,0.1) 0px 2px 10px 0px inset`, `rgba(0,0,0,0.8) 0px 20px 40px 0px` |
| `shadow/xl` | Same as `shadow/lg` unless Figma implementation defines a verified expansion |
| `shadow/2xl` | Same as `shadow/lg` unless Figma implementation defines a verified expansion |
| `shadow/focus` | `0 0 0 2px` using `border/focus` / `state/focus-ring` |
| `blur/glass` | `4px` |

## 14. Primitive motion tokens

The source motion level is expressive. Durations preserve the source cluster.

| Token | Value |
|---|---:|
| `duration/instant` | `0ms` |
| `duration/fast` | `100ms` |
| `duration/faster` | `150ms` |
| `duration/normal` | `300ms` |
| `duration/expressive` | `600ms` |
| `duration/slow` | `800ms` |
| `duration/slower` | `1000ms` |

| Token | Value | Note |
|---|---|---|
| `easing/linear` | `linear` | Stable |
| `easing/standard` | `ease` | Source-supported |
| `easing/expressive` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reversible fallback from incomplete source easing |
| `easing/emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Prompt-aligned fallback |
| `easing/reduced` | `linear` | Reduced-motion mode |

---

# Semantic tokens

## 15. Semantic color tokens

All values below must alias primitive color variables in Figma. The table shows aliases, not raw semantic values.

### 15.1 Surface background

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `surface/bg/canvas` | `color/neutral/50` | `color/brand/500` |
| `surface/bg/default` | `color/white` | `color/neutral/950` |
| `surface/bg/subtle` | `color/neutral/50` | `color/neutral/900` |
| `surface/bg/muted` | `color/neutral/100` | `color/neutral/800` |
| `surface/bg/raised` | `color/white` | `color/neutral/950` |
| `surface/bg/overlay` | `color/neutral/950` | `color/neutral/950` |
| `surface/bg/inverse` | `color/neutral/950` | `color/white` |
| `surface/bg/disabled` | `color/neutral/100` | `color/neutral/800` |
| `surface/bg/brand` | `color/brand/500` | `color/brand/500` |
| `surface/bg/brand-subtle` | `color/brand/50` | `color/brand/900` |
| `surface/bg/accent` | `color/accent/500` | `color/accent/500` |
| `surface/bg/accent-subtle` | `color/accent/100` | `color/accent/900` |
| `surface/bg/success` | `color/success/500` | `color/success/600` |
| `surface/bg/success-subtle` | `color/success/50` | `color/success/900` |
| `surface/bg/warning` | `color/warning/500` | `color/warning/600` |
| `surface/bg/warning-subtle` | `color/warning/50` | `color/warning/900` |
| `surface/bg/danger` | `color/danger/500` | `color/danger/600` |
| `surface/bg/danger-subtle` | `color/danger/50` | `color/danger/900` |
| `surface/bg/info` | `color/info/500` | `color/info/600` |
| `surface/bg/info-subtle` | `color/info/50` | `color/info/900` |

### 15.2 Control surface

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `surface/control/default` | `color/white` | `color/neutral/950` |
| `surface/control/hover` | `color/neutral/50` | `color/neutral/900` |
| `surface/control/pressed` | `color/neutral/100` | `color/neutral/800` |
| `surface/control/selected` | `color/brand/50` | `color/brand/900` |
| `surface/control/disabled` | `color/neutral/100` | `color/neutral/800` |
| `surface/control/brand` | `color/brand/500` | `color/brand/500` |
| `surface/control/brand-hover` | `color/brand/600` | `color/brand/400` |
| `surface/control/brand-pressed` | `color/brand/700` | `color/brand/600` |
| `surface/control/danger` | `color/danger/500` | `color/danger/600` |
| `surface/control/danger-hover` | `color/danger/600` | `color/danger/500` |
| `surface/control/danger-pressed` | `color/danger/700` | `color/danger/700` |

### 15.3 Text

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `text/default` | `color/neutral/950` | `color/brand/500` |
| `text/muted` | `color/neutral/600` | `color/neutral/400` |
| `text/subtle` | `color/neutral/500` | `color/neutral/500` |
| `text/disabled` | `color/neutral/400` | `color/neutral/600` |
| `text/inverse` | `color/white` | `color/neutral/950` |
| `text/link` | `color/brand/700` | `color/brand/500` |
| `text/link-hover` | `color/brand/800` | `color/brand/400` |
| `text/link-visited` | `color/brand/900` | `color/brand/600` |
| `text/brand` | `color/brand/700` | `color/brand/500` |
| `text/accent` | `color/accent/800` | `color/accent/400` |
| `text/success` | `color/success/700` | `color/success/400` |
| `text/warning` | `color/warning/700` | `color/warning/400` |
| `text/danger` | `color/danger/700` | `color/danger/400` |
| `text/info` | `color/info/700` | `color/info/400` |
| `text/on-brand` | `color/black` | `color/black` |
| `text/on-accent` | `color/black` | `color/black` |
| `text/on-success` | `color/black` | `color/white` |
| `text/on-warning` | `color/black` | `color/white` |
| `text/on-danger` | `color/white` | `color/white` |
| `text/on-info` | `color/white` | `color/white` |
| `text/on-inverse` | `color/white` | `color/black` |

### 15.4 Icon

Icon aliases match text aliases unless a component explicitly needs lower emphasis.

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `icon/default` | `color/neutral/950` | `color/brand/500` |
| `icon/muted` | `color/neutral/600` | `color/neutral/400` |
| `icon/subtle` | `color/neutral/500` | `color/neutral/500` |
| `icon/disabled` | `color/neutral/400` | `color/neutral/600` |
| `icon/inverse` | `color/white` | `color/neutral/950` |
| `icon/brand` | `color/brand/700` | `color/brand/500` |
| `icon/accent` | `color/accent/800` | `color/accent/400` |
| `icon/success` | `color/success/700` | `color/success/400` |
| `icon/warning` | `color/warning/700` | `color/warning/400` |
| `icon/danger` | `color/danger/700` | `color/danger/400` |
| `icon/info` | `color/info/700` | `color/info/400` |
| `icon/on-brand` | `color/black` | `color/black` |
| `icon/on-accent` | `color/black` | `color/black` |
| `icon/on-success` | `color/black` | `color/white` |
| `icon/on-warning` | `color/black` | `color/white` |
| `icon/on-danger` | `color/white` | `color/white` |
| `icon/on-info` | `color/white` | `color/white` |

### 15.5 Border

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `border/default` | `color/neutral/200` | `color/neutral/800` |
| `border/subtle` | `color/neutral/100` | `color/neutral/900` |
| `border/muted` | `color/neutral/300` | `color/neutral/700` |
| `border/strong` | `color/neutral/950` | `color/white` |
| `border/inverse` | `color/white` | `color/neutral/950` |
| `border/disabled` | `color/neutral/200` | `color/neutral/800` |
| `border/focus` | `color/brand/500` | `color/brand/500` |
| `border/selected` | `color/brand/500` | `color/brand/500` |
| `border/brand` | `color/brand/500` | `color/brand/500` |
| `border/accent` | `color/accent/500` | `color/accent/500` |
| `border/success` | `color/success/500` | `color/success/500` |
| `border/warning` | `color/warning/500` | `color/warning/500` |
| `border/danger` | `color/danger/500` | `color/danger/500` |
| `border/info` | `color/info/500` | `color/info/500` |

### 15.6 State and static

| Token | Light mode alias | Dark mode alias |
|---|---|---|
| `state/hover` | `color/neutral/100` | `color/neutral/800` |
| `state/pressed` | `color/neutral/200` | `color/neutral/700` |
| `state/selected` | `color/brand/100` | `color/brand/900` |
| `state/focus-ring` | `color/brand/500` | `color/brand/500` |
| `state/drag` | `color/brand/200` | `color/brand/700` |
| `state/scrim` | `color/black` | `color/black` |
| `static/black` | `color/black` | `color/black` |
| `static/white` | `color/white` | `color/white` |
| `static/transparent` | `color/transparent` | `color/transparent` |

## 16. Semantic dimension tokens

All values alias `primitives.dimension`.

| Semantic token | Alias |
|---|---|
| `space/inset/none` | `size/0` |
| `space/inset/2xs` | `size/0-5` |
| `space/inset/xs` | `size/1` |
| `space/inset/sm` | `size/2` |
| `space/inset/md` | `size/3` |
| `space/inset/lg` | `size/4` |
| `space/inset/xl` | `size/6` |
| `space/inset/2xl` | `size/8` |
| `space/inset/3xl` | `size/14` |
| `space/stack/none` | `size/0` |
| `space/stack/2xs` | `size/0-5` |
| `space/stack/xs` | `size/1` |
| `space/stack/sm` | `size/2` |
| `space/stack/md` | `size/3` |
| `space/stack/lg` | `size/4` |
| `space/stack/xl` | `size/6` |
| `space/stack/2xl` | `size/8` |
| `space/stack/3xl` | `size/14` |
| `space/inline/none` | `size/0` |
| `space/inline/2xs` | `size/0-5` |
| `space/inline/xs` | `size/1` |
| `space/inline/sm` | `size/2` |
| `space/inline/md` | `size/3` |
| `space/inline/lg` | `size/4` |
| `space/inline/xl` | `size/6` |
| `space/inline/2xl` | `size/8` |
| `space/inline/3xl` | `size/14` |
| `space/section/xs` | `size/6` |
| `space/section/sm` | `size/8` |
| `space/section/md` | `size/14` |
| `space/section/lg` | `size/20` |
| `space/section/xl` | `size/24` |
| `space/section/2xl` | `size/32` |
| `space/section/3xl` | `size/32` |
| `component-size/control/xs` | `size/8` |
| `component-size/control/sm` | `size/10` |
| `component-size/control/md` | `size/12` |
| `component-size/control/lg` | `size/14` |
| `component-size/control/xl` | `size/16` |
| `component-size/icon/xs` | `size/3` |
| `component-size/icon/sm` | `size/4` |
| `component-size/icon/md` | `size/5` |
| `component-size/icon/lg` | `size/6` |
| `component-size/avatar/sm` | `size/8` |
| `component-size/avatar/md` | `size/10` |
| `component-size/avatar/lg` | `size/12` |

## 17. Semantic radius tokens

| Token | Default mode | Rounded mode | No-corner-radius mode |
|---|---|---|---|
| `radius/control/sm` | `radius/sm` | `radius-rounded/sm` | `radius-none/sm` |
| `radius/control/md` | `radius/md` | `radius-rounded/md` | `radius-none/md` |
| `radius/control/lg` | `radius/lg` | `radius-rounded/lg` | `radius-none/lg` |
| `radius/surface/sm` | `radius/sm` | `radius-rounded/md` | `radius-none/sm` |
| `radius/surface/md` | `radius/md` | `radius-rounded/lg` | `radius-none/md` |
| `radius/surface/lg` | `radius/lg` | `radius-rounded/xl` | `radius-none/lg` |
| `radius/overlay` | `radius/lg` | `radius-rounded/2xl` | `radius-none/lg` |
| `radius/pill` | `radius/pill` | `radius-rounded/pill` | `radius-none/pill` |
| `radius/focus-ring` | `radius/tight` | `radius-rounded/sm` | `radius-none/sm` |

Default mode is the source-aligned mode. Rounded and no-corner-radius modes exist for system testing and future theme switching.

## 18. Semantic typography tokens and local text styles

Every local text style must bind every supported property to semantic typography variables. Source-defined styles are marked as canonical.

| Style | Family | Weight | Size | Line height | Letter spacing | Transform | Source status |
|---|---|---:|---:|---:|---:|---|---|
| `display/lg` | Syne | 700 | 48 | 48 | `-0.02em` | Uppercase | Source-defined |
| `display/md` | Syne | 700 | 36 | 44 | `-0.02em` | Uppercase | Reversible extension |
| `display/sm` | Syne | 700 | 30 | 38 | `-0.02em` | Uppercase | Reversible extension |
| `heading/h1` | Syne | 700 | 48 | 56 | `-0.02em` | Uppercase | Reversible extension |
| `heading/h2` | Syne | 700 | 36 | 44 | `-0.02em` | Uppercase | Reversible extension |
| `heading/h3` | Syne | 700 | 30 | 38 | `-0.01em` | Uppercase | Reversible extension |
| `heading/h4` | Syne | 700 | 24 | 32 | `-0.01em` | Uppercase | Reversible extension |
| `heading/h5` | Syne | 700 | 20 | 28 | `0` | Uppercase | Reversible extension |
| `heading/h6` | Syne | 700 | 18 | 28 | `0` | Uppercase | Reversible extension |
| `title/lg` | Syne | 700 | 24 | 32 | `-0.01em` | Uppercase | Reversible extension |
| `title/md` | Syne | 700 | 20 | 28 | `0` | Uppercase | Reversible extension |
| `title/sm` | Syne | 700 | 18 | 28 | `0` | Uppercase | Reversible extension |
| `body/lg` | Inter | 400 | 16 | 24 | `0` | None | Reversible extension |
| `body/md` | Inter | 400 | 12 | 16 | `0.1em` | Uppercase | Source-defined |
| `body/sm` | Inter | 400 | 12 | 16 | `0` | None | Reversible extension |
| `label/lg` | Inter | 500 | 14 | 20 | `0.1em` | Uppercase | Reversible extension |
| `label/md` | Inter | 500 | 12 | 16 | `1.2px` | Uppercase | Source-defined |
| `label/sm` | Inter | 500 | 11 | 14 | `0.1em` | Uppercase | Reversible extension |
| `caption/md` | Inter | 400 | 12 | 16 | `0.1em` | Uppercase | Reversible extension |
| `caption/sm` | Inter | 400 | 11 | 14 | `0.1em` | Uppercase | Reversible extension |
| `code/md` | JetBrains Mono | 400 | 12 | 16 | `0` | None | Prompt default |
| `code/sm` | JetBrains Mono | 400 | 11 | 14 | `0` | None | Prompt default |

Typography usage:

- Use Syne only for display, heading, title, and expressive section labels.
- Use Inter for paragraphs, controls, metadata, navigation, forms, body copy, and interface text.
- Preserve uppercase treatment for source-defined display, body-md, label, caption, and button-like UI.
- Use non-uppercase body styles for longer readable case-study copy.

## 19. Semantic elevation tokens

### 19.1 Surface material

| Token | Light alias / recipe | Dark alias / recipe |
|---|---|---|
| `elevation/surface/flat` | `surface/bg/default`, `border/default`, `shadow/none` | `surface/bg/default`, `border/default`, `shadow/none` |
| `elevation/surface/raised` | `surface/bg/raised`, `border/default`, `shadow/sm` | `surface/bg/raised`, `border/default`, `shadow/sm` |
| `elevation/surface/sunken` | `surface/bg/subtle`, `border/subtle`, inner shadow if supported | `surface/bg/muted`, `border/subtle`, `shadow/md` |
| `elevation/surface/overlay` | `surface/bg/overlay`, `border/strong`, `shadow/lg` | `surface/bg/overlay`, `border/strong`, `shadow/lg` |

### 19.2 Shadow aliases

| Token | Alias |
|---|---|
| `elevation/shadow/none` | `shadow/none` |
| `elevation/shadow/xs` | `shadow/xs` |
| `elevation/shadow/sm` | `shadow/sm` |
| `elevation/shadow/md` | `shadow/md` |
| `elevation/shadow/lg` | `shadow/lg` |
| `elevation/shadow/xl` | `shadow/xl` |
| `elevation/shadow/focus` | `shadow/focus` |

### 19.3 Glass material recipe

Use this recipe for hero panels, cards, modals, and premium feature surfaces:

- Fill: `surface/bg/default` in dark mode.
- Border: `border/default`; use `border/brand` only for selected or highlighted states.
- Shadow: `elevation/shadow/lg` for major hero panels; `elevation/shadow/sm` or `md` for standard cards.
- Blur: `blur/glass = 4px`.
- Gradient shell: allowed as a wrapper treatment only after exact gradient stops are approved; until then, use semantic borders and glass shadows.

## 20. Semantic number tokens

| Token | Alias |
|---|---|
| `opacity/disabled` | `opacity/40` |
| `opacity/placeholder` | `opacity/60` |
| `opacity/scrim` | `opacity/70` |
| `opacity/drag` | `opacity/80` |
| `opacity/loading` | `opacity/60` |
| `stroke-width/default` | `stroke-width/1` |
| `stroke-width/strong` | `stroke-width/2` |
| `stroke-width/focus` | `stroke-width/2` |
| `stroke-width/divider` | `stroke-width/1` |

## 21. Semantic motion tokens

| Token | Default mode | Reduced-motion mode |
|---|---:|---:|
| `motion/duration/feedback` | `duration/faster` | `duration/instant` |
| `motion/duration/hover` | `duration/fast` | `duration/instant` |
| `motion/duration/transition` | `duration/normal` | `duration/instant` |
| `motion/duration/layout` | `duration/expressive` | `duration/fast` |
| `motion/duration/hero` | `duration/slower` | `duration/fast` |
| `motion/easing/default` | `easing/standard` | `easing/reduced` |
| `motion/easing/expressive` | `easing/expressive` | `easing/reduced` |

Motion rules:

- Use hover motion primarily for text, color, and border-color changes.
- Avoid large decorative movement unless it supports layout comprehension.
- Reduced-motion mode must remove non-essential transitions.
- Loading and progress states may retain short functional feedback.

---

# Accessibility

## 22. Contrast validation

| Pair | Ratio | Result | Usage |
|---|---:|---|---|
| `#FF4F18` on `#050505` | 6.20:1 | Pass | Primary text on dark glass |
| `#A3A3A3` on `#050505` | 8.08:1 | Pass | Secondary text on dark glass |
| `#050505` on `#FF4F18` | 6.20:1 | Pass | Text on brand surface |
| `#000000` on `#FF4F18` | 6.38:1 | Pass | `text/on-brand` |
| `#FFFFFF` on `#050505` | 20.38:1 | Pass | Inverse text on dark surface |
| `#FF4F18` on `#FFFFFF` | 3.29:1 | Warning | Large text or non-text only; not normal body text |
| `#6B5C43` on `#050505` | 3.14:1 | Warning | Decorative, border, or large-text only |
| `#FFFFFF` on `#6B5C43` | 6.49:1 | Pass | Text on tertiary surface |
| `#000000` on `#A08C6C` | 6.46:1 | Pass | Text on accent surface |

Accessibility rules:

- Normal text must meet at least 4.5:1.
- Large text and non-text UI indicators must meet at least 3:1.
- Do not rely on color alone for status communication.
- All focusable controls must have a visible focus state using `border/focus` or `state/focus-ring`.
- Disabled states must reduce emphasis without becoming unreadable.
- Errors require text, icon, and border/state treatment.
- Motion must support reduced-motion mode.

## 23. Iconography

| Property | Rule |
|---|---|
| Style | Linear |
| Set | Solar |
| Stroke | Use semantic icon tokens; default stroke width aliases `stroke-width/default` |
| Sizes | `icon/xs`, `icon/sm`, `icon/md`, `icon/lg` |
| Usage | Functional first; decorative icons must not carry unique meaning |
| Accessibility | Icon-only controls require accessible labels |
| Color | Use `icon/*`; never hardcode raw fills/strokes |

## 24. Layout and composition

### 24.1 Layout model

- Use flex composition by default.
- Preserve full-bleed framing for hero and portfolio surfaces.
- Use minimal grids; grids should structure content without becoming visible decoration.
- Dark glass panels should sit within or over brand-colored full-bleed frames.
- Keep spacing on the 4px rhythm except the documented 2px source gap.

### 24.2 Responsive behavior

| Breakpoint class | Behavior |
|---|---|
| Compact | Single-column stacks; preserve large touch targets and readable spacing |
| Medium | Two-column content where hierarchy is clear |
| Wide | Full-bleed sections with constrained inner content, feature cards, and split hero layouts |
| Extra-wide | Maintain content measure; do not stretch text lines unnecessarily |

### 24.3 Density

- Default UI density is compact-premium, not cramped.
- Cards use `24px` default padding and `32px` for high-emphasis panels.
- Section rhythm uses `24px`, `32px`, and `56px`.
- Micro-gaps of `2px` are allowed only for tight visual grouping, not content separation.

---

# Local styles

## 25. Required local text styles

Create these exact text styles:

```txt
display/lg
display/md
display/sm
heading/h1
heading/h2
heading/h3
heading/h4
heading/h5
heading/h6
title/lg
title/md
title/sm
body/lg
body/md
body/sm
label/lg
label/md
label/sm
caption/md
caption/sm
code/md
code/sm
```

Each style must bind every supported property to semantic typography variables and use `text/default` as the default fill where supported.

## 26. Required local effect styles

Create these as native Effect variables if possible. If not supported, create local Effect Styles.

```txt
elevation/shadow/none
elevation/shadow/xs
elevation/shadow/sm
elevation/shadow/md
elevation/shadow/lg
elevation/shadow/xl
elevation/shadow/focus
```

---

# Component system

## 27. Global component rules

1. Build components with semantic tokens only.
2. Do not create component-specific tokens in this phase.
3. Use auto-layout wherever practical.
4. Use component properties and variants; avoid combinatorial explosion.
5. Support light and dark previews.
6. Include states: default, hover, pressed, focus, disabled, loading where relevant.
7. Include accessibility notes beside each component.
8. Use semantic typography styles, not raw text properties.
9. Use Solar linear icons for icon slots.
10. Document React prop mapping for each component.

## 28. Component documentation frame template

Every component documentation frame must include:

| Field | Requirement |
|---|---|
| Component name | Exact slash name |
| Status | Beta unless verified stable |
| Purpose | What problem the component solves |
| Anatomy | Required and optional parts |
| Variants | Supported variant axes |
| States | Supported interaction and validation states |
| Interaction notes | Hover, press, focus, loading, dismiss, selection, or keyboard behavior |
| Accessibility notes | Labels, roles, keyboard support, focus, announcements |
| Token usage | Semantic color, type, spacing, radius, border, elevation, motion |
| React prop mapping | Recommended prop names and value enums |
| Do/don't | Practical usage examples where relevant |

## 29. Component inventory

### 29.1 Batch A - Core actions

#### `components/actions/button`

- **Status:** Beta
- **Purpose:** Primary and secondary user actions.
- **Source alignment:** Source-detected secondary button uses brand text, pill radius, 12px padding, and a subtle brand border.
- **Anatomy:** Root, label, optional leading icon, optional trailing icon, loading indicator.
- **Variants:** `primary`, `secondary`, `tertiary`, `ghost`, `danger`.
- **Sizes:** `sm`, `md`, `lg`.
- **States:** `default`, `hover`, `pressed`, `focus`, `disabled`, `loading`.
- **Icon axis:** `none`, `leading`, `trailing`, `icon-only` where applicable.
- **Token usage:** `surface/control/*`, `text/on-brand`, `text/brand`, `border/brand`, `space/inset/md`, `radius/pill`, `label/md`.
- **React props:** `variant`, `size`, `state`, `loading`, `disabled`, `iconLeading`, `iconTrailing`, `children`, `type`.
- **Accessibility:** Icon-only usage must be routed to Icon Button or include an accessible name. Loading state must expose progress or busy status when action duration is meaningful.
- **Do:** Use one primary action per decision area.
- **Don't:** Use multiple primary buttons in the same local action group.

#### `components/actions/icon-button`

- **Status:** Beta
- **Purpose:** Compact icon-only actions.
- **Anatomy:** Root, icon, optional badge/dot.
- **Variants:** `primary`, `secondary`, `ghost`, `danger`.
- **Sizes:** `sm`, `md`, `lg`.
- **States:** `default`, `hover`, `pressed`, `focus`, `disabled`, `loading`.
- **Token usage:** `component-size/control/*`, `component-size/icon/*`, `radius/control/md`, `icon/*`, `border/*`.
- **React props:** `variant`, `size`, `ariaLabel`, `icon`, `disabled`, `loading`.
- **Accessibility:** Requires `aria-label`. Focus ring must be visible. Do not use for actions that need explanatory labels.

#### `components/actions/button-group`

- **Status:** Beta
- **Purpose:** Groups related actions or segmented action choices.
- **Anatomy:** Container, Button children, optional divider.
- **Variants:** `horizontal`, `vertical`; `attached`, `separated`.
- **States:** Inherited from Button.
- **Token usage:** `space/inline/2xs`, `space/stack/2xs`, `radius/control/*`, `border/default`.
- **React props:** `orientation`, `attached`, `children`.
- **Accessibility:** Preserve tab order. If used as exclusive selection, apply radiogroup or tab semantics instead of generic buttons.

#### `components/actions/link`

- **Status:** Beta
- **Purpose:** Navigational or inline text actions.
- **Source alignment:** Source-detected link uses muted text, no radius, no padding, and no border.
- **Anatomy:** Text, optional trailing icon.
- **Variants:** `default`, `muted`, `brand`, `inverse`.
- **States:** `default`, `hover`, `focus`, `visited`, `disabled`.
- **Token usage:** `text/link`, `text/link-hover`, `text/muted`, `radius/control/sm`, `body/md` or `label/md`.
- **React props:** `href`, `variant`, `external`, `disabled`, `children`.
- **Accessibility:** Links navigate; buttons perform actions. External links must be communicated where relevant.

### 29.2 Batch B - Form controls

#### `components/forms/form-field`

- **Status:** Beta
- **Purpose:** Standard wrapper for labels, controls, helper text, and validation.
- **Anatomy:** Label, required marker, control slot, helper text, error/success message.
- **Variants:** `default`, `error`, `success`, `disabled`, `read-only`.
- **States:** Mirrors child control.
- **Token usage:** `space/stack/xs`, `label/md`, `caption/md`, `text/danger`, `text/success`.
- **React props:** `label`, `helperText`, `error`, `success`, `required`, `disabled`, `readOnly`, `children`.
- **Accessibility:** Label must be programmatically associated with the control.

#### `components/forms/text-field`

- **Status:** Beta
- **Purpose:** Single-line text input.
- **Anatomy:** Root, input, optional leading icon, optional trailing action, placeholder.
- **Variants:** `default`, `filled`, `error`, `success`, `read-only`.
- **States:** `default`, `hover`, `focus`, `filled`, `disabled`, `error`, `success`, `read-only`.
- **Token usage:** `surface/control/default`, `border/default`, `border/focus`, `text/default`, `text/disabled`, `space/inset/md`, `radius/control/md`.
- **React props:** `value`, `defaultValue`, `placeholder`, `type`, `disabled`, `readOnly`, `invalid`, `success`, `iconLeading`, `actionTrailing`.
- **Accessibility:** Use visible labels. Placeholder is not a label. Error text must be referenced with `aria-describedby`.

#### `components/forms/text-area`

- **Status:** Beta
- **Purpose:** Multi-line text entry.
- **Anatomy:** Root, textarea, optional counter.
- **Variants:** `default`, `error`, `success`, `read-only`.
- **States:** Same as Text Field.
- **Token usage:** Same as Text Field; vertical padding may use `space/inset/lg`.
- **React props:** `value`, `rows`, `maxLength`, `resize`, `disabled`, `readOnly`, `invalid`.
- **Accessibility:** Keep labels visible and allow sufficient resizing or line count for long input.

#### `components/forms/select`

- **Status:** Beta
- **Purpose:** Selection from predefined options.
- **Anatomy:** Trigger, selected value, chevron icon, menu/listbox.
- **Variants:** `default`, `error`, `success`, `read-only`.
- **States:** `default`, `hover`, `focus`, `open`, `disabled`, `error`, `success`.
- **Token usage:** Text Field tokens plus `icon/muted`, `surface/bg/overlay`.
- **React props:** `value`, `options`, `placeholder`, `disabled`, `invalid`, `onChange`.
- **Accessibility:** Use native select where practical. Custom select requires correct combobox/listbox keyboard behavior.

#### `components/forms/search-field`

- **Status:** Beta
- **Purpose:** Search query entry.
- **Anatomy:** Search icon, input, clear button, optional submit.
- **Variants:** `default`, `compact`, `expanded`.
- **States:** Text Field states plus `loading`.
- **Token usage:** Text Field tokens, `icon/muted`, `motion/duration/hover`.
- **React props:** `value`, `placeholder`, `onSearch`, `onClear`, `loading`.
- **Accessibility:** Clear button needs accessible name; search region should be labelled where relevant.

#### `components/forms/checkbox`

- **Status:** Beta
- **Purpose:** Multi-select binary option.
- **Anatomy:** Box, check icon, label, helper text.
- **Variants:** `default`, `error`.
- **States:** `unchecked`, `checked`, `indeterminate`, `hover`, `focus`, `disabled`, `error`.
- **Token usage:** `surface/control/default`, `surface/control/brand`, `icon/on-brand`, `border/default`, `radius/control/sm`.
- **React props:** `checked`, `indeterminate`, `disabled`, `invalid`, `label`.
- **Accessibility:** Use native checkbox semantics; indeterminate state must be programmatically set.

#### `components/forms/radio`

- **Status:** Beta
- **Purpose:** Single selection within a related group.
- **Anatomy:** Circle, selection dot, label, helper text.
- **Variants:** `default`, `error`.
- **States:** `unchecked`, `checked`, `hover`, `focus`, `disabled`, `error`.
- **Token usage:** Checkbox-like tokens, `radius/pill`.
- **React props:** `checked`, `name`, `value`, `disabled`, `invalid`, `label`.
- **Accessibility:** Use radiogroup semantics and arrow-key navigation where custom.

#### `components/forms/switch`

- **Status:** Beta
- **Purpose:** Immediate binary setting toggle.
- **Anatomy:** Track, thumb, optional label.
- **Variants:** `default`, `compact`.
- **States:** `off`, `on`, `hover`, `focus`, `disabled`.
- **Token usage:** `surface/control/default`, `surface/control/brand`, `radius/pill`, `motion/duration/hover`.
- **React props:** `checked`, `disabled`, `label`, `onChange`.
- **Accessibility:** Use switch role only for immediate settings; otherwise use checkbox.

#### `components/forms/slider`

- **Status:** Beta
- **Purpose:** Adjust a numeric value across a bounded range.
- **Anatomy:** Track, filled track, thumb, optional marks, value label.
- **Variants:** `single`, `range`.
- **States:** `default`, `hover`, `focus`, `dragging`, `disabled`.
- **Token usage:** `surface/control/default`, `surface/control/brand`, `radius/pill`, `component-size/*`.
- **React props:** `value`, `min`, `max`, `step`, `disabled`, `marks`.
- **Accessibility:** Keyboard interaction and value text are required.

### 29.3 Batch C - Feedback and status

#### `components/feedback/badge`

- **Status:** Beta
- **Purpose:** Short status or count indicator.
- **Anatomy:** Container, text, optional icon.
- **Variants:** `neutral`, `brand`, `accent`, `success`, `warning`, `danger`, `info`.
- **States:** Static.
- **Token usage:** `surface/bg/*-subtle`, `text/*`, `radius/pill`, `label/sm`.
- **React props:** `tone`, `size`, `icon`, `children`.
- **Accessibility:** Do not communicate status through color alone.

#### `components/feedback/tag`

- **Status:** Beta
- **Purpose:** User-applied or system-applied categorization.
- **Anatomy:** Label, optional leading icon, optional dismiss button.
- **Variants:** Same tones as Badge; `dismissible`.
- **States:** `default`, `hover`, `focus`, `disabled`.
- **Token usage:** Badge tokens plus Icon Button for dismiss.
- **React props:** `tone`, `dismissible`, `onDismiss`, `children`.
- **Accessibility:** Dismiss action needs label.

#### `components/feedback/alert`

- **Status:** Beta
- **Purpose:** Inline system message.
- **Anatomy:** Icon, title, body, optional actions, dismiss.
- **Variants:** `info`, `success`, `warning`, `danger`, `brand`.
- **States:** Static, dismissible.
- **Token usage:** `surface/bg/*-subtle`, `border/*`, `text/*`, `icon/*`, `space/inset/xl`.
- **React props:** `tone`, `title`, `children`, `actions`, `dismissible`.
- **Accessibility:** Urgent danger alerts may use assertive announcements; otherwise use polite.

#### `components/feedback/toast`

- **Status:** Beta
- **Purpose:** Temporary notification for background outcomes.
- **Anatomy:** Container, icon, message, optional action, close.
- **Variants:** `info`, `success`, `warning`, `danger`.
- **States:** `entering`, `visible`, `exiting`.
- **Token usage:** `surface/bg/overlay`, `elevation/shadow/lg`, `motion/*`, `z-index/toast`.
- **React props:** `tone`, `duration`, `action`, `onClose`.
- **Accessibility:** Announce politely unless urgent; keep actions keyboard reachable.

#### `components/feedback/progress-bar`

- **Status:** Beta
- **Purpose:** Progress through a known process.
- **Anatomy:** Track, fill, optional label, optional value.
- **Variants:** `determinate`, `indeterminate`.
- **States:** `default`, `success`, `warning`, `danger`.
- **Token usage:** `surface/control/default`, `surface/control/brand`, `radius/pill`.
- **React props:** `value`, `max`, `indeterminate`, `label`.
- **Accessibility:** Expose `aria-valuenow`, `aria-valuemin`, `aria-valuemax` where determinate.

#### `components/feedback/spinner`

- **Status:** Beta
- **Purpose:** Short loading state where progress is unknown.
- **Anatomy:** Circular indicator, optional label.
- **Variants:** `brand`, `neutral`, `inverse`.
- **States:** Loading only.
- **Token usage:** `icon/brand`, `motion/duration/transition`.
- **React props:** `size`, `tone`, `label`.
- **Accessibility:** Include accessible loading text when spinner is the only feedback.

#### `components/feedback/skeleton`

- **Status:** Beta
- **Purpose:** Loading placeholder for content structure.
- **Anatomy:** Placeholder blocks, optional shimmer.
- **Variants:** `text`, `avatar`, `card`, `table-row`.
- **States:** Loading.
- **Token usage:** `surface/bg/muted`, `radius/surface/*`, `motion/duration/slow`.
- **React props:** `variant`, `lines`, `width`, `height`.
- **Accessibility:** Hide decorative skeletons from screen readers; announce loading at parent level.

#### `components/feedback/empty-state`

- **Status:** Beta
- **Purpose:** Explain empty content and provide next action.
- **Anatomy:** Icon/illustrative slot, title, body, primary action, secondary action.
- **Variants:** `neutral`, `search`, `error`, `permission`.
- **States:** Static.
- **Token usage:** `surface/bg/default`, `text/default`, `text/muted`, Button.
- **React props:** `icon`, `title`, `description`, `primaryAction`, `secondaryAction`.
- **Accessibility:** Keep message actionable and avoid blame.

### 29.4 Batch D - Navigation

#### `components/navigation/tabs`

- **Status:** Beta
- **Purpose:** Switch between related views at the same hierarchy level.
- **Anatomy:** Tab list, tab, active indicator, panel.
- **Variants:** `underline`, `pill`, `contained`.
- **States:** `default`, `hover`, `selected`, `focus`, `disabled`.
- **Token usage:** `border/brand`, `text/brand`, `space/inline/*`, `motion/duration/hover`.
- **React props:** `value`, `items`, `orientation`, `onChange`.
- **Accessibility:** Use tablist, tab, tabpanel roles with keyboard navigation.

#### `components/navigation/breadcrumbs`

- **Status:** Beta
- **Purpose:** Show hierarchy and allow upward navigation.
- **Anatomy:** Link items, separators, current page.
- **Variants:** `default`, `compact`.
- **States:** Link states.
- **Token usage:** `text/muted`, `text/default`, `icon/subtle`.
- **React props:** `items`, `maxItems`.
- **Accessibility:** Mark current page with `aria-current="page"`.

#### `components/navigation/pagination`

- **Status:** Beta
- **Purpose:** Navigate paged datasets.
- **Anatomy:** Previous, page item, ellipsis, next.
- **Variants:** `numbers`, `compact`.
- **States:** `default`, `hover`, `selected`, `focus`, `disabled`.
- **Token usage:** Button/Icon Button tokens.
- **React props:** `page`, `pageCount`, `onChange`.
- **Accessibility:** Labels must identify page numbers and current page.

#### `components/navigation/side-navigation`

- **Status:** Beta
- **Purpose:** Persistent product or portfolio navigation.
- **Anatomy:** Container, section labels, menu items, nested items.
- **Variants:** `expanded`, `collapsed`.
- **States:** Menu Item states.
- **Token usage:** `surface/bg/default`, `border/default`, `space/inset/*`.
- **React props:** `items`, `collapsed`, `activeId`.
- **Accessibility:** Maintain logical heading and navigation landmarks.

#### `components/navigation/top-navigation`

- **Status:** Beta
- **Purpose:** Primary app/site navigation and brand area.
- **Anatomy:** Brand slot, nav items, actions, responsive menu trigger.
- **Variants:** `transparent`, `solid`, `glass`.
- **States:** Link and Button states.
- **Token usage:** `surface/bg/default`, `elevation/surface/raised`, `space/inset/xl`.
- **React props:** `brand`, `items`, `actions`, `responsive`.
- **Accessibility:** Use nav landmark and visible focus order.

#### `components/navigation/menu-item`

- **Status:** Beta
- **Purpose:** Reusable navigation row in menus, side nav, dropdowns.
- **Anatomy:** Leading icon, label, meta, trailing icon/badge.
- **Variants:** `default`, `selected`, `danger`.
- **States:** `default`, `hover`, `pressed`, `focus`, `disabled`, `selected`.
- **Token usage:** `surface/control/*`, `text/*`, `icon/*`, `radius/control/md`.
- **React props:** `selected`, `disabled`, `tone`, `icon`, `meta`, `children`.
- **Accessibility:** Use correct role based on parent: menuitem, option, tab, link, or button.

### 29.5 Batch E - Overlays

#### `components/overlays/tooltip`

- **Status:** Beta
- **Purpose:** Brief supplemental explanation.
- **Anatomy:** Trigger, floating panel, optional arrow.
- **Variants:** `default`, `inverse`.
- **States:** `hidden`, `visible`.
- **Token usage:** `surface/bg/overlay`, `text/inverse`, `radius/overlay`, `elevation/shadow/md`, `z-index/tooltip`.
- **React props:** `content`, `placement`, `delay`.
- **Accessibility:** Tooltip content must be available to keyboard and screen-reader users.

#### `components/overlays/popover`

- **Status:** Beta
- **Purpose:** Small contextual surface with interactive content.
- **Anatomy:** Trigger, panel, optional title, content, actions.
- **Variants:** `default`, `glass`.
- **States:** `closed`, `open`.
- **Token usage:** `surface/bg/overlay`, `border/default`, `elevation/shadow/lg`, `z-index/popover`.
- **React props:** `open`, `placement`, `onOpenChange`, `children`.
- **Accessibility:** Manage focus when interactive; escape closes.

#### `components/overlays/dropdown-menu`

- **Status:** Beta
- **Purpose:** Command or selection menu.
- **Anatomy:** Trigger, menu, menu items, separators, groups.
- **Variants:** `default`, `checkbox`, `radio`.
- **States:** `closed`, `open`; item states.
- **Token usage:** Popover tokens plus Menu Item.
- **React props:** `items`, `open`, `onSelect`, `placement`.
- **Accessibility:** Use menu semantics only for command menus, not general navigation lists.

#### `components/overlays/modal`

- **Status:** Beta
- **Purpose:** Interruptive focused task or confirmation.
- **Anatomy:** Scrim, dialog, header, body, footer, close button.
- **Variants:** `default`, `danger`, `confirmation`.
- **States:** `closed`, `open`, `loading`.
- **Token usage:** `state/scrim`, `surface/bg/overlay`, `radius/overlay`, `elevation/shadow/lg`, `z-index/modal`.
- **React props:** `open`, `title`, `description`, `actions`, `onClose`.
- **Accessibility:** Trap focus, label dialog, close with escape unless destructive flow requires explicit choice.

#### `components/overlays/drawer`

- **Status:** Beta
- **Purpose:** Secondary panel for navigation, filters, or detail views.
- **Anatomy:** Scrim, panel, header, body, footer.
- **Variants:** `left`, `right`, `bottom`.
- **States:** `closed`, `open`.
- **Token usage:** Modal tokens, `motion/duration/layout`.
- **React props:** `open`, `side`, `size`, `onClose`.
- **Accessibility:** Manage focus and restore focus to trigger on close.

### 29.6 Batch F - Data display and layout

#### `components/data/card`

- **Status:** Beta
- **Purpose:** Group related content or actions.
- **Source alignment:** Glass surface, subtle border, shadow/blur reinforcement, tight radius.
- **Anatomy:** Container, optional media, header, body, footer/actions.
- **Variants:** `flat`, `raised`, `glass`, `interactive`.
- **States:** `default`, `hover`, `focus`, `selected`, `disabled`.
- **Token usage:** `surface/bg/default`, `border/default`, `elevation/surface/*`, `space/inset/xl`, `radius/surface/md`.
- **React props:** `variant`, `interactive`, `selected`, `children`.
- **Accessibility:** Interactive cards require clear role and keyboard behavior.

#### `components/data/avatar`

- **Status:** Beta
- **Purpose:** Represent a person, brand, or entity.
- **Anatomy:** Image, initials, fallback icon, optional status.
- **Variants:** `image`, `initials`, `icon`.
- **Sizes:** `sm`, `md`, `lg`.
- **States:** Static.
- **Token usage:** `component-size/avatar/*`, `radius/pill`, `surface/bg/muted`, `text/default`.
- **React props:** `src`, `alt`, `name`, `size`, `status`.
- **Accessibility:** Image avatar needs meaningful alt when identity matters; decorative avatar can be hidden.

#### `components/data/list-item`

- **Status:** Beta
- **Purpose:** Structured row for navigation, selection, or display.
- **Anatomy:** Leading slot, content, meta, trailing action.
- **Variants:** `default`, `interactive`, `selected`.
- **States:** `default`, `hover`, `pressed`, `focus`, `disabled`, `selected`.
- **Token usage:** `space/inset/lg`, `border/subtle`, `text/default`, `text/muted`.
- **React props:** `leading`, `title`, `description`, `meta`, `trailing`, `selected`.
- **Accessibility:** Role depends on usage: listitem, link, button, option.

#### `components/data/table`

- **Status:** Beta
- **Purpose:** Dense structured data display.
- **Anatomy:** Header, row, cell, sort control, selection, pagination slot.
- **Variants:** `default`, `compact`, `selectable`, `sortable`.
- **States:** `default`, `hover`, `selected`, `loading`, `empty`.
- **Token usage:** `border/subtle`, `surface/bg/default`, `body/sm`, `label/sm`.
- **React props:** `columns`, `rows`, `sort`, `selection`, `loading`, `emptyState`.
- **Accessibility:** Use table semantics for tabular data; sortable headers require sort state announcement.

#### `components/data/page-header`

- **Status:** Beta
- **Purpose:** Page-level title, context, and primary actions.
- **Anatomy:** Eyebrow, title, description, metadata, actions.
- **Variants:** `default`, `with-tabs`, `with-breadcrumbs`.
- **States:** Static.
- **Token usage:** `heading/h1`, `body/lg`, `space/stack/*`, Button.
- **React props:** `title`, `description`, `eyebrow`, `actions`, `breadcrumbs`.
- **Accessibility:** One `h1` per page.

#### `components/data/section-header`

- **Status:** Beta
- **Purpose:** Introduce a section within a page or card.
- **Anatomy:** Title, optional description, optional action.
- **Variants:** `default`, `compact`.
- **States:** Static.
- **Token usage:** `heading/h3` or `title/lg`, `body/md`, `space/stack/xs`.
- **React props:** `title`, `description`, `action`.
- **Accessibility:** Preserve heading hierarchy.

#### `components/data/divider`

- **Status:** Beta
- **Purpose:** Separate content groups.
- **Anatomy:** Line, optional label.
- **Variants:** `horizontal`, `vertical`, `labelled`.
- **States:** Static.
- **Token usage:** `border/subtle`, `stroke-width/divider`, `text/muted`.
- **React props:** `orientation`, `label`.
- **Accessibility:** Decorative dividers should be hidden from assistive tech.

---

# Patterns

## 30. Required patterns

| Pattern | When to use | When not to use | Components | Accessibility | Responsive behavior | Content guidance |
|---|---|---|---|---|---|---|
| Authentication form | Login, signup, account access | Long multi-step onboarding | Form Field, Text Field, Button, Alert, Link | Visible labels, error summaries, password manager support | Single column on all sizes | Clear action text; avoid vague errors |
| Settings form | User preferences and profile settings | One-off transactional flows | Form Field, Text Field, Select, Switch, Button Group | Associate labels and helper text | Two columns may collapse to one | Explain irreversible or global settings |
| Data table with filters | Searchable datasets | Small lists under 6 items | Table, Search Field, Select, Pagination, Badge | Sort state, filter labels, keyboard access | Filters stack above table on compact | Show active filters and empty state |
| Empty state | No available content | Error or loading state | Empty State, Button, Card | Non-color-only meaning | Centered or card-contained | Explain why empty and what to do next |
| Error state | Recoverable failure | Validation errors in single fields | Alert, Button, Card, Page Header | Clear recovery path, no blame | Preserve action visibility | State what happened and next step |
| Loading state | Async content loading | Long unknown delays without feedback | Skeleton, Spinner, Progress Bar | Announce loading at parent level | Match eventual layout | Avoid fake progress unless determinate |
| Confirmation modal | Destructive or important confirmation | Routine actions with undo | Modal, Button, Alert | Focus trap, labelled dialog | Full-screen drawer alternative on compact | Button labels must name the action |
| Dashboard shell | Overview of multiple content groups | Linear content pages | Top Nav, Side Nav, Card, Table, Toast | Landmarks and skip paths | Side nav collapses; cards stack | Prioritize primary metric/action |
| Detail page layout | Object, case study, or record detail | Dense data editing | Page Header, Card, Section Header, List Item | Heading order and link clarity | Metadata stacks under title | Lead with object identity and status |
| Navigation layout | Product/site navigation | Single-page microsite with no hierarchy | Top Nav, Side Nav, Menu Item, Breadcrumbs | Current page state, nav landmarks | Top nav becomes drawer/menu | Keep labels short and predictable |
| Toast notification flow | Post-action feedback | Critical blocking errors | Toast, Button, Alert | Polite/urgent live-region strategy | Bottom or top stack; avoid overlap | Short message, optional undo |
| Form validation flow | Field and form-level validation | Non-input feedback | Form Field, Text Field, Select, Alert, Button | Field errors linked by `aria-describedby` | Error summaries above form on compact | Explain fix, not just problem |

---

# Developer handoff

## 31. CSS custom-property model

Primitive tokens may contain raw values. Semantic tokens alias primitives.

```css
:root {
  /* primitives */
  --color-brand-500: #ff4f18;
  --color-accent-500: #a08c6c;
  --color-neutral-950: #050505;
  --color-neutral-800: #262626;
  --color-neutral-400: #a3a3a3;
  --color-black: #000000;
  --color-white: #ffffff;

  /* light semantic aliases */
  --surface-bg-canvas: var(--color-neutral-50);
  --surface-bg-default: var(--color-white);
  --surface-bg-brand: var(--color-brand-500);
  --text-default: var(--color-neutral-950);
  --text-muted: var(--color-neutral-600);
  --text-brand: var(--color-brand-700);
  --text-on-brand: var(--color-black);
  --border-default: var(--color-neutral-200);
  --border-focus: var(--color-brand-500);

  /* dimensions */
  --space-inset-md: var(--size-3);
  --space-inset-xl: var(--size-6);
  --radius-control-md: var(--radius-md);
  --radius-pill: 9999px;
}

[data-theme="dark"] {
  --surface-bg-canvas: var(--color-brand-500);
  --surface-bg-default: var(--color-neutral-950);
  --surface-bg-subtle: var(--color-neutral-900);
  --surface-bg-muted: var(--color-neutral-800);
  --text-default: var(--color-brand-500);
  --text-muted: var(--color-neutral-400);
  --text-on-brand: var(--color-black);
  --border-default: var(--color-neutral-800);
  --border-focus: var(--color-brand-500);
}

[data-radius="rounded"] {
  --radius-control-md: var(--radius-rounded-md);
  --radius-surface-md: var(--radius-rounded-lg);
}

[data-radius="no-corner-radius"] {
  --radius-control-md: var(--radius-none-md);
  --radius-surface-md: var(--radius-none-md);
}
```

## 32. DTCG-style token export model

```json
{
  "color": {
    "brand": {
      "500": {
        "$type": "color",
        "$value": "#FF4F18"
      }
    },
    "neutral": {
      "950": {
        "$type": "color",
        "$value": "#050505"
      }
    }
  },
  "surface": {
    "bg": {
      "default": {
        "$type": "color",
        "$value": "{color.white}"
      }
    }
  },
  "text": {
    "default": {
      "$type": "color",
      "$value": "{color.neutral.950}"
    }
  },
  "space": {
    "inset": {
      "md": {
        "$type": "dimension",
        "$value": "{size.3}"
      }
    }
  }
}
```

## 33. React usage rules

Use semantic tokens in application code. Do not consume primitive tokens directly except in low-level theme construction.

```tsx
type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  iconLeading,
  iconTrailing,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {iconLeading}
      <span>{children}</span>
      {iconTrailing}
    </button>
  );
}
```

```css
button[data-variant="secondary"] {
  color: var(--text-brand);
  background: transparent;
  border: var(--stroke-width-default) solid var(--border-brand);
  border-radius: var(--radius-pill);
  padding: var(--space-inset-md);
  font: var(--label-md);
}

button[data-variant="primary"] {
  color: var(--text-on-brand);
  background: var(--surface-control-brand);
  border: var(--stroke-width-default) solid var(--border-brand);
  border-radius: var(--radius-pill);
}
```

---

# Governance

## 34. System principles

- Accessible by default
- Semantic before specific
- Tokens over raw values
- Composition over duplication
- Predictable slash naming
- Documented decisions
- Code/design parity
- Source-aligned visual restraint
- No component-specific tokens until the governed expansion phase

## 35. Contribution model

| Stage | Requirement |
|---|---|
| Propose | State user need, component/token impact, accessibility impact |
| Review | Design-system owner reviews naming, scope, and source alignment |
| Design QA | Check Figma variables, variants, states, auto-layout, page docs |
| Accessibility QA | Check contrast, focus, keyboard, screen-reader behavior |
| Engineering QA | Check token export, React props, CSS variables, state behavior |
| Release | Version, changelog, migration notes, deprecation if needed |

## 36. Component status model

| Status | Meaning |
|---|---|
| Experimental | Exploratory; not stable for product-wide reuse |
| Beta | Usable, documented, but may evolve |
| Stable | Approved for broad use; breaking changes require migration |
| Deprecated | Replaced or scheduled for removal; migration path required |

All starter kit components in this document are **Beta** until Figma implementation and QA are complete.

## 37. Versioning

Use semantic versioning:

| Change type | Version impact |
|---|---|
| Documentation clarification | Patch |
| New non-breaking token/component | Minor |
| Visual change that preserves API | Minor or major depending on user impact |
| Token rename/removal | Major |
| Component prop removal | Major |
| Accessibility fix | Patch unless it changes public API |

Maintain a changelog with date, author, change type, affected tokens/components, migration notes, and QA status.

## 38. Naming rules

- Use slash naming in Figma.
- Use CSS custom-property conversion in code.
- Name semantic tokens by purpose, not appearance.
- Avoid names like `orange-button`, `black-card`, or `big-shadow`.
- Use `brand`, `accent`, `neutral`, and feedback terms consistently.
- Component paths use category-based naming, such as `components/actions/button`.

## 39. Token usage rules

1. Primitive tokens are reference values.
2. Semantic tokens are the default product UI contract.
3. Components consume semantic tokens only.
4. Component-specific tokens are reserved for a future governed phase.
5. Raw values are exceptions only and must be documented on `12 System QA`.
6. Typography styles must bind every supported property to variables.
7. Shadow tokens must use native Effect variables or local Effect Styles, not strings.
8. Motion tokens may be code-only if Figma binding is unsupported.

---

# QA

## 40. System QA summary

This QA table verifies the document-level specification. Figma implementation checks remain warnings until the target Figma file is inspected and built.

| # | Item | Status | Notes | Recommended follow-up |
|---:|---|---|---|---|
| 1 | File audit completed | Warning | Source documents inspected; target Figma file not provided. | Run MCP preflight in the target file. |
| 2 | Required pages exist | Warning | Required pages specified, not created. | Create pages in Figma. |
| 3 | Required primitive collections exist | Warning | Collections specified, not created. | Create variables through MCP. |
| 4 | Required semantic collections exist | Warning | Collections specified, not created. | Create semantic variables through MCP. |
| 5 | Required modes exist with exact names | Warning | Modes specified. | Verify mode creation in Figma. |
| 6 | Variables use slash naming | Pass | This document uses slash naming throughout. | Enforce in MCP build. |
| 7 | WEB code syntax metadata exists where supported | Warning | CSS names specified. | Set metadata during Figma variable creation. |
| 8 | Semantic variables alias primitive IDs | Warning | Alias mapping specified. | Verify actual variable ID aliasing in Figma. |
| 9 | No semantic color tokens use raw hex where aliasing is possible | Pass | Semantic color tables use aliases only. | Verify implementation. |
| 10 | No semantic dimension/radius/number tokens use raw values where aliasing is possible | Pass | Semantic tables use aliases only. | Verify implementation. |
| 11 | Dark mode uses intentional ramp inversion | Pass | Dark mode maps to brand canvas and near-black glass surfaces. | Validate visually. |
| 12 | On-color text/icon tokens pass WCAG 2.2 AA contrast | Warning | Key source pairs checked; full ramp matrix not exhaustively tested. | Run automated contrast matrix. |
| 13 | Text styles exist with exact names | Warning | Names specified, not created. | Create local text styles. |
| 14 | Text styles bind to semantic typography variables where supported | Warning | Binding rule specified. | Verify style property bindings. |
| 15 | No text style is partially connected where binding is supported | Warning | Cannot verify without Figma. | Inspect each style binding. |
| 16 | Dimension scoping separates padding from gaps where supported | Warning | Scope intent specified. | Apply narrowest MCP-supported scopes. |
| 17 | Radius tokens are scoped to corner radius | Warning | Scope intent specified. | Verify scopes. |
| 18 | Opacity tokens are scoped to opacity | Warning | Scope intent specified. | Verify scopes. |
| 19 | Stroke-width tokens are scoped to stroke width | Warning | Scope intent specified. | Verify scopes. |
| 20 | Shadow tokens use native Effect variables or Effect Styles, not strings | Warning | Correct fallback specified. | Confirm Figma support and create effects. |
| 21 | Component kit exists | Warning | Component kit specified, not built. | Build all component batches. |
| 22 | Components use semantic tokens | Pass | Component specs reference semantic tokens. | Verify no raw values in Figma. |
| 23 | Components include documented states | Pass | States documented by component. | Verify variants. |
| 24 | Components include accessibility notes | Pass | Accessibility notes included by component. | Validate implementation behavior. |
| 25 | Patterns use system components | Pass | Pattern dependencies use system components. | Build pattern frames. |
| 26 | Developer handoff exists | Pass | CSS, DTCG, and React examples included. | Sync with engineering export format. |
| 27 | Governance documentation exists | Pass | Contribution, status, versioning, naming, and token rules included. | Assign owners. |
| 28 | Known MCP/Figma limitations documented honestly | Pass | Missing Figma audit, gradient ambiguity, motion ambiguity, and effect fallback noted. | Update after MCP run. |

## 41. Implementation sequence

1. Run `00 System audit`.
2. Create primitive collections.
3. Create semantic collections and modes.
4. Apply variable scopes.
5. Create local text and effect styles.
6. Build foundation preview pages.
7. Build components in batches A-F.
8. Build required patterns.
9. Add developer handoff and governance.
10. Run final System QA.
11. Update this document with verified Figma outcomes.

## 42. Changelog

| Version | Date | Change |
|---|---|---|
| `alpha.1` | 2026-05-26 | Initial complete design-system specification generated from the premium Syne/Inter source and complete Figma MCP prompt. |

## 43. Final verification

- Markdown structure is valid.
- Source hierarchy is explicit.
- Missing or ambiguous context is documented.
- Reversible assumptions are labelled.
- Primitive and semantic token layers are separated.
- Semantic tokens alias primitives.
- Component-specific tokens are excluded.
- Required Figma pages are specified.
- Required component batches are covered.
- Required patterns are covered.
- Developer handoff is included.
- Governance is included.
- QA is included with honest Figma verification warnings.

Design system foundation, documentation, starter components, patterns, and QA are complete.
