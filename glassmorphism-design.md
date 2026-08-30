# Glassmorphism Design System & Implementation Plan

This document outlines the core glassmorphism design specifications, color-parameterized utility systems, elevation hierarchy, focus behavior, and layout standards across the Firelight Studio theme (`themes/embrace`).

---

## 1. Core Glassmorphism Principles & Presets

### 1.1 Opacity Presets
- **Base Background**: `10%` opacity (`bg-*/10` / `color-mix(in oklch, var(--color-[*]) 10%, transparent)`)
- **Base Border**: `20%` opacity (`border-*/20` / `color-mix(in oklch, var(--color-[*]) 20%, transparent)`)
- **Hover State**: Add `+10` to opacity (`hover:bg-*/20`, `hover:border-*/30`)
- **Active State (`a` / interactive elements)**: Subtract `-5` from normal opacity (e.g. `5%` background opacity on active: `active:bg-*/5`)
- **Backdrop Blur Standard**: `backdrop-blur-sm` (consistent blur across all glass panels, widgets, cards, and overlays)

### 1.2 Button Elevation Hierarchy
All buttons, interactive links, tabs, and controls adhere to the standard three-tier elevation hierarchy:
- **Base State**: `elevation-2`
- **Hover State**: `elevation-3` (`hover:elevation-3`)
- **Active State**: `elevation-1` (`active:elevation-1`)

*Targets:* `button`, `[role="button"]`, `.btn`, `.glass-button`, CTA action links, tab triggers, pagination items, and carousel/announcement controls.

### 1.3 Focus-Visible Specification
- **Ring Style**: `outline-offset: 3px;` (`outline-offset-3`) with rounded corners (`rounded-lg` / `border-radius: 0.5rem;`)
- **Outline Color**: `tertiary/20` (`color-mix(in oklch, var(--color-tertiary) 20%, transparent)` / `offset-tertiary/20`)
- **Hover / Active Focus**: Add `+10` to opacity -> `tertiary/30` (`color-mix(in oklch, var(--color-tertiary) 30%, transparent)`)
- *Targets:* `:focus-visible`, `button:focus-visible`, `a:focus-visible`, `input:focus-visible`, `select:focus-visible`, `textarea:focus-visible`, `[role="button"]:focus-visible`, `[role="tab"]:focus-visible`.

### 1.4 Background Gradients
- **Orientation**: Linear gradient from top to bottom
- **Color Progression**: `secondary/30` to `primary/30`
- **CSS Definition**:
  ```css
  linear-gradient(to bottom, color-mix(in oklch, var(--color-secondary) 30%, transparent), color-mix(in oklch, var(--color-primary) 30%, transparent))
  ```

### 1.5 Theme Standard
- **Default Theme**: Always `theme-auntie-em` (never `theme-neutral` or uncalibrated fallback palettes).

---

## 2. Parameterized Glass Utility Architecture

All glass utilities support the full theme token spectrum defined in `colors.css` and the 12 theme variations (`primary`, `primary-fill`, `primary-text`, `on-primary`, `secondary`, `secondary-fill`, `secondary-text`, `on-secondary`, `tertiary`, `tertiary-fill`, `tertiary-text`, `on-tertiary`, `background`, `card`, `card-alt`, `elevated`, `border`, `subtle-border`, `error`, `on-error`, `error-fill`, `error-text`).

### 2.1 Glass Panels (`.glass-panel-*`)
A translucent surface with `10%` background opacity, `20%` border opacity, `backdrop-blur-sm`, and `elevation-2`:

| Utility Class | Background Opacity | Border Opacity | Blur | Elevation |
| :--- | :--- | :--- | :--- | :--- |
| `glass-panel-primary` | `var(--color-primary) / 10%` | `var(--color-primary) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-primary-fill` | `var(--color-primary-fill) / 10%` | `var(--color-primary-fill) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-secondary` | `var(--color-secondary) / 10%` | `var(--color-secondary) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-secondary-fill` | `var(--color-secondary-fill) / 10%` | `var(--color-secondary-fill) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-tertiary` | `var(--color-tertiary) / 10%` | `var(--color-tertiary) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-tertiary-fill` | `var(--color-tertiary-fill) / 10%` | `var(--color-tertiary-fill) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-card` | `var(--color-card) / 10%` | `var(--color-border) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-card-alt` | `var(--color-card-alt) / 10%` | `var(--color-subtle-border) / 20%` | `backdrop-blur-sm` | `elevation-2` |
| `glass-panel-elevated` | `var(--color-elevated) / 10%` | `var(--color-border) / 20%` | `backdrop-blur-sm` | `elevation-3` |

### 2.2 Glass Typography (`.glass-text-*`)
Renders text as floating, translucent cut glass with a specular rim highlight and a directional drop shadow cast onto underlying panels, without requiring a bounding box.

```
 ┌──────────────────────────────────────────────────────────┐
 │  1. Specular Edge Stroke: -webkit-text-stroke (25% + w)   │
 │  2. Translucent Refractive Fill: background-clip: text   │
 │  3. Floating Drop-Shadow: filter: drop-shadow (elevation)│
 └──────────────────────────────────────────────────────────┘
```

- **Fill Gradient**: Translucent vertical blend (`35% color + 15% white` down to `10% color + transparent`) clipped to text.
- **Glass Rim Stroke**: `1px` stroke using `color-mix(in oklch, var(--color-[*]) 25%, white 15%)` with `paint-order: stroke fill`.
- **Elevation Drop Shadow**: Layered `filter: drop-shadow(...)` projecting depth from character geometry onto background panels.
- **Hover Sheen**: Adds `+10` opacity to gradient & stroke, increasing elevation to `elevation-3`.

Supported variants:
- `glass-text-primary`
- `glass-text-primary-text`
- `glass-text-secondary`
- `glass-text-secondary-text`
- `glass-text-tertiary`
- `glass-text-tertiary-text`
- `glass-text-on-primary`
- `glass-text-on-secondary`
- `glass-text-on-tertiary`

### 2.3 Glass Borders (`.glass-border-*`)
Independent 1px border utilities styled at 20% opacity (with hover adding +10):
- `glass-border-primary`, `glass-border-secondary`, `glass-border-tertiary`
- `glass-border-subtle`, `glass-border-border`

---

## 3. Single Page & Blog Post Standards (`page.html` / Articles)

The single page and article hierarchy uses nested glass layers to create sophisticated visual depth:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  <article class="glass-panel-secondary-fill rounded-3xl p-8 ...">        │
│                                                                          │
│    <header class="mb-8">                                                 │
│      <!-- 1. Floating Glass Title -->                                    │
│      <h1 class="glass-text-secondary-text text-4xl md:text-6xl font-bold"> │
│        Article Title Goes Here                                           │
│      </h1>                                                               │
│                                                                          │
│      <!-- 2. Subtitle sitting directly on article panel -->              │
│      <p class="text-secondary/90 text-lg font-body mt-2">                │
│        Clear, descriptive subtitle sitting directly on secondary-fill.   │
│      </p>                                                                │
│                                                                          │
│      <!-- 3. Metadata Badge in card-alt panel with subtle-border -->     │
│      <div class="glass-panel-card-alt border-subtle-border/20 rounded-xl │
│                  px-4 py-2 inline-flex items-center gap-4 mt-4">        │
│        <span class="text-sm font-medium text-muted-text">By Paul Brown</span>│
│        <time class="text-sm text-tertiary font-bold">March 15, 2026</time>│
│      </div>                                                              │
│    </header>                                                             │
│                                                                          │
│    <!-- 4. Featured Image / Hero Media (if present) -->                  │
│    <div class="rounded-2xl overflow-hidden mb-8 elevation-2">...</div>   │
│                                                                          │
│    <!-- 5. Article Body wrapped in secondary panel with on-secondary --> │
│    <div class="glass-panel-secondary p-8 md:p-12 rounded-2xl">           │
│      <div class="prose max-w-none text-on-secondary                      │
│                  prose-headings:text-primary                             │
│                  prose-p:text-on-secondary                               │
│                  prose-strong:text-on-secondary                          │
│                  prose-a:text-tertiary hover:prose-a:text-primary">      │
│        {{ .Content }}                                                    │
│      </div>                                                              │
│    </div>                                                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Hierarchy Breakdown:
1. **Article Shell (`<article>`)**: `glass-panel-secondary-fill` (`bg-secondary-fill/10 border-secondary-fill/20 backdrop-blur-sm elevation-2`).
2. **Title (`<h1>`)**: `glass-text-secondary-text` floating above the outer panel with elevation drop shadow.
3. **Subtitle (`<p>`)**: Clean typography sitting directly on the `secondary-fill` surface.
4. **Metadata Container (`<div>`)**: `glass-panel-card-alt` with `border-subtle-border/20 backdrop-blur-sm` containing author, date, and read time.
5. **Article Body Container (`<div>`)**: `glass-panel-secondary` containing the `.prose` content styled with `color-on-secondary` (`text-on-secondary`) for contrast and legibility.

---

## 4. Complete CSS Architecture (`main.css`)

### 4.1 Glass Panel Utilities (`@utility`)
```css
/* Glass Panels */
@utility glass-panel-primary {
  @apply bg-primary/10 border border-primary/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-primary-fill {
  @apply bg-primary-fill/10 border border-primary-fill/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-secondary {
  @apply bg-secondary/10 border border-secondary/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-secondary-fill {
  @apply bg-secondary-fill/10 border border-secondary-fill/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-tertiary {
  @apply bg-tertiary/10 border border-tertiary/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-tertiary-fill {
  @apply bg-tertiary-fill/10 border border-tertiary-fill/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-card {
  @apply bg-card/10 border border-border/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-card-alt {
  @apply bg-card-alt/10 border border-subtle-border/20 backdrop-blur-sm elevation-2 transition-all duration-300;
}
@utility glass-panel-elevated {
  @apply bg-elevated/10 border border-border/20 backdrop-blur-sm elevation-3 transition-all duration-300;
}

/* Glass Buttons */
@utility glass-button-primary {
  @apply bg-primary/10 border border-primary/20 backdrop-blur-sm elevation-2 transition-all duration-200 cursor-pointer
         hover:bg-primary/20 hover:border-primary/30 hover:elevation-3
         active:bg-primary/5 active:elevation-1;
}
@utility glass-button-secondary {
  @apply bg-secondary/10 border border-secondary/20 backdrop-blur-sm elevation-2 transition-all duration-200 cursor-pointer
         hover:bg-secondary/20 hover:border-secondary/30 hover:elevation-3
         active:bg-secondary/5 active:elevation-1;
}
@utility glass-button-tertiary {
  @apply bg-tertiary/10 border border-tertiary/20 backdrop-blur-sm elevation-2 transition-all duration-200 cursor-pointer
         hover:bg-tertiary/20 hover:border-tertiary/30 hover:elevation-3
         active:bg-tertiary/5 active:elevation-1;
}
```

### 4.2 Glass Typography Utilities (`@utility`)
```css
/* Glass Typography: Primary */
@utility glass-text-primary {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--color-primary) 35%, white 15%) 0%,
    color-mix(in oklch, var(--color-primary) 10%, transparent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--color-primary) 25%, white 15%);
  paint-order: stroke fill;
  filter: drop-shadow(0 4px 6px color-mix(in oklch, var(--color-shadow, var(--color-primary)) 25%, transparent))
          drop-shadow(0 1px 2px color-mix(in oklch, var(--color-shadow, var(--color-primary)) 15%, transparent));
  transition: all 0.3s ease;
}
@utility glass-text-primary:hover {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--color-primary) 45%, white 25%) 0%,
    color-mix(in oklch, var(--color-primary) 20%, transparent) 100%
  );
  -webkit-text-stroke: 1px color-mix(in oklch, var(--color-primary) 35%, white 25%);
  filter: drop-shadow(0 10px 15px color-mix(in oklch, var(--color-shadow, var(--color-primary)) 35%, transparent))
          drop-shadow(0 4px 6px color-mix(in oklch, var(--color-shadow, var(--color-primary)) 20%, transparent));
}

/* Glass Typography: Secondary */
@utility glass-text-secondary {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--color-secondary) 35%, white 15%) 0%,
    color-mix(in oklch, var(--color-secondary) 10%, transparent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--color-secondary) 25%, white 15%);
  paint-order: stroke fill;
  filter: drop-shadow(0 4px 6px color-mix(in oklch, var(--color-shadow, var(--color-secondary)) 25%, transparent))
          drop-shadow(0 1px 2px color-mix(in oklch, var(--color-shadow, var(--color-secondary)) 15%, transparent));
  transition: all 0.3s ease;
}

/* Glass Typography: Secondary Text */
@utility glass-text-secondary-text {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--color-secondary-text) 35%, white 15%) 0%,
    color-mix(in oklch, var(--color-secondary-text) 10%, transparent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--color-secondary-text) 25%, white 15%);
  paint-order: stroke fill;
  filter: drop-shadow(0 4px 6px color-mix(in oklch, var(--color-shadow, var(--color-secondary-text)) 25%, transparent))
          drop-shadow(0 1px 2px color-mix(in oklch, var(--color-shadow, var(--color-secondary-text)) 15%, transparent));
  transition: all 0.3s ease;
}

/* Glass Typography: Tertiary */
@utility glass-text-tertiary {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--color-tertiary) 35%, white 15%) 0%,
    color-mix(in oklch, var(--color-tertiary) 10%, transparent) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--color-tertiary) 25%, white 15%);
  paint-order: stroke fill;
  filter: drop-shadow(0 4px 6px color-mix(in oklch, var(--color-shadow, var(--color-tertiary)) 25%, transparent))
          drop-shadow(0 1px 2px color-mix(in oklch, var(--color-shadow, var(--color-tertiary)) 15%, transparent));
  transition: all 0.3s ease;
}
```

### 4.3 Global Base Rules (`@layer base`)
```css
button,
[role="button"],
.btn {
  @apply elevation-2 transition-all duration-200 cursor-pointer;
}

button:hover,
[role="button"]:hover,
.btn:hover {
  @apply elevation-3;
}

button:active,
[role="button"]:active,
.btn:active {
  @apply elevation-1;
}

a {
  @apply active:scale-95 active:elevation-1;
  @apply transition-all duration-125 ease-in-out;
}

:focus-visible,
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible,
[role="tab"]:focus-visible {
  outline: 3px solid color-mix(in oklch, var(--color-tertiary) 20%, transparent);
  outline-offset: 3px;
  border-radius: 0.5rem;
}

:focus-visible:hover,
button:focus-visible:hover,
a:focus-visible:hover,
input:focus-visible:hover,
select:focus-visible:hover,
textarea:focus-visible:hover,
[role="button"]:focus-visible:hover,
[role="tab"]:focus-visible:hover {
  outline-color: color-mix(in oklch, var(--color-tertiary) 30%, transparent);
}
```

---

## 5. Layout & Template Audit

| Component / Template | Current State | Proposed Glass Alignment |
| :--- | :--- | :--- |
| `page.html` (Single Post) | Generic container with `cs-glass-primary` | Apply 5-tier nested glass layout (`glass-panel-secondary-fill`, `glass-text-secondary-text`, `glass-panel-card-alt`, `glass-panel-secondary` with `text-on-secondary`) |
| `conditions-grid.html` | `backdrop-blur-md`, fallback `theme-emerald-classic` | Update to `glass-panel-primary`, fallback `theme-auntie-em`, base `elevation-2`, hover `elevation-3`, active `elevation-1` |
| `tags-widget.html` | `bg-secondary/10 border-secondary/20 backdrop-blur-md` | Update to `glass-panel-secondary` (`backdrop-blur-sm`, `elevation-2`) |
| `categories-widget.html` | `bg-secondary/10 border-secondary/20 backdrop-blur-md` | Update to `glass-panel-secondary` (`backdrop-blur-sm`, `elevation-2`) |
| `announcements-widget.html` | Mixed `backdrop-blur-md` and `backdrop-blur-sm`, solid navigation buttons | Update container to `glass-panel-secondary`, cards to `glass-panel-card`, nav buttons to `elevation-2` / hover `elevation-3` / active `elevation-1` |
| `services.tabs.html` | `backdrop-blur-md` on buttons, `bg-tertiary/10` overlay | Standardize blur to `backdrop-blur-sm`, apply 3-tier elevation on tab & CTA buttons |
| `header.html` & `baseof.html` | `bg-background/20 backdrop-blur-md` | Update mobile navigation wrapper & header glass to `glass-panel-primary` or `glass-panel-secondary` (`backdrop-blur-sm`, `elevation-2`) |
| `location.html` | `bg-tertiary/20 backdrop-blur-md` | Update to `glass-panel-tertiary` (`backdrop-blur-sm`, `elevation-2`) |
| `hugo.toml` | CTA button classes mixed with `bg-backdrop-blur-xs` | Align CTA classes with `glass-button-primary` / `elevation-2 hover:elevation-3 active:elevation-1 backdrop-blur-sm` |

---

## 6. Verification & Testing Strategy

1. **Build Validation**: Run `hugo --gc --minify` to verify CSS compiles cleanly without errors.
2. **Visual Inspection**:
   - **Glass Typography**: Verify `h1` letters display translucent glass fills with crisp 1px bevel strokes and realistic drop-shadows onto the underlying article panel.
   - **Single Page Hierarchy**: Verify outer `secondary-fill` container, floating title, `card-alt` metadata badge, and `secondary` inner prose container with `text-on-secondary`.
   - **Button Elevations**: Verify 3-tier elevation progression (base: 2, hover: 3, active: 1).
   - **Focus Rings**: Verify `outline-offset-3` with `tertiary/20` (and `tertiary/30` on hover).
   - **Theme Consistency**: Verify dynamic variables across all 12 themes starting with `theme-auntie-em`.
