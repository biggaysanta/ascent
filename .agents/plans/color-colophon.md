# The Comprehensive Embrace CSS Color Colophon & Theme Inventory

This document is the single source of truth for **every custom color** defined in `themes/embrace/assets/css/` (excluding third-party Atlas and Tailwind native defaults).

---

## 1. The Core 12 Gemstone Foundation (`colors.css`)

The root chromatic palette built on modern `OKLCH` coordinates (Lightness, Chroma, Hue):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE 12 GEMSTONE TOKENS                         │
└────────────────────────────────────────────────────────────────────────┘
```

| Token | OKLCH Value | Visual Swatch Description | Role & Association |
| :--- | :--- | :--- | :--- |
| `--color-ruby` | `oklch(55% 0.25 25)` | Vivid Rich Crimson / Ruby | Dorothy Primary, Warm Accent |
| `--color-emerald` | `oklch(55% 0.15 155)` | Deep Botanical Emerald | Emerald City, Healing, Refresh Shadow |
| `--color-gold` | `oklch(85% 0.18 65)` | Luminous Warm Gold | Lion / Scarecrow Accent, Highlights |
| `--color-aquamarine` | `oklch(75% 0.10 215)` | Clean Cyan Aquamarine | Relate Shadow, Tidal Water Accents |
| `--color-amethyst` | `oklch(60% 0.16 300)` | Royal Velvet Amethyst | Glinda / Repeat Shadows |
| `--color-sapphire` | `oklch(45% 0.14 270)` | Deep Midnight Sapphire | Clinical Precision, Trust |
| `--color-steel` | `oklch(55% 0.04 250)` | Neutral Slate Steel | Auntie Em Neutral Shadows |
| `--color-onyx` | `oklch(35% 0.02 270)` | Smoky Deep Onyx | Courage / Release Shadows |
| `--color-cobalt` | `oklch(50% 0.16 260)` | Electric Cobalt Blue | High-Focus Highlights |
| `--color-bronze` | `oklch(55% 0.14 45)` | Earthy Warm Bronze | Home / Hearth Shadows |
| `--color-topaz` | `oklch(60% 0.16 75)` | Warm Amber Topaz | Brains / Recharge Shadows |
| `--color-jade` | `oklch(55% 0.11 150)` | Soft Mineral Jade | Renew Shadow, Herbal Recovery |

### System Monochromes (`colors.css`)
* `--color-snow`: `oklch(100% 0 0)` — Pure White
* `--color-ebon`: `oklch(0% 0 0)` — Pure Black
* `--color-charcoal`: `oklch(25% 0 0)` — Deep Neutral Grey
* `--color-scrim`: `oklch(0% 0 0 / 0.32)` — 32% Black Overlay

---

## 2. Standardized Semantic Error Palette

Used across all theme files to guarantee accessible, uniform error handling in both color modes:

| State | Role | OKLCH Value |
| :--- | :--- | :--- |
| **Light Mode** | `--color-error` (Base) | `oklch(50.86% 0.193 27.64)` |
| | `--color-on-error` (Text on Error) | `oklch(98.20% 0.009 26.02)` |
| | `--color-error-fill` (Surface Fill) | `oklch(67.11% 0.214 27.69)` |
| | `--color-error-text` (High-contrast text) | `oklch(28.72% 0.117 27.53)` |
| **Dark Mode** | `--color-error` (Base) | `oklch(71.82% 0.176 27.57)` |
| | `--color-on-error` (Text on Error) | `oklch(25.72% 0.105 27.65)` |
| | `--color-error-fill` (Surface Fill) | `oklch(47.21% 0.187 27.54)` |
| | `--color-error-text` (High-contrast text) | `oklch(84.66% 0.084 26.20)` |

---

## 3. The 12 Active Theme Palettes (Complete Colophon)

### 1. `theme-auntie-em` (`auntie-em.css`) — *The Master Default*
* **Mood**: Warm Sepia Neutral, Understated Sophistication.
* **Light Mode**:
  * Primary: `oklch(55% 0.05 60)` | On-Primary: `oklch(98% 0.01 60)` | Fill: `oklch(90% 0.03 60)` | Text: `oklch(35% 0.04 60)`
  * Secondary: `oklch(65% 0.02 250)` | On-Secondary: `oklch(25% 0.02 250)` | Fill: `oklch(92% 0.01 250)` | Text: `oklch(40% 0.02 250)`
  * Tertiary: `oklch(45% 0.04 70)` | On-Tertiary: `oklch(95% 0.01 70)` | Fill: `oklch(88% 0.02 70)` | Text: `oklch(30% 0.04 70)`
  * Background: `oklch(98% 0.005 60)` | Card: `oklch(95% 0.005 60)` | Card-Alt: `oklch(93% 0.005 60)` | Elevated: `oklch(90% 0.005 60)`
  * Border: `oklch(75% 0.01 60)` | Subtle-Border: `oklch(85% 0.005 60)`
  * Body Text: `oklch(25% 0.01 60)` | Muted Text: `oklch(50% 0.01 60)`
* **Dark Mode**:
  * Primary: `oklch(80% 0.04 60)` | Secondary: `oklch(80% 0.02 250)` | Tertiary: `oklch(75% 0.04 70)`
  * Background: `oklch(18% 0.005 250)` | Card: `oklch(22% 0.005 250)` | Elevated: `oklch(28% 0.005 250)`
  * Border: `oklch(45% 0.005 250)` | Text: `oklch(92% 0.005 60)` | Muted: `oklch(70% 0.005 60)`

---

### 2. `theme-dorothy` (`dorothy.css`)
* **Mood**: Vibrant Ruby Red, Cornflower Blue & Gold.
* **Light Mode**:
  * Primary: `oklch(55% 0.22 25)` | Secondary: `oklch(60% 0.12 245)` | Tertiary: `oklch(80% 0.16 95)`
  * Background: `oklch(99% 0.005 245)` | Card: `oklch(96% 0.01 245)` | Border: `oklch(75% 0.02 245)`
  * Text: `oklch(25% 0.02 245)` | Muted Text: `oklch(50% 0.02 245)`
* **Dark Mode**:
  * Primary: `oklch(65% 0.22 25)` | Secondary: `oklch(75% 0.10 245)` | Tertiary: `oklch(85% 0.16 95)`
  * Background: `oklch(15% 0.01 245)` | Card: `oklch(20% 0.015 245)` | Border: `oklch(45% 0.02 245)`
  * Text: `oklch(95% 0.01 245)` | Muted Text: `oklch(75% 0.01 245)`

---

### 3. `theme-brains` (`brains.css`)
* **Mood**: Topaz Gold, Straw Yellow & Forest Green.
* **Light Mode**:
  * Primary: `oklch(60% 0.16 80)` | Secondary: `oklch(75% 0.08 75)` | Tertiary: `oklch(45% 0.12 145)`
  * Background: `oklch(98% 0.01 80)` | Card: `oklch(95% 0.01 80)` | Border: `oklch(65% 0.04 80)`
  * Text: `oklch(25% 0.03 80)` | Muted Text: `oklch(50% 0.03 80)`
* **Dark Mode**:
  * Primary: `oklch(85% 0.15 85)` | Secondary: `oklch(75% 0.08 75)` | Tertiary: `oklch(75% 0.15 145)`
  * Background: `oklch(15% 0.01 80)` | Card: `oklch(20% 0.015 80)` | Border: `oklch(45% 0.02 80)`
  * Text: `oklch(95% 0.01 80)` | Muted Text: `oklch(75% 0.01 80)`

---

### 4. `theme-courage` (`courage.css`)
* **Mood**: Lion Tawny Gold, Moss Olive & Poppy.
* **Light Mode**:
  * Primary: `oklch(65% 0.15 65)` | Secondary: `oklch(45% 0.05 130)` | Tertiary: `oklch(55% 0.18 25)`
  * Background: `oklch(98% 0.01 65)` | Card: `oklch(95% 0.015 65)` | Border: `oklch(70% 0.03 65)`
  * Text: `oklch(25% 0.02 65)` | Muted Text: `oklch(50% 0.02 65)`
* **Dark Mode**:
  * Primary: `oklch(75% 0.12 65)` | Secondary: `oklch(75% 0.05 130)` | Tertiary: `oklch(65% 0.16 25)`
  * Background: `oklch(15% 0.01 65)` | Card: `oklch(20% 0.015 65)` | Border: `oklch(45% 0.02 65)`
  * Text: `oklch(95% 0.01 65)` | Muted Text: `oklch(75% 0.01 65)`

---

### 5. `theme-glinda` (`glinda.css` & `glinda 2.css`)
* **Mood**: Rose Pink, Orchid Lavender & Sunshine Gold.
* **Light Mode**:
  * Primary: `oklch(65% 0.20 350)` | Secondary: `oklch(75% 0.08 320)` | Tertiary: `oklch(75% 0.15 85)`
  * Background: `oklch(99% 0.01 350)` | Card: `oklch(96% 0.02 350)` | Border: `oklch(75% 0.06 350)`
  * Text: `oklch(30% 0.05 350)` | Muted Text: `oklch(55% 0.05 350)`
* **Dark Mode**:
  * Primary: `oklch(80% 0.18 350)` | Secondary: `oklch(85% 0.08 320)` | Tertiary: `oklch(85% 0.15 85)`
  * Background: `oklch(15% 0.03 320)` | Card: `oklch(20% 0.04 320)` | Border: `oklch(45% 0.08 320)`
  * Text: `oklch(95% 0.02 350)` | Muted Text: `oklch(75% 0.05 350)`

---

### 6. `theme-home` (`home.css`)
* **Mood**: Bronze, Sienna & Sunlit Wheat.
* **Light Mode**:
  * Primary: `oklch(55% 0.16 45)` | Secondary: `oklch(65% 0.12 55)` | Tertiary: `oklch(75% 0.12 85)`
  * Background: `oklch(98.5% 0.01 55)` | Card: `oklch(96% 0.015 55)` | Border: `oklch(70% 0.03 55)`
  * Text: `oklch(30% 0.02 55)` | Muted Text: `oklch(50% 0.02 55)`
* **Dark Mode**:
  * Primary: `oklch(70% 0.14 45)` | Secondary: `oklch(75% 0.10 55)` | Tertiary: `oklch(85% 0.10 85)`
  * Background: `oklch(18% 0.01 55)` | Card: `oklch(22% 0.015 55)` | Border: `oklch(45% 0.02 55)`
  * Text: `oklch(92% 0.01 55)` | Muted Text: `oklch(75% 0.01 55)`

---

### 7. `theme-refresh` (`refresh.css`)
* **Mood**: Tidal Slate Blue, Cool Mist & Soft Magenta.
* **Light Mode**:
  * Primary: `oklch(48.99% 0.078 280.40)` | Secondary: `oklch(48.62% 0.033 285.09)` | Tertiary: `oklch(49.27% 0.070 320.06)`
  * Background: `oklch(98.31% 0.009 308.36)` | Card: `oklch(94.83% 0.014 299.80)` | Border: `oklch(58.37% 0.015 290.52)`
  * Text: `oklch(32.08% 0.016 285.47)` | Muted Text: `oklch(48.64% 0.016 290.39)`
* **Dark Mode**:
  * Primary: `oklch(83.06% 0.060 283.96)` | Secondary: `oklch(82.90% 0.035 287.45)` | Tertiary: `oklch(94.51% 0.046 323.74)`
  * Background: `oklch(16.57% 0.008 285.46)` | Card: `oklch(21.66% 0.014 285.21)` | Border: `oklch(56.36% 0.017 290.03)`
  * Text: `oklch(92.39% 0.016 293.74)` | Muted Text: `oklch(74.23% 0.016 290.20)`

---

### 8. `theme-release` (`release.css`) & `theme-renew` (`renew.css`)
* **Mood**: Zero-Point AMFR Deep Indigo, Olive Sage & Chartreuse.
* **Light Mode**:
  * Primary: `oklch(49.48% 0.132 277.34)` | Secondary: `oklch(48.27% 0.088 123.38)` | Tertiary: `oklch(48.81% 0.132 121.94)`
  * Background: `oklch(98.34% 0.009 311.16)` | Card: `oklch(93.58% 0.024 295.31)` | Border: `oklch(55.67% 0.057 291.56)`
  * Text: `oklch(30.63% 0.055 285.54)` | Muted Text: `oklch(46.99% 0.053 285.54)`
* **Dark Mode**:
  * Primary: `oklch(81.99% 0.080 279.80)` | Secondary: `oklch(81.82% 0.048 119.56)` | Tertiary: `oklch(96.11% 0.063 118.06)`
  * Background: `oklch(14.43% 0.023 288.54)` | Card: `oklch(18.43% 0.035 288.54)` | Border: `oklch(52.67% 0.057 291.56)`
  * Text: `oklch(90.63% 0.055 285.54)` | Muted Text: `oklch(70.99% 0.053 285.54)`

---

### 9. `theme-recharge` (`recharge.css`) & `theme-repeat` (`repeat.css`)
* **Mood**: Royal Violet, Electric Magenta & Berry Pink.
* **Light Mode**:
  * Primary: `oklch(49.32% 0.237 271.65)` | Secondary: `oklch(48.76% 0.160 286.28)` | Tertiary: `oklch(49.12% 0.148 341.14)`
  * Background: `oklch(97.49% 0.016 310.11)` | Card: `oklch(93.44% 0.035 296.28)` | Border: `oklch(57.19% 0.067 291.41)`
  * Text: `oklch(30.80% 0.069 288.77)` | Muted Text: `oklch(47.64% 0.067 290.15)`
* **Dark Mode**:
  * Primary: `oklch(75.65% 0.127 280.43)` | Secondary: `oklch(71.10% 0.157 288.41)` | Tertiary: `oklch(82.71% 0.125 342.86)`
  * Background: `oklch(17.18% 0.074 283.92)` | Card: `oklch(22.20% 0.085 284.88)` | Border: `oklch(56.85% 0.067 291.39)`
  * Text: `oklch(92.63% 0.040 295.10)` | Muted Text: `oklch(74.49% 0.067 292.48)`

---

### 10. `theme-relate` (`relate.css`) & `theme-receive` (`receive.css`)
* **Mood**: Deep Indigo (`#5157ab`), Slate Purple & Warm Coral.
* **Light Mode**:
  * Primary: `oklch(49.48% 0.132 277.34)` (`#5157ab`) | Secondary: `oklch(48.72% 0.056 281.56)` | Tertiary: `oklch(49.82% 0.119 29.86)`
  * Background: `oklch(98.34% 0.010 305.41)` | Card: `oklch(94.88% 0.013 306.03)` | Border: `oklch(58.27% 0.011 292.64)`
  * Text: `oklch(31.95% 0.011 285.79)` | Muted Text: `oklch(48.53% 0.011 292.55)`
* **Dark Mode**:
  * Primary: `oklch(75.65% 0.127 280.43)` | Secondary: `oklch(82.95% 0.056 283.98)` | Tertiary: `oklch(80.60% 0.111 29.23)`
  * Background: `oklch(16.62% 0.010 285.21)` | Card: `oklch(21.61% 0.012 285.38)` | Border: `oklch(56.30% 0.011 299.08)`
  * Text: `oklch(92.35% 0.011 303.10)` | Muted Text: `oklch(74.18% 0.010 299.17)`

---

## 4. Emerald City Variant Explorations (`emerald-city-variants.css`)

These 3 complete theme variants exist in `emerald-city-variants.css` but are currently unassigned to main services:

### Variant A: `theme-emerald-classic` (Imperial Emerald & Brass)
* **Light**: Primary `oklch(48% 0.08 152)`, Secondary `oklch(74% 0.045 85)`, Tertiary `oklch(45% 0.04 165)`, Background `oklch(98.5% 0.008 150)`.
* **Dark**: Primary `oklch(70% 0.09 152)`, Secondary `oklch(78% 0.05 85)`, Tertiary `oklch(64% 0.05 165)`, Background `oklch(14% 0.015 150)`.

### Variant B: `theme-emerald-neon` (Botanical Jade & Mint)
* **Light**: Primary `oklch(54% 0.11 148)`, Secondary `oklch(68% 0.08 175)`, Tertiary `oklch(50% 0.07 130)`, Background `oklch(98% 0.01 148)`.
* **Dark**: Primary `oklch(74% 0.12 148)`, Secondary `oklch(75% 0.09 175)`, Tertiary `oklch(68% 0.08 130)`, Background `oklch(13% 0.02 148)`.

### Variant C: `theme-emerald-mystic` (Mystic Mineral Jade & Sage)
* **Light**: Primary `oklch(56% 0.05 155)`, Secondary `oklch(52% 0.04 170)`, Tertiary `oklch(48% 0.035 140)`, Background `oklch(99% 0.004 155)`.
* **Dark**: Primary `oklch(72% 0.06 155)`, Secondary `oklch(68% 0.05 170)`, Tertiary `oklch(64% 0.04 140)`, Background `oklch(15% 0.008 155)`.

---

## 5. Non-Theme / Procedural & Animation Colors

| File | Token / Usage | Color Calculation / Value |
| :--- | :--- | :--- |
| **`butterfly.css`** | `@keyframes breathe` | `color-mix(in srgb, var(--color-accent) 60%, transparent)` |
| | `@keyframes breathe` | `color-mix(in srgb, var(--color-primary) 40%, transparent)` |
| **`emb-glass.css`** | `glass-text-*` Stroke | `color-mix(in oklch, var(--color-primary) 25%, white 15%)` |
| | `glass-text-*` Gradient Start | `color-mix(in oklch, var(--color-primary) 35%, white 15%)` |
| | `glass-text-*` Gradient End | `color-mix(in oklch, var(--color-primary) 10%, transparent)` |
| | `glass-text-*` Shadow | `color-mix(in oklch, var(--color-shadow, var(--color-primary)) 25%, transparent)` |
| | `bg-glass-gradient` | `linear-gradient(to bottom, color-mix(in oklch, var(--color-secondary) 30%, transparent) 0%, color-mix(in oklch, var(--color-primary) 30%, transparent) 100%)` |
| | `bg-glass-gradient-alt`| `linear-gradient(to bottom, color-mix(in oklch, var(--color-tertiary) 30%, transparent) 0%, color-mix(in oklch, var(--color-secondary) 30%, transparent) 100%)` |
