# TAILWIND DESIGN EXPERT AUDIT REPORT

**Date**: 2026-08-12 | **Project**: Ascent (Paul Brown Massage Therapy)

---

## EXECUTIVE SUMMARY

The site leverages Tailwind v4 with an ambitious custom design system (glassmorphism, dynamic theme switching, fluid typography). However, **critical WCAG 2.1 Level AA accessibility violations** exist: missing keyboard focus indicators, no prefers-reduced-motion handling, unverified contrast ratios in custom oklch colors, insufficient touch target sizing, and color-only communication patterns that fail for color-blind users.

**Overall Compliance Score**: 🔴 **FAIL** (Multiple critical WCAG 2.1 Level AA violations)

---

## 1. TAILWIND v4 CONFIGURATION & BUILD PIPELINE ✅

**Status**: ✅ **COMPLIANT**

### Configuration Details

- Tailwind v4 via Vite + @tailwindcss/vite
- @theme blocks properly implemented (custom colors, fluid text, animations)
- Extended color palette (gem tones: ruby, emerald, sapphire, gold, amethyst, platinum, aquamarine, pearl)
- Fluid typography implemented (clamp() for responsive text scaling)
- Tailwind CLI: `@tailwindcss/cli@4.2.2` ✓
- JIT mode: Active (on-demand CSS generation)

### Findings

- Build is optimized for production (minified non-server) ✓
- No configuration errors detected ✓
- Asset pipeline clean (Vite handles CSS bundling) ✓

---

## 2. COLOR SYSTEM & CONTRAST RATIO ISSUES 🔴 CRITICAL

**Status**: ⚠️ **OKLCH COLORS NEED VERIFICATION**

### Current Implementation

```css
--color-emerald: oklch(55% 0.15 155);
--color-sapphire: oklch(45% 0.14 270);
--color-ruby: oklch(55% 0.25 25);
--color-platinum: oklch(85% 0.02 250);
--color-pearl: oklch(91.5% 0.045 95);
```

### Accessibility Issues

| Color Pair                         | Use Case          | Contrast Ratio    | WCAG AA (4.5:1) | WCAG AAA (7:1) | Status      |
| ---------------------------------- | ----------------- | ----------------- | --------------- | -------------- | ----------- |
| Pearl (91.5%) on Sapphire (45%)    | Text on bg        | ⚠️ **UNTESTED**   | ?               | ?              | 🔴 VERIFY   |
| Pearl (91.5%) on Emerald (55%)     | Text on bg        | ⚠️ **UNTESTED**   | ?               | ?              | 🔴 VERIFY   |
| Gold (85%) on Sapphire (45%)       | Accent on primary | ⚠️ **UNTESTED**   | ?               | ?              | 🔴 VERIFY   |
| Platinum (85% 0.02) on backgrounds | Borders/dividers  | ⚠️ **LOW CHROMA** | Likely Fail     | Likely Fail    | 🔴 CRITICAL |

### Problem Analysis

OKLCH colors with low chroma (platinum: 0.02, pearl: 0.045) may produce low contrast when combined. Additionally, Tailwind's opacity modifiers (`/14`, `/20`) further reduce contrast.

**Example from CSS**:

```css
--cs-glass-bg-platinum: var(--cs-glass-platinum)/14; /* Platinum at 14% opacity */
```

This creates extremely low contrast for borders/text. **WCAG AA requires 4.5:1 minimum for body text; 3:1 for UI components.**

### Deep-Debug Contrast Verification

```bash
# Install contrast checker
npm install -g wcag-contrast

# Test specific color combinations
wcag-contrast "oklch(91.5% 0.045 95)" "oklch(45% 0.14 270)"
wcag-contrast "oklch(85% 0.02 250)" "oklch(91.5% 0.045 95)"
```

---

## 3. FOCUS INDICATORS & KEYBOARD NAVIGATION 🔴 MISSING

**Status**: ❌ **WCAG 2.4.7 VIOLATION**

### Current State

No `:focus-visible` styles found in templates.

### Found Hover Styles (No Focus Equivalents)

```html
<!-- From menu.html -->
<a
  class="cs-glass-button hover:cs-glass-brightness-150 p-1 hover:ring hover:ring-accent hover:scale-125"
>
  <!-- From services.html -->
  <a class="cs-glass-button hover:scale-105 transition-all">
    <!-- From section.html -->
    <a class="focus:cs-glass-shimmer-hover">
      <!-- Minimal; not sufficient --></a
    ></a
  ></a
>
```

### Issue Analysis

- `focus:cs-glass-shimmer-hover` is **NOT visible enough** for keyboard users
- Shimmer effect is subtle; won't provide sufficient visual feedback
- No `:focus-visible:ring-*` patterns (Tailwind's recommended accessible focus)
- Users relying on keyboard navigation will struggle to identify which element has focus

**WCAG 2.4.7 Requirement**: "Keyboard focus indicator must be visible with a contrast ratio of at least 3:1 against adjacent color."

### Required Fix

```html
<!-- Add visible focus rings (minimum 2px, high contrast) -->
<a
  class="cs-glass-button 
         focus-visible:ring-2 
         focus-visible:ring-offset-2 
         focus-visible:ring-accent 
         focus-visible:outline-none
         hover:cs-glass-brightness-150"
></a>
```

---

## 4. MOTION & PREFERS-REDUCED-MOTION 🔴 NOT IMPLEMENTED

**Status**: ❌ **WCAG 2.3.3 & 2.4.3 VIOLATIONS**

### Current Animations (from main.css)

```css
@keyframes shift-x {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 100% 0%;
  }
}

@keyframes sideways-scroll {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}
```

### Transitions Found

- `transition-all duration-300` (buttons, links)
- `hover:scale-105` (scaling animations)
- `hover:brightness-125` (color changes)

### Missing

**ZERO instances** of `motion-safe:` or `motion-reduce:` prefixes.

**WCAG 2.3.3 Requirement**: "Users with vestibular disorders or motion sensitivity must be able to disable animations."

### Required Fix Pattern

```css
/* In CSS @theme block */
@utility animate-gentle {
  animation: shift-x 3s ease-in-out infinite;
}

@utility animate-gentle-safe {
  @media (prefers-reduced-motion) {
    animation: none;
  }
}
```

```html
<!-- In templates -->
<div class="animate-gentle-safe">
  <!-- Content -->
</div>
```

Or use Tailwind's built-in:

```html
<div class="motion-safe:animate-pulse motion-reduce:animate-none"></div>
```

---

## 5. TOUCH TARGETS & MOBILE ACCESSIBILITY 🟡 PARTIAL

**Status**: ⚠️ **INCONSISTENT SIZING**

### Touch Target Analysis

| Component              | Classes                        | Height      | Width      | Status            |
| ---------------------- | ------------------------------ | ----------- | ---------- | ----------------- |
| Menu buttons           | `p-1` (0.25rem)                | ~24px       | ~24px      | 🔴 **TOO SMALL**  |
| CTA buttons            | `px-6 py-3`                    | 48px        | Varies     | ✅ **OK**         |
| Service tabs           | `px-4 py-2`                    | 32px        | Varies     | 🟡 **BORDERLINE** |
| Links in announcements | `hover:underline` (no padding) | Text height | Text width | 🔴 **FAIL**       |
| Map embed              | Standard iframe                | ✅          | ✅         | ✅ **OK**         |

**WCAG 2.5.5 Requirement**: Minimum 44x44px for touch targets.

### Problem Areas

1. Menu icon buttons (`p-1`) are only ~24x24px — fails for motor impairments
2. Links in prose have no padding — text-only click targets
3. Service tab buttons (`py-2`) are 32px (10px below minimum)

### Required Fix

```html
<!-- Expand touch targets -->
<a class="cs-glass-button p-3 md:p-1">
  <!-- p-3 = 0.75rem on mobile, p-1 on desktop -->
  <button class="service-tab-btn px-4 py-3 md:py-2">
    <!-- Minimum 44px on mobile -->
    <a class="inline-block px-2 py-1">Learn More</a>
    <!-- Add padding to text links -->
  </button></a
>
```

---

## 6. COLOR-ONLY COMMUNICATION 🔴 FAILS COLOR-BLIND USERS

**Status**: ❌ **WCAG 1.4.1 VIOLATION**

### Problem

UI relies on **color + brightness changes** to communicate state:

```html
<!-- From menu.html -->
<a class="hover:cs-glass-brightness-150 hover:ring hover:ring-accent">
  <!-- From services.html -->
  <div class="cs-glass-button hover:brightness-125">
    <!-- Palette theme switching -->
    <div class="theme-urgent"><!-- Color change alone --></div>
  </div></a
>
```

### Issue Analysis

Users with color blindness (8% of males, 0.5% of females) cannot distinguish:

- Current theme (clinical vs healing vs calming vs urgent)
- Hover state from normal state (relies on brightness delta)
- Active vs inactive tabs (only color changes)

**WCAG 1.4.1 Requirement**: "Color is not used as the only means of conveying information."

### Solutions

1. **Add text indicators**: "Active", badges, checkmarks
2. **Add patterns**: Underlines, borders, fills (not just color)
3. **Add icons**: Checkmark for active, star for current theme
4. **Add ARIA labels**: `aria-current="page"`, `aria-selected="true"`

### Example Fix

```html
<!-- Current (color-only) -->
<a class="theme-healing">Healing Theme</a>

<!-- Fixed (color + pattern + label) -->
<a class="theme-healing border-4 border-emerald" aria-current="page">
  <span class="font-bold">✓ Healing Theme</span>
</a>
```

---

## 7. SEMANTIC HTML & TAILWIND ALIGNMENT 🟡 PARTIAL

**Status**: ⚠️ **MIXED**

### Good Practices

- ✅ Uses semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<time>`
- ✅ ARIA attributes present (`aria-current`, `aria-modal`, `aria-hidden`, `aria-labelledby`)
- ✅ Form structure in modals (`aria-modal="true"`)

### Issues

**1. Invalid CSS Color Reference** (in atoms/map.html):

```html
<iframe style="border-2 border-emerald" />
<!-- ❌ 'emerald' not a CSS property -->
```

Should be:

```html
<iframe class="border-2 border-emerald-500" />
```

**2. Inconsistent ARIA Usage**:

- Some buttons lack `role="button"` (divs masquerading as buttons)
- Some icons lack `aria-hidden="true"` for decorative icons
- Missing `aria-label` on icon-only buttons

**3. No Screen Reader Testing Evidence**:

- Dropdown menu accessibility untested (complex state management)
- Tab component (services.tabs.html) likely inaccessible without proper ARIA roles

---

## 8. RESPONSIVE DESIGN & MOBILE FIRST 🟢 GOOD

**Status**: ✅ **WELL IMPLEMENTED**

- Fluid typography with clamp() ✓
- Mobile-first breakpoints (md: prefix used correctly)
- Flexible layouts (grid, flex with gap utilities)
- Responsive images (w-full, h-auto)
- No layout shifts detected (CSS is stable)

**Note**: Accessibility issues above impact mobile experience disproportionately (smaller screens, touch input).

---

## 9. CUSTOM UTILITIES & DESIGN SYSTEM 🟡 AMBITIOUS BUT RISKY

**Status**: ⚠️ **POWERFUL BUT HARD TO MAINTAIN**

### Custom Utilities Found

- `cs-glass-button` — Button base style
- `cs-glass-brightness-150` — Hover brightness shift
- `cs-glass-primary` — Dynamic theme adapter
- `elevation-0` to `elevation-5` — Shadow scale
- `cs-glass-shimmer` — Subtle animation
- `cs-glass-border-rounded-lg` — Glass border radius
- `cs-background-blur-4xl` — Backdrop filter

### Concerns

1. **Opacity Scales** (`-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl`, `-4xl`, `-5xl`) create large CSS output
2. **Duplication** in main.css (glass bg/border tokens defined twice)
3. **No Fallbacks** for glassmorphism (backdrop-filter not universally supported; needs solid color fallback)
4. **Hard to Audit**: Custom utils hide contrast issues; need systematic contrast testing

**Recommendation**: Create a utility inventory + contrast audit spreadsheet before next design iteration.

---

## 10. ACCESSIBILITY CHECKLIST & COMPLIANCE STATUS

| Criterion                   | Status     | Evidence                    | Action                      |
| --------------------------- | ---------- | --------------------------- | --------------------------- |
| **WCAG 2.1 Level AA**       | ❌ FAIL    | Multiple violations         | See below                   |
| Color contrast (4.5:1 text) | ⚠️ UNKNOWN | Not tested                  | Test with WebAIM            |
| Focus indicators            | ❌ FAIL    | No `:focus-visible`         | Add ring-2 styles           |
| Keyboard navigation         | ⚠️ PARTIAL | Menu works; dropdowns?      | Full keyboard test          |
| Touch targets (44x44px)     | ❌ FAIL    | Menu buttons 24px           | Increase padding on mobile  |
| Motion preferences          | ❌ FAIL    | No `prefers-reduced-motion` | Add motion-safe/reduce      |
| Color-only communication    | ❌ FAIL    | Brightness = state          | Add text/pattern indicators |
| Alt text                    | ⚠️ PARTIAL | Generic; needs improvement  | Hugo audit recommended      |
| Form labels                 | ✅ PASS    | Present in modals           | Monitor new forms           |
| Skip links                  | ❌ MISSING | Not detected                | Add to baseof.html          |
| Language declared           | ✅ PASS    | `lang="en-us"`              | Good                        |

---

## PRIORITY FIXES (Quick Wins)

### Immediate (< 1 hour)

- Add focus-visible ring utilities to menu, buttons, links
- Add `motion-safe:` / `motion-reduce:` to animations
- Fix invalid CSS in map.html (`border-emerald` → `border-emerald-600`)

### High Priority (1-2 hours)

- Increase touch targets on mobile (`p-1` → `p-3 md:p-1`)
- Add ARIA labels to icon-only buttons
- Test and document contrast ratios (WebAIM, WAVE)

### Medium Priority (2-4 hours)

- Add visual state indicators (checkmarks, underlines) alongside color
- Create skip link partial
- Screen reader test with VoiceOver/NVDA

---

## DEEP-DEBUG TESTING PROTOCOL

```bash
# 1. Contrast Analysis
npx wcag-contrast "oklch(91.5% 0.045 95)" "oklch(45% 0.14 270)"
# Expected: >= 4.5 for text

# 2. Automated WCAG Check
npx axe-core-cli https://paulbrown.net

# 3. Lighthouse Accessibility Score
npx lighthouse https://paulbrown.net --output=json | jq '.categories.accessibility'

# 4. Keyboard-only navigation
# Open DevTools → Press Tab repeatedly → verify focus is visible on all interactive elements

# 5. Color blindness simulation
# Chrome DevTools → Rendering → Emulate CSS Media Feature prefers-color-scheme/reduced-motion
# Then manually test: Deuteranopia (red-green), Protanopia, Tritanopia

# 6. Motion sensitivity test
# Chrome DevTools → Rendering → Emulate CSS Media Feature prefers-reduced-motion: reduce
# Verify animations stop or become subtle

# 7. Screen reader (macOS)
VoiceOver -h  # Start VoiceOver
# Navigate with VO+arrow keys; verify all interactive elements are announced
```

---

## RECOMMENDATIONS SUMMARY

✅ **Continue**: Mobile-first design, fluid typography, semantic HTML framework

⚠️ **Refactor**: Custom utility system (document & audit contrast)

🔴 **Fix Immediately**: Focus indicators, motion preferences, touch targets, color-only communication, contrast verification

---

**Report Generated**: 2026-08-12  
**Status**: Awaiting approval for next expert audit
