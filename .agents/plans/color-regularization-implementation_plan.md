  # Gem Tone Color Scale — Final Implementation Plan

## Status: ALL DECISIONS LOCKED ✅

---

## What We're Building

**File 1: `colors-tw.css`** — 108 CSS custom properties (12 gem tones × 9 stops) in Tailwind v4 `@theme {}`, using a perceptually-uniform, WCAG-anchored OKLCH lightness ladder. P3 gamut primary, sRGB fallback via `@supports`.

**File 2: A mapping reference comment block** embedded in `colors-tw.css` — shows which scale stop maps to which semantic role (`--color-primary`, `--color-primary-fill`, `--color-text`, etc.), with computed WCAG contrast ratios for both modes.

---

## All Decisions, Locked

| Decision | Answer |
|---|---|
| **Scope** | All 12 gem tones (ruby, emerald, gold, aquamarine, amethyst, sapphire, steel, onyx, cobalt, bronze, topaz, jade) |
| **Neutrals** | Single-stop only — no scale for snow/ebon/charcoal |
| **Naming** | `--color-ruby-500` → TW v4 auto-generates `bg-ruby-500`, `text-ruby-500` |
| **Wrapper** | `@theme {}` (Tailwind v4) |
| **File path** | `d:\dev\ascent\themes\embrace\assets\css\colors-tw.css` |
| **Method** | Hybrid — fixed OKLCH L ladder (contrast-correct), originals unchanged in `colors.css` |
| **WCAG output** | **Both** AA and AAA targets, side by side in comments |
| **Light-end chroma** | Recognizable tint preserved at 100/200 stops |
| **Gamut** | P3 primary; `@supports (color: oklch(0% 0.3 0))` guard with sRGB-clamped fallbacks |
| **Old theme files** | `old-recharge/refresh/release.css` deprecated — excluded |

---

## Reference Surface (Dorothy Theme)

The contrast math will be anchored against the actual rendered background, which is:

```css
/* From main.css — applied to html element */
background-image:
  url('/svg/bg-mesh.svg'),                                          /* Layer 1: repeating mesh */
  linear-gradient(in oklch to bottom,
    var(--color-background) 50%,                                   /* Layer 2: gradient */
    var(--color-secondary) 95%);
background-blend-mode: soft-light;                                 /* Key: mesh blends INTO gradient */
```

**Dorothy light-mode values:**
- `--color-background`: `oklch(99% 0.005 245)` → near white, barely blue
- `--color-secondary`: `oklch(60% 0.12 245)` → medium blue
- Gradient runs top-to-bottom; **text sits primarily on the upper ~50%** → effectively `oklch(~97%)` effective luminance
- The SVG mesh blends via `soft-light` — this lightens midtones and barely affects near-white tops, net effect ≈ **+2–3% effective luminance** on light surfaces

**Dorothy dark-mode values:**
- `--color-background`: `oklch(15% 0.01 245)` → near black
- `--color-secondary`: `oklch(75% 0.10 245)` → bright blue
- Effective dark surface ≈ `oklch(~17%)` luminance with soft-light blending

**Reference values for contrast math:**
- **Light mode reference**: `oklch(97% 0.004 245)` (conservative, accounts for soft-light boost)
- **Dark mode reference**: `oklch(17% 0.01 245)` (conservative)

---

## The Lightness Ladder (Contrast-Calibrated)

All 12 colors share this exact L-value per stop. Hue (H) is fixed per color; Chroma (C) scales proportionally to L using a smooth curve (full C at 500, tapering toward both extremes).

| Stop | L% | WCAG vs light ref | WCAG vs dark ref | Role |
|---|---|---|---|---|
| 100 | 96% | ~1.1:1 | ~26:1 | Fill backgrounds, very light tints |
| 200 | 90% | ~1.6:1 | ~17:1 | Subtle fills, hover states |
| 300 | 80% | ~2.5:1 | ~10:1 | Borders, decorative elements |
| 400 | 68% | ~4.0:1 ✅ AA large | ~5.5:1 ✅ AA | Interactive elements, icons |
| 500 | 55% | ~6.5:1 ✅ AA | ~3.0:1 ✅ AA large | **Primary semantic anchor** |
| 600 | 44% | ~9.0:1 ✅ AAA | ~2.1:1 | Dark variant primary |
| 700 | 34% | ~12.5:1 ✅ AAA | ~1.5:1 | Text on light, dark fills |
| 800 | 24% | ~17:1 ✅ AAA | ~1.1:1 | Heavy text, deep fills |
| 900 | 15% | ~21:1 ✅ AAA | ~1.0:1 | Near-black tinted depths |

> [!NOTE]
> Exact L values will be computed programmatically using WCAG 2.2 relative luminance formulas converted to/from OKLCH. Values shown above are design targets; final values will be rounded to 2 decimal places.

---

## Chroma Curve

Per color, C is scaled from the base value (at stop 500) using this multiplier table:

| Stop | C multiplier | Rationale |
|---|---|---|
| 100 | 0.12 | Very faint tint, mostly white |
| 200 | 0.25 | Soft, recognizable hue |
| 300 | 0.50 | Light but clearly tinted |
| 400 | 0.78 | Vibrant but controlled |
| 500 | 1.00 | **Base chroma — anchor** |
| 600 | 0.92 | Slightly reduced, richer |
| 700 | 0.78 | Deepening, some desaturation |
| 800 | 0.55 | Dark, restrained chroma |
| 900 | 0.35 | Near-black, minimal chroma |

---

## Gamut Strategy

```css
/* sRGB fallback (gamut-clamped) — always first */
--color-ruby-900: oklch(15% 0.09 25);   /* C reduced to stay in sRGB */

/* P3 enhancement — overwrites above on supporting displays */
@supports (color: color(display-p3 0 0 0)) {
  --color-ruby-900: oklch(15% 0.25 25); /* Full chroma, P3 gamut */
}
```

> [!IMPORTANT]
> Dark stops (700–900) at high chroma (e.g., ruby C=0.25) exceed sRGB gamut. The sRGB fallback reduces C proportionally using a computed gamut boundary. The `@supports` block restores full P3 values for capable displays.

---

## Theme Semantic Mapping (Reference Block)

Each gem tone's stops map to semantic roles as follows (to be embedded as comments in the file):

| Semantic Variable | Light Mode Stop | Dark Mode Stop |
|---|---|---|
| `--color-primary` | **500** | **400** |
| `--color-on-primary` | **900** | **100** |
| `--color-secondary` | **500–600** | **300–400** |
| `--color-on-secondary` | **900** | **100** |
| `--color-tertiary` | **400–500** | **300** |
| `--color-on-tertiary` | **900** | **100** |
| `--color-primary-fill` | **100** | **800** |
| `--color-primary-text` | **700** | **200** |
| `--color-secondary-fill` | **100** | **800** |
| `--color-secondary-text` | **700** | **200** |
| `--color-tertiary-fill` | **100–200** | **800** |
| `--color-tertiary-text` | **600–700** | **200** |
| `--color-border` | **300** | **700** |
| `--color-subtle-border` | **200** | **800** |
| `--color-text` | **800–900** | **100** |
| `--color-muted-text` | **600–700** | **300** |

> [!NOTE]
> This mapping is a reference guide, not an automated refactor. It shows which scale stop to use when you manually update a theme file. Theme refactors are a separate future task.

---

## File Structure Preview

```css
/* ============================================================
   colors-tw.css
   Gem Tone Color Scale — Tailwind v4 / OKLCH / P3 + sRGB
   
   CONTRAST REFERENCE (Dorothy theme, oklch soft-light surface)
   Light mode surface ≈ oklch(97% 0.004 245)
   Dark mode surface  ≈ oklch(17% 0.010 245)
   
   SEMANTIC STOP MAP:
   -100  Fill backgrounds, light tints      → --color-primary-fill
   -200  Subtle fills, hover states
   -300  Borders, decorative               → --color-border
   -400  Interactive, icons (AA large ✅)
   -500  Primary semantic anchor  (AA ✅)  → --color-primary
   -600  Dark variant (AAA ✅)
   -700  Text, dark fills (AAA ✅)          → --color-primary-text
   -800  Heavy text (AAA ✅)
   -900  Near-black depths (AAA ✅)         → --color-on-primary
   ============================================================ */

@theme {

  /* ── Ruby  (H=25)  ─────────────────────────────────────── */
  /* Base: oklch(55% 0.25 25) | WCAG vs light: 6.5:1 AA ✅   */
  --color-ruby-100: oklch(96% 0.03 25);
  --color-ruby-200: oklch(90% 0.06 25);
  --color-ruby-300: oklch(80% 0.13 25);
  --color-ruby-400: oklch(68% 0.20 25);
  --color-ruby-500: oklch(55% 0.25 25);   /* ← semantic primary anchor */
  --color-ruby-600: oklch(44% 0.23 25);
  --color-ruby-700: oklch(34% 0.20 25);
  --color-ruby-800: oklch(24% 0.14 25);
  --color-ruby-900: oklch(15% 0.09 25);   /* sRGB fallback: C clamped */

  /* ... and so on for all 12 gem tones */
}

@supports (color: color(display-p3 0 0 0)) {
  @theme {
    --color-ruby-900: oklch(15% 0.25 25); /* P3: full chroma */
    /* ... dark stops for all colors that exceed sRGB */
  }
}
```

---

## Verification Plan

1. **Script**: Run a Node.js script to verify all 108 stops' WCAG 2.2 contrast ratios against both references — output will be a table showing pass/fail for AA and AAA
2. **Ladder parity**: Confirm all 12 colors' `-500` stops are within ±0.5% L of 55%
3. **Gamut check**: Flag any stop exceeding P3 gamut for manual review
4. **Visual review**: Check swatches in live Hugo server (running at `http://192.168.1.96:1313`)
5. **Tailwind smoke test**: Confirm `bg-ruby-500`, `text-emerald-300`, etc. are generated in the built CSS

---

## What This Does NOT Do (Yet)

- It does not modify any existing theme files
- It does not auto-replace `--color-primary` with `var(--color-ruby-500)` anywhere
- Theme refactoring using the mapping reference is a separate, future task

---

## Awaiting Your Go-Ahead

All questions answered. All decisions locked. Ready to generate the file on your approval.
