---

## **HUGO SSG EXPERT AUDIT REPORT**
**Date**: 2026-08-12 | **Project**: Ascent (Paul Brown Massage Therapy)

### **EXECUTIVE SUMMARY**
The Hugo site uses solid structural foundations (proper module mounts, extended mode, v0.146+) with good partial organization (atoms/molecules/organisms pattern). However, critical SEO and accessibility gaps exist: missing schema.org markup, absent meta descriptions, no structured data, and semantic HTML issues that compromise both search visibility and screen reader accessibility.

---

### **1. HUGO CONFIGURATION & BUILD PIPELINE ✓**

**Status**: ✅ **COMPLIANT**

- Hugo version: v0.146.0+ (extended mode enabled) - correct
- Module mounts properly configured (assets, themes, node_modules SVG icons)
- Main sections declared: `writings`, `about`, `announcements` - good
- Theme: `embrace` (custom)
- Base URL: `https://paulbrown.net/` - correct production domain

**Findings**:
- Config is clean and minimal
- No content safety/security issues detected

---

### **2. TEMPLATE STRUCTURE & LOOKUP ORDER 🔴 NEEDS WORK**

**Status**: 🔴 **CRITICAL GAPS**

**Issues Identified**:

| Template | Issue | Impact |
|----------|-------|--------|
| `baseof.html` | Missing `<main>` landmark; uses `<main class="...">` but lacks proper semantic structure | Screen reader confusion |
| `head.html` | **NO meta description, keywords, OG tags, schema.org markup** | Zero SEO, no social sharing metadata |
| `page.html` | Image alt text uses generic placeholder `"{{ $.Title }} featured image"` | Accessibility fails, no image SEO |
| `services.html` | Uses `hugo.Data.services` (data file); unclear where services are sourced | Maintainability issue |
| All templates | **NO structured data (JSON-LD) for LocalBusiness, Service, AggregateRating** | Google Maps/local search visibility fails |

**`head.html` Current State**:
```html
<title>{{ if .IsHome }}{{ site.Title }}{{ else }}{{ printf "%s | %s" .Title site.Title }}{{ end }}</title>
<!-- ❌ Missing: meta name="description", og:*, twitter:*, schema -->
```

---

### **3. PARTIAL ORGANIZATION 🟢 GOOD**

**Status**: ✅ **WELL STRUCTURED**

- Atomic design pattern implemented: `atoms/`, `molecules/`, `organisms/`
- Key partials present:
  - `menu.html` (recently fixed ✓)
  - `icon.html`, `circle-image.html`
  - `tabs.html`, `map.html`
  - `services.tabs.html`, `announcements.html`

**Issue**: Recently fixed `menu.html` (icon fallback bug) but needs verification on production rebuild.

---

### **4. SEMANTIC HTML & ACCESSIBILITY 🔴 CRITICAL GAPS**

**Issues**:

1. **Missing Landmarks**:
   - `<header>` is present but not clearly demarcated
   - `<nav>` elements exist but not all associated with proper ARIA labels
   - Footer likely missing (not confirmed in `baseof.html` excerpt)

2. **Heading Hierarchy**:
   - `<h1>` in header (site title) ✓
   - Articles use `<h2>` for title (correct for single main heading) ✓
   - But no validation that heading hierarchy never skips levels

3. **Image Accessibility**:
   - Featured images use: `alt="{{ $.Title }} featured image"` (generic, non-descriptive)
   - Icons use `aria-hidden="true"` (good pattern)
   - Need to verify: are SVG icons properly marked as decorative?

4. **Form Labels**:
   - No forms detected in audit scope (Vagaro widget may have external forms)

---

### **5. CONTENT ARCHITECTURE & CROSS-LINKING 🟡 PARTIAL**

**Status**: ⚠️ **FRAGMENTED BUT USABLE**

**Content Map** (103 files):
- `writings/` — Blog articles (main content hub) ✓
- `shoulder/`, `headaches/` — Topic clusters (pain condition guides) ✓
- `services/`, `about/`, `location/`, `contact/` — Service pages ✓
- `announcements/` — News/promotions
- `oz/` — Booking integration

**Issues**:
- No internal linking strategy visible in audit (must check individual articles)
- No "related articles" partial or cross-linking mechanism
- No breadcrumb navigation detected
- No site map or robots.txt hints detected

---

### **6. SCHEMA.org MARKUP & STRUCTURED DATA 🔴 MISSING**

**Status**: ❌ **NOT IMPLEMENTED** (CRITICAL FOR LOCAL SEO)

**Missing Required Schemas**:

1. **LocalBusiness (home page)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "LocalBusiness",
     "@type": "HealthAndBeautyBusiness",
     "name": "Paul Brown Massage Therapy",
     "address": "Sacramento, CA",
     "telephone": "+1-916-534-8772",
     "url": "https://paulbrown.net",
     "priceRange": "$$",
     "openingHoursSpecification": {...},
     "aggregateRating": {...}
   }
   ```
   **Impact**: Google My Business data not automatically detected; map search visibility compromised.

2. **Service (for each service offering)**
   ```json
   {
     "@type": "Service",
     "name": "Deep Tissue Massage",
     "description": "...",
     "provider": { "@type": "LocalBusiness", "name": "Paul Brown Massage Therapy" },
     "areaServed": "Sacramento, CA",
     "priceRange": "$$"
   }
   ```

3. **AggregateRating (if testimonials/reviews exist)**
   ```json
   {
     "@type": "LocalBusiness",
     "aggregateRating": {
       "@type": "AggregateRating",
       "ratingValue": "4.9",
       "reviewCount": "47"
     }
   }
   ```

4. **Article (for blog posts)**
   ```json
   {
     "@type": "BlogPosting",
     "headline": "{{ .Title }}",
     "description": "{{ .Summary }}",
     "datePublished": "{{ .PublishDate }}",
     "author": "Paul Brown, CMT"
   }
   ```

---

### **7. META TAGS & HEAD SECTION 🔴 MISSING**

**Current `head.html`**:
```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" initial-scale="1.0" />
<title>{{ if .IsHome }}...{{ end }}</title>
```

**Missing**:
- [ ] `<meta name="description" content="{{ .Description | default .Summary | truncate 160 }}"/>`
- [ ] `<meta name="keywords" content="{{ delimit .Keywords ", " }}"/>`
- [ ] `<meta name="author" content="Paul Brown, CMT"/>`
- [ ] `<meta name="robots" content="index, follow"/>`
- [ ] `<meta property="og:title" content="{{ .Title }}"/>`
- [ ] `<meta property="og:description" content="{{ .Summary }}"/>`
- [ ] `<meta property="og:url" content="{{ .Permalink }}"/>`
- [ ] `<meta property="og:image" content="{{ .Params.image }}"/>`
- [ ] `<meta name="twitter:card" content="summary_large_image"/>`
- [ ] `<link rel="canonical" href="{{ .Permalink }}"/>`
- [ ] Schema.org JSON-LD blocks

---

### **8. CONTENT FRONT MATTER 🟡 INCONSISTENT**

**Example** (shoulder article):
```yaml
---
title: "Burning Pain Between the Shoulder Blades"
slug: "burning-pain-between-shoulder-blades"
description: "Analyze the mechanical causes of burning pain..."
seo_focus_keyword: "Burning pain between shoulder blades"
canonical: "https://paulbrown.net/blog/burning-pain-between-shoulder-blades/"
---
```

**Status**: ✅ **GOOD** — Front matter includes `description` and `seo_focus_keyword`

**Issues**:
- `canonical` front matter is **not used** in templates (hardcoded URL, not templated)
- `seo_focus_keyword` defined but not integrated into meta/schema
- Some articles may lack descriptions (need full audit)

---

### **9. BUILD & PERFORMANCE**

**Status**: ✅ **OPTIMAL**

- Hugo extended mode: fast compilation
- CSS imported via Vite (assets/css/main.css) — good
- JavaScript minified in non-server builds ✓
- No detected performance blockers

---

### **10. RECOMMENDATIONS PRIORITIZED**

**URGENT (Do First)**:
1. ✅ Create `head/meta.html` partial with all meta tags + schema.org JSON-LD
2. ✅ Add schema.org templates for LocalBusiness, Service, BlogPosting, AggregateRating
3. ✅ Update all article front matter to include `description`, `keywords`, `image_alt`
4. ✅ Fix `page.html` image alt text to use `{{ .Params.image_alt | default .Title }}`

**HIGH PRIORITY**:
5. ✅ Add breadcrumb navigation + schema markup
6. ✅ Create "related articles" partial for internal linking
7. ✅ Add robots.txt and sitemap.xml (Hugo built-in support)
8. ✅ Verify heading hierarchy across all templates

**MEDIUM PRIORITY**:
9. ✅ Add footer with proper semantic structure
10. ✅ Create schema.org partial library (reusable JSON-LD blocks)

---

### **DEEP-DEBUG CHECKLIST**

```bash
# 1. Validate template render paths
hugo --templateMetrics

# 2. Check content front matter consistency
grep -r "^description:" content/ | wc -l

# 3. Validate HTML semantics
hugo server
# Then use: axe DevTools, WAVE on each page type

# 4. Verify schema.org JSON-LD
# Check home page: view-source, search for "@context"
# Expected: LocalBusiness, Service blocks

# 5. Test meta tags
curl -s https://paulbrown.net | grep -E 'og:|twitter:|description'
```

---

**Next Step**: Await your approval to proceed to **Tailwind Design Expert audit**.