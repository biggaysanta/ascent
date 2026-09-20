# Modular Architecture for Hugo `baseof.html` & Page Layouts

## 1. Executive Summary & Core Objective

Currently, [themes/embrace/layouts/baseof.html](file:///d:/dev/ascent/themes/embrace/layouts/baseof.html) hardcodes two constraints around `{{ block "main" . }}`:
1. A fixed container width: `max-w-6xl mx-auto px-4`.
2. A fixed two-column CSS grid: `.content-shell` with `.content-column` and `.side-column` (announcements and categories widgets).

Because this is hardcoded in the root wrapper (`baseof.html`), **every single page** is forced into an editorial sidebar box. This prevents creating:
- Full-width, dramatic edge-to-edge hero landing pages.
- Dynamic pillar pages.
- Minimal distraction-free booking/checkout or contact flows.

---

## 2. Proposed Architectural Strategy

```
                          ┌────────────────────────┐
                          │      baseof.html       │
                          │   (Global HTML Shell)  │
                          └───────────┬────────────┘
                                      │
                         {{ block "main" . }}
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
┌───────────▼────────────┐                             ┌────────▼───────────────┐
│   Full-Width Canvas    │                             │  Editorial / Sidebar   │
│  (Landing / Pillar)    │                             │  (Writings, Articles)  │
├────────────────────────┤                             ├────────────────────────┤
│ • Edge-to-edge hero    │                             │ • max-w-6xl container  │
│ • Component sections   │                             │ • Main article column  │
│ • Full-bleed glass     │                             │ • Widget side-column   │
└────────────────────────┘                             └────────────────────────┘
```

---

## 3. The 3 Architectural Pillars

### Pillar A: Refactor `baseof.html` into a "Pure Canvas"

Strip page-layout constraints out of `baseof.html` so it only manages site-wide chrome:
- HTML `<head>` & SEO meta tags.
- Background SVG glass refraction filters.
- Fixed floating CTA / booking navigation.
- Site `<header>`.
- Site `<footer>`.
- Dynamic `<main>` block with zero forced grid or max-width.

#### Example `baseof.html`:
```html
<!doctype html>
<html lang="{{ site.Language.Locale }}" class="{{ site.Params.colorMood }} dark">
  <head>
    {{ partial "head.html" . }}
  </head>

  <body class="min-h-screen relative bg-background text-foreground selection:bg-primary/20">
    <!-- SVG Glass Refraction Filters -->
    {{ partial "atoms/svg-filters.html" . }}

    <!-- Floating Global CTA -->
    <div class="fixed top-2 right-2 z-50 flex items-center gap-2">
      <nav id="cta-nav">
        {{ partial "menu.html" (dict "menuID" "cta" "pageID" . "class" "!flex-row !flex-nowrap") }}
      </nav>
    </div>

    <!-- Header -->
    <header class="relative glass-panel-background z-30 min-w-xs max-w-6xl mx-auto px-4" x-data="{ open: false }">
      {{ partial "header.html" . }}
    </header>

    <!-- Main Content Canvas: Full Width & Unconstrained -->
    <main id="main-content" class="relative w-full">
      {{ block "main" . }}{{ end }}
    </main>

    <!-- Footer -->
    <footer class="block min-w-xs max-w-6xl mx-auto px-4 py-8">
      {{ partial "footer.html" . }}
      {{ partial "organisms/tags-widget.html" . }}
    </footer>
  </body>
</html>
```

---

### Pillar B: Component Array in Frontmatter (Page Builder Pattern)

You can define high-impact landing and pillar pages as an ordered array of organism components directly in Markdown frontmatter.

#### Example: `content/services/_index.md` (or `content/_index.md`):
```yaml
---
title: "Zero-Point AMFR & Pain Relief"
layout: "page-builder"
color-theme: "theme-release"

sections:
  - component: "hero-video"
    headline: "Zero Point AMFR: Targeted Relief"
    tagline: "Restore alignment, eliminate chronic pain, and recover movement."
    video_url: "/videos/hero-tissue.mp4"
    cta_primary:
      text: "Book Pain Relief Session"
      url: "https://vagaro.com/firelightstudio"
    full_width: true

  - component: "conditions-grid"
    heading: "Specific Conditions Treated"
    limit: 6
    boxed: true

  - component: "services-tabs"
    active_tab: "release"
    boxed: true

  - component: "split-editorial"
    has_sidebar: true
    sidebar_widgets:
      - "announcements-widget"
      - "categories-widget"

  - component: "cta-banner"
    headline: "Ready to live pain-free?"
    cta_url: "/contact"
---

# Optional Markdown Content below the sections
Additional deep-dive content, FAQ, or scientific explanations render cleanly after or inside the component stream.
```

#### Template: `layouts/_default/page-builder.html` (or `layouts/page-builder.html`):
```html
{{ define "main" }}
<div class="{{ index .Params "color-theme" | default "theme-auntie-em" }} w-full min-h-screen">
  
  {{ range .Params.sections }}
    {{ $partialPath := printf "organisms/%s.html" .component }}
    {{ partial $partialPath (dict "Page" $ "params" .) }}
  {{ end }}

  {{ with .Content }}
    <article class="max-w-4xl mx-auto px-4 py-12 prose prose-invert">
      {{ . }}
    </article>
  {{ end }}

</div>
{{ end }}
```

---

### Pillar C: Modular Sidebar Handling via Wrapper Molecule

For editorial pages (like articles, blog posts, writings, and announcements) that *do* need the 2-column sidebar layout, create a reusable layout wrapper or molecule: `layouts/partials/molecules/content-shell.html`.

#### `layouts/partials/molecules/content-shell.html`:
```html
<div class="min-w-xs max-w-6xl mx-auto mt-4 px-4 py-4">
  <div class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] gap-8 items-start">
    <div class="content-column min-w-0" style="view-transition-name: main-content;">
      {{ .Content }}
    </div>

    <aside class="side-column space-y-6">
      {{ partial "organisms/announcements-widget.html" .Page }}
      {{ partial "organisms/categories-widget.html" .Page }}
    </aside>
  </div>
</div>
```

---

## 4. Frontmatter Arrays vs. JSON Data Files

| Feature | Frontmatter `sections: []` | Data Files (`data/sections/*.json`) |
| :--- | :--- | :--- |
| **Best Used For** | Page-specific landing flows, custom pillar structures, SEO-tied layouts. | Shared multi-page data (e.g. Testimonials, Pricing Matrices, Team Bios, FAQ list). |
| **Author Experience** | Edit 1 file (`_index.md`) for all copy, SEO, and section ordering. | Separates data records from markdown copy. |
| **Performance** | Instant Hugo compilation, zero extra file reads. | Fast, cached in Hugo data store. |

**Recommended Hybrid:**
- Use **Frontmatter `sections: []`** for page flow and component ordering.
- Reference **JSON data files** inside specific organisms when data is shared across multiple pages (e.g., `data/conditions.json`, `data/pricing.json`).

---

## 5. Next Steps for Implementation

1. **Clean `baseof.html`**: Move the `.content-shell` / sidebar markup out of `baseof.html` and into editorial templates / `content-shell.html`.
2. **Create `page-builder.html` layout**: Add the dynamic loop for `sections: []`.
3. **Verify Organisms**: Ensure each organism partial in `layouts/partials/organisms/` accepts `(dict "Page" .Page "params" .params)` cleanly.
