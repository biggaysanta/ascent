# IMAGE GUIDANCE EXPERT AUDIT REPORT — PART 1

**Date**: 2026-08-12 | **Project**: Ascent (Paul Brown Massage Therapy)

---

## EXECUTIVE SUMMARY

The site uses **minimal visual hierarchy and imagery**. Content relies heavily on text-based explanations (good for E-E-A-T signals) but lacks strategic imagery to:

- Break up dense text blocks
- Communicate pain conditions visually
- Establish emotional connection (trust, compassion)

**Key Observations**:

- ❌ No hero image/visual on home page (missed opportunity)
- ❌ Pain condition articles (shoulder, headaches) lack anatomical diagrams
- ❌ Featured images exist but generic alt text ("featured image")
- ⚠️ Custom glass-morphism design is visual but doesn't serve conversion funnel
- ✅ Color palette (emerald green, gem tones) aligns with healthcare/wellness brand

**Overall Visual Direction Score**: 🟡 **PARTIAL** (Tactical; lacks strategic conversion design)

---

## 1. HOMEPAGE VISUAL HIERARCHY & HERO SECTION 🔴 MISSING

**Status**: ❌ **NO STRATEGIC VISUAL ENTRY POINT**

### Current Home Page Structure

```html
<!-- From home.html -->
{{ .Content }}
<!-- Just content block; no hero image -->
{{ partial "announcements.html" }} {{ partial "organisms/services.tabs.html" }}
```

**Analysis**:

- Hero section is **text-only** ("I'm Paul Brown, and I set people free.")
- No background image, gradient, or visual anchor
- Immediate cognitive load: wall of text

### Recommended Hero Section (Text + Visual)

```html
<section class="hero-section relative h-100 md:h-150 overflow-hidden">
  <!-- Background image with overlay for text readability -->
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url('images/hero-massage-therapy-hands.jpg')"
  >
    <!-- Dark scrim for text contrast -->
    <div class="absolute inset-0 bg-black/40"></div>
  </div>

  <!-- Content: Leading lines toward CTA -->
  <div
    class="relative h-full flex flex-col justify-center items-center text-center px-4"
  >
    <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
      I'm Paul Brown, and I Set People Free
    </h1>
    <p class="text-lg md:text-2xl text-emerald-100 mb-8 max-w-2xl">
      Expert medical massage therapy for Sacramento's busy professionals. Relief
      from chronic pain, stress, and muscle tension.
    </p>

    <!-- CTA button as visual anchor -->
    <button
      class="cs-glass-button px-8 py-4 text-lg font-bold 
                   hover:scale-105 transition-all
                   focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400"
    >
      Book Your Session Now
    </button>
  </div>

  <!-- Subtle down-arrow indicator (visual lead) -->
  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
    <svg
      class="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      ></path>
    </svg>
  </div>
</section>
```

### Visual Strategy

**Leading Lines & Flow**:

```
Hero (Pain Problem)
  ↓
Services (Solutions)
  ↓
Testimonials (Social Proof)
  ↓
CTA (Book Now)
```

**Image Recommendations**:

- Hero: Professional hands-on massage therapy (trust, expertise)
- Services section: 7 different massage modalities (visual variety)
- Testimonials: Real client photos (if available; E-E-A-T boost)

---

## 2. PAIN CONDITION ARTICLES — MISSING VISUAL HIERARCHY 🔴 CRITICAL

**Status**: ❌ **TEXT-HEAVY; NO ANATOMICAL GUIDES**

### Current Article Structure

Example: "Burning Pain Between Shoulder Blades"

```markdown
# Heading 1

## Section Heading

Paragraph 1 (300+ words)
Paragraph 2 (400+ words)
Diagram (ASCII art only)
List of treatments

No visual breaks, no images, no anatomical diagrams.
```

**Problem for Readability**:

- Users scanning page (78% of web users) have no visual entry points
- Dense text fatigues eyes
- No images for visual learners
- Missing opportunity to show **BEFORE/AFTER** relief

### Recommended Visual Additions

**1. Anatomical Diagram (for shoulder article)**

Create/source an SVG showing:

- Rhomboid muscles highlighted
- Pain radiation pathway (C5-C7 referral pattern)
- Movement restriction zones

```html
<figure class="my-8 p-6 bg-emerald-50 rounded-lg border-2 border-emerald-200">
  <svg viewBox="0 0 400 500" class="w-full max-w-md mx-auto">
    <!-- SVG: Back anatomy showing shoulder blade region -->
    <g id="spine" stroke="currentColor" stroke-width="2" fill="none">
      <!-- Spine -->
      <line x1="200" y1="50" x2="200" y2="450" stroke="gray" stroke-width="3" />

      <!-- Shoulder blades -->
      <ellipse
        cx="150"
        cy="150"
        rx="50"
        ry="80"
        fill="rgba(16, 185, 129, 0.1)"
        stroke="currentColor"
      />
      <ellipse
        cx="250"
        cy="150"
        rx="50"
        ry="80"
        fill="rgba(16, 185, 129, 0.1)"
        stroke="currentColor"
      />

      <!-- Pain zones (red)-->
      <circle
        cx="170"
        cy="180"
        r="30"
        fill="rgba(239, 68, 68, 0.2)"
        stroke="rgb(220, 38, 38)"
        stroke-width="2"
        stroke-dasharray="5,5"
      />
      <circle
        cx="230"
        cy="180"
        r="30"
        fill="rgba(239, 68, 68, 0.2)"
        stroke="rgb(220, 38, 38)"
        stroke-width="2"
        stroke-dasharray="5,5"
      />
    </g>
  </svg>
  <figcaption class="text-center text-sm text-gray-600 mt-4">
    Interscapular pain zone (between shoulder blades) — primary rhomboid region
  </figcaption>
</figure>
```

**2. Comparison Visual: Poor Posture vs. Correct Posture**

```html
<div class="grid md:grid-cols-2 gap-8 my-8">
  <!-- Poor Posture -->
  <div class="text-center">
    <figure>
      <img
        src="posture-poor.svg"
        alt="Slouched posture causing shoulder blade strain"
        class="w-full"
      />
      <figcaption class="text-red-600 font-bold mt-2">
        ❌ Forward Head Posture
      </figcaption>
      <ul class="text-sm mt-2 text-left">
        <li>• Thoracic kyphosis (rounding)</li>
        <li>• Shoulder protraction</li>
        <li>• Rhomboid overstretch</li>
      </ul>
    </figure>
  </div>

  <!-- Correct Posture -->
  <div class="text-center">
    <figure>
      <img
        src="posture-correct.svg"
        alt="Proper spinal alignment relieving shoulder blade pain"
        class="w-full"
      />
      <figcaption class="text-emerald-600 font-bold mt-2">
        ✅ Neutral Spine
      </figcaption>
      <ul class="text-sm mt-2 text-left">
        <li>• Chest open</li>
        <li>• Shoulder stable</li>
        <li>• Muscle at rest length</li>
      </ul>
    </figure>
  </div>
</div>
```

**3. Treatment Modality Icons + Visual CTA**

```html
<section class="treatment-options my-8">
  <h3 class="text-2xl font-bold mb-6 text-center">Relief Strategies</h3>

  <div class="grid md:grid-cols-3 gap-6">
    <!-- Deep Tissue Release -->
    <div
      class="text-center p-4 rounded-lg bg-emerald-50 border-2 border-emerald-200"
    >
      <svg class="w-16 h-16 mx-auto text-emerald-600 mb-4">
        <!-- Icon: Hands applying pressure -->
      </svg>
      <h4 class="font-bold mb-2">Deep Tissue Release</h4>
      <p class="text-sm text-gray-600">Target overworked rhomboid fibers</p>
    </div>

    <!-- Posture Correction -->
    <div class="text-center p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
      <svg class="w-16 h-16 mx-auto text-blue-600 mb-4">
        <!-- Icon: Spine alignment -->
      </svg>
      <h4 class="font-bold mb-2">Posture Correction</h4>
      <p class="text-sm text-gray-600">Rebalance chest and back muscles</p>
    </div>

    <!-- Lifestyle Changes -->
    <div
      class="text-center p-4 rounded-lg bg-amber-50 border-2 border-amber-200"
    >
      <svg class="w-16 h-16 mx-auto text-amber-600 mb-4">
        <!-- Icon: Ergonomic desk -->
      </svg>
      <h4 class="font-bold mb-2">Ergonomic Setup</h4>
      <p class="text-sm text-gray-600">Prevent future strain at desk</p>
    </div>
  </div>
</section>
```

# IMAGE GUIDANCE EXPERT AUDIT REPORT — PART 2

**Continuing from Part 1...**

---

## 3. FEATURED IMAGES & ALT TEXT STRATEGY 🟡 PRESENT BUT WEAK

**Status**: ⚠️ **IMAGES EXIST; ALT TEXT IS GENERIC**

### Current Implementation (page.html)

```html
<img
  src="{{ .RelPermalink }}"
  alt="{{ $.Title }} featured image"
  class="w-full h-auto object-cover rounded-t-lg"
/>
```

**Issues**:

1. 🔴 **Alt text is generic & unhelpful**
   - "Burning Pain Between Shoulder Blades featured image"
   - Screen readers read this; search engines see this as SEO signal
   - Doesn't describe what's in the image

2. ⚠️ **Missing image metadata**
   - No `title` attribute (hover text)
   - No `loading="lazy"` (performance)
   - No `srcset` (responsive images)

3. ⚠️ **No image caption**
   - Readers don't know context of image
   - Missing SEO keyword reinforcement

### Recommended Alt Text Standards

**Pattern**:

```
alt="[WHO] [DOING WHAT] [CONTEXT]"
```

**Examples**:

| Current                       | Recommended                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| "Burning Pain featured image" | "Therapist performing deep tissue massage on shoulder blades"                                |
| "Shoulder anatomy"            | "Anatomical diagram showing rhomboid and trapezius muscles with pain referral pathways"      |
| "Services tabs graphic"       | "Seven massage modality options: release, refresh, relate, recharge, renew, receive, repeat" |

### Improved page.html

```html
{{ with resources.GetMatch .Params.image }}
  <figure class="w-full">
    <img
      src="{{ .RelPermalink }}"
      alt="{{ .Params.image_alt | default (printf "Professional massage therapy illustration for %s" $.Title) }}"
      title="{{ $.Title }}"
      loading="lazy"
      width="800"
      height="600"
      srcset="{{ .RelPermalink }}?w=400 400w,
              {{ .RelPermalink }}?w=800 800w,
              {{ .RelPermalink }}?w=1200 1200w"
      sizes="(max-width: 640px) 400px, 800px"
      class="w-full h-auto object-cover rounded-t-lg">
    <figcaption class="text-sm text-gray-500 mt-2 px-4">
      {{ .Params.image_caption | default "Featured image for this article" }}
    </figcaption>
  </figure>
{{ end }}
```

### Front Matter Enhancement

**Add to article front matter** (e.g., shoulder-pain articles):

```yaml
---
title: "Burning Pain Between Shoulder Blades"
image: "images/shoulder-deep-tissue.jpg"
image_alt: "Therapist's hands performing myofascial release on client's interscapular region"
image_caption: "Deep tissue massage targets the rhomboid and middle trapezius muscles"
---
```

---

## 4. VISUAL CONVERSION FUNNEL — MISSING STRATEGIC FLOW 🔴 CRITICAL

**Status**: ❌ **NO GUIDED VISUAL PROGRESSION**

### Current User Journey (Text-Only)

```
Landing → Read Dense Content → Search for CTA → Confused
                              ↓
                        (What do I do now?)
```

### Recommended Visual Funnel

**Stage 1: ATTENTION (Hero)**

```
[Large hero image: Peaceful massage session]
Headline: "Release the Tension Holding You Back"
Subheadline: "Professional medical massage for Sacramento professionals"
Visual CTA: Prominent "Book Now" button
```

**Stage 2: INTEREST (Services Overview)**

```
[7 service cards with icons + images]
- Release (deep tissue) [icon: pressure]
- Refresh (sports massage) [icon: athlete]
- Relate (couples massage) [icon: two people]
- Recharge (hot stone) [icon: stone]
- Renew (myofascial) [icon: connective tissue]
- Receive (gift certificates) [icon: gift]
- Repeat (membership) [icon: calendar]

Visual: Color-coded cards with modality-specific imagery
Lead: "Which service fits your needs?"
```

**Stage 3: CONSIDERATION (Problem/Solution)**

```
Pain Condition Hub (shoulder, headaches, etc.)
[Anatomical diagram] + [Symptom checklist]
"Do you have this? Here's what causes it..."
Related article links (internal cross-linking)
```

**Stage 4: DECISION (Social Proof + CTA)**

```
[Client testimonial cards with photos]
"5-star reviews from Sacramento professionals"
[Video testimonial embeds if available]
Primary CTA: "Book Your First Session"
Secondary CTA: "Learn About Packages"
```

### Implementation in Hugo

Create a `funnel-visual.html` partial:

```html
{{ define "partials/organisms/conversion-funnel.html" }}
<section class="conversion-funnel space-y-16 py-12">
  <!-- Stage 1: Attention Hero -->
  <section class="hero-stage relative h-96 md:h-125 rounded-xl overflow-hidden">
    <img
      src="images/hero-massage-professional.jpg"
      alt="Professional massage therapist performing therapeutic massage on client"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-black/40"></div>
    <div
      class="relative h-full flex flex-col justify-center items-center text-center text-white px-4"
    >
      <h2 class="text-4xl md:text-5xl font-bold mb-4">
        Release the Tension Holding You Back
      </h2>
      <p class="text-lg mb-8 max-w-xl">
        Professional medical massage therapy tailored to your body
      </p>
      <a
        href="#booking"
        class="cs-glass-button px-6 py-3 text-lg font-bold hover:scale-105"
      >
        Book Your Session
      </a>
    </div>
  </section>

  <!-- Stage 2: Interest Services Grid -->
  <section class="services-stage">
    <h3 class="text-3xl font-bold text-center mb-12">
      Choose Your Healing Path
    </h3>
    {{ partial "organisms/services.tabs.html" . }}
  </section>

  <!-- Stage 3: Consideration Pain Guides -->
  <section class="consideration-stage">
    <h3 class="text-3xl font-bold text-center mb-12">
      Common Pain, Clear Solutions
    </h3>
    <div class="grid md:grid-cols-3 gap-8">
      {{ range slice "shoulder" "headaches" "low-back" }}
      <div
        class="rounded-lg border-2 border-emerald-200 overflow-hidden hover:shadow-lg transition"
      >
        <img
          src="images/{{ . }}-anatomy.svg"
          alt="{{ . }} anatomical region"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h4 class="font-bold text-lg capitalize mb-2">{{ . }} Pain Relief</h4>
          <a href="/{{ . }}/" class="text-emerald-600 hover:underline"
            >Learn more →</a
          >
        </div>
      </div>
      {{ end }}
    </div>
  </section>

  <!-- Stage 4: Decision Social Proof -->
  <section class="decision-stage">
    <h3 class="text-3xl font-bold text-center mb-12">
      Join Hundreds of Happy Clients
    </h3>
    {{ partial "organisms/testimonials.html" . }}
  </section>
</section>
{{ end }}
```

# IMAGE GUIDANCE EXPERT AUDIT REPORT — PART 3 (FINAL)

**Continuing from Part 2...**

---

## 5. BRAND VISUAL GUIDELINES — GLASSMORPHISM VS. CLARITY 🟡 AMBITIOUS BUT RISKY

**Status**: ⚠️ **VISUALLY STUNNING; READABILITY CONCERNS**

### Current Design System

- **Hero pattern**: Glassmorphism (backdrop-filter, opacity layers)
- **Color palette**: Gem tones (emerald, sapphire, ruby, gold, amethyst)
- **Typography**: Fluid scaling (clamp() for responsive)
- **Imagery**: Minimal; relies on color + text

### Visual Strengths

✅ **Sophisticated, memorable aesthetic**
✅ **Aligns with "luxury healthcare" positioning**
✅ **Consistent color language across site**
✅ **Accessible color palette** (gem tones are vibrant)

### Visual Concerns

1. 🟡 **Glassmorphism reduces image clarity**
   - Layered semi-transparent elements obscure background
   - On images with fine details (anatomy diagrams), blur makes text unreadable
   - Fix: Use solid backgrounds for content-heavy sections

2. 🟡 **Too many decorative elements**
   - Butterfly animation on home (fun but distracts from booking)
   - Multiple color themes (clinical, healing, calming, urgent)
   - User overwhelmed; unclear which theme to trust
   - Fix: Simplify to 1-2 primary themes; animated accents only

3. ⚠️ **Image quality not prioritized**
   - Hero image missing entirely (huge missed opportunity)
   - Existing images lack optimization (no srcset, no lazy-loading)
   - Fix: Audit images for quality, compression, responsive sizes

### Recommended Visual Simplification

**For Readability**:

```css
/* Keep glassmorphism for decorative elements only */
.cs-glass-button {
  /* ✅ Keep: small, decorative */
}
.service-box {
  /* ❌ Change: needs solid background */
}
.article-header {
  /* ❌ Change: needs solid for image + text */
}

/* New: Solid backgrounds for content */
.article-section {
  background: solid white or theme-neutral;
  padding: 1.5rem;
}

.featured-image {
  /* No overlay; let image breathe */
  background: transparent;
  border: 2px solid var(--primary);
}
```

**For Visual Hierarchy**:

```
Primary Brand Color: Emerald (trust, healthcare, growth)
Accent Color: Gold (premium, attention)
Neutrals: Platinum, Pearl (breathing room)

Remove: Amethyst, Ruby (confusing; split attention)
Keep: Clinical vs. Healing themes; drop Calming, Urgent
```

---

## 6. IMAGE CONTENT STRATEGY — BY SECTION 🟢 ACTIONABLE

**Status**: ✅ **CLEAR RECOMMENDATIONS**

### Homepage

| Section      | Current    | Recommended Image                                | Purpose                         |
| ------------ | ---------- | ------------------------------------------------ | ------------------------------- |
| Hero         | None       | Hands-on massage session (professional, calming) | Immediate trust, emotion        |
| Services     | Icons only | 7 modality cards with subtle photography         | Visual variety, service clarity |
| Testimonials | Text only  | Client headshots (with permission)               | E-E-A-T, social proof           |
| CTA Footer   | Text only  | Appointment calendar + booking visual            | Conversion focus                |

### Pain Condition Articles (Shoulder, Headaches, Low Back)

| Section     | Current   | Recommended Image                                | Purpose                   |
| ----------- | --------- | ------------------------------------------------ | ------------------------- |
| Intro       | Generic   | Anatomical diagram (SVG) showing affected region | Education, visual anchor  |
| Causes      | Text      | Before/after posture comparison                  | Visual learning           |
| Treatment   | Text list | Icons + photos of each modality                  | Accessibility             |
| Testimonial | Text      | Client photo + quote                             | Social proof, specificity |

### Blog Articles (Writings)

| Section      | Current | Recommended Image                                    | Purpose               |
| ------------ | ------- | ---------------------------------------------------- | --------------------- |
| Featured     | Generic | Article-specific image (massage, wellness, movement) | Visual variety        |
| Sections     | None    | Breakup text every 300 words with relevant image     | Scannability          |
| Video embeds | Links   | Embedded YouTube testimonials                        | Engagement, retention |

### Services Page

| Section       | Current    | Recommended Image                    | Purpose                  |
| ------------- | ---------- | ------------------------------------ | ------------------------ |
| Service cards | Cards text | High-quality photo for each modality | Decision clarity         |
| Pricing       | Text only  | Compare tables with visual icons     | Cognitive load reduction |
| FAQ           | Accordion  | None needed                          | Text-based is fine       |

---

## 7. IMAGE ASSET INVENTORY & SOURCING 🔴 ACTION REQUIRED

**Status**: ❌ **NO ASSET MANAGEMENT SYSTEM**

### Required Images

**High Priority** (for funnel):

1. **Hero Image**: Professional massage therapist in session
   - Recommended: [Unsplash](https://unsplash.com/s/photos/massage-therapy), [Pexels](https://www.pexels.com/search/massage/)
   - Size: 1920×1080px (desktop), 1080×1350px (mobile)
   - License: Free commercial use (Unsplash/Pexels)

2. **Anatomical Diagrams** (7 for shoulder, headaches, low-back, etc.):
   - Recommended: Commission custom SVGs or use [BioRender](https://www.biorender.com/) for healthcare accuracy
   - Cost: $50-200 per diagram
   - Quality: Medical-grade, clear labels, accessibility compliant

3. **Service Modality Icons** (7 for release, refresh, relate, etc.):
   - Recommended: [Material Design Icons](https://fonts.google.com/icons), [Heroicons](https://heroicons.com/), or custom
   - Free: Material Icons (already in project)
   - Custom: $200-500 for branded set

4. **Client Testimonial Photos** (5-10 if available):
   - Recommended: Collect from past clients (with permission)
   - Alternative: Stock photos of diverse professionals (Unsplash, Pexels)
   - Professional: Headshots ideally; casual portraits acceptable

**Medium Priority**:

5. **Posture Comparison SVGs** (poor vs. correct spinal alignment)
6. **Treatment Icons** (deep tissue, stretching, heat therapy, etc.)
7. **Lifestyle/Ergonomic Setup Images** (desk setup, stretching guide)

**Low Priority**:

8. **Background textures** (muscle tissue, flowing water, organic shapes)
9. **Decorative elements** (dividers, flourishes)

### Image Optimization Strategy

```bash
# 1. Organize images in Hugo
content/images/
├── hero/
│   ├── massage-hero.jpg (1920×1080)
│   └── massage-hero-mobile.jpg (1080×1350)
├── anatomy/
│   ├── shoulder-diagram.svg
│   ├── neck-diagram.svg
│   └── low-back-diagram.svg
├── services/
│   ├── release-icon.svg
│   ├── refresh-icon.svg
│   └── [7 total]
└── testimonials/
    ├── client-sarah.jpg
    └── [5-10 total]

# 2. Optimize JPEGs
npx imagemin content/images/hero/*.jpg --out-dir=static/images/hero --plugin=mozjpeg

# 3. Generate WebP versions
cwebp content/images/hero/massage-hero.jpg -o static/images/hero/massage-hero.webp

# 4. Create srcset in Hugo
{{ with .Params.hero_image }}
  <img src="{{ . }}"
       srcset="{{ . }}?w=600 600w, {{ . }}?w=1200 1200w, {{ . }}?w=1920 1920w"
       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1920px"
       alt="Hero image description">
{{ end }}
```

---

## 8. ACCESSIBILITY FOR VISUAL CONTENT 🟡 PARTIAL

**Status**: ⚠️ **ALT TEXT NEEDED; COLORS OK**

### Accessibility Checklist

| Item              | Status         | Action                                  |
| ----------------- | -------------- | --------------------------------------- |
| Alt text          | ❌ Generic     | Write descriptive alt per image         |
| Color contrast    | ✅ OK          | Colors pass WCAG AA (verify with tool)  |
| Image text        | ⚠️ In diagrams | Add text labels outside image           |
| Video captions    | ❌ Missing     | Add captions to YouTube embeds          |
| Decorative images | ⚠️ Mixed       | Mark with `alt=""` if purely decorative |
| SVG accessibility | ⚠️ Unknown     | Add `<title>`, `<desc>` to SVGs         |

### Example: Accessible Anatomical Diagram

```html
<figure class="anatomy-diagram rounded-lg p-6 bg-emerald-50">
  <img
    src="shoulder-anatomy.svg"
    alt="Anatomical diagram of the shoulder showing the rhomboid major and minor muscles, trapezius, and C5-C7 nerve root pathways. The interscapular zone between the shoulder blades is highlighted in red."
    loading="lazy"
  />

  <figcaption class="text-sm text-gray-600 mt-4">
    <h4 class="font-bold">Figure: Shoulder Blade Anatomy</h4>
    <p><strong>Labeled structures:</strong></p>
    <ul class="ml-4 mt-2">
      <li>Rhomboid Major (purple, large muscle)</li>
      <li>Rhomboid Minor (purple, above major)</li>
      <li>Middle Trapezius (blue, outer muscle)</li>
      <li>C5-C7 Nerve Roots (green pathways from spine)</li>
      <li>Interscapular Pain Zone (red, center)</li>
    </ul>
  </figcaption>
</figure>
```

---

## 9. RECOMMENDATIONS SUMMARY

### 🔴 Critical (Do First)

1. ✅ Add hero image to homepage (1920×1080 minimum)
2. ✅ Rewrite all alt text to be descriptive and specific
3. ✅ Create/source 7 anatomical diagrams for pain articles
4. ✅ Implement responsive image srcset + lazy-loading
5. ✅ Commission or source high-quality service modality images

### 🟡 High Priority

6. ✅ Build conversion funnel visual flow (hero → services → proof → CTA)
7. ✅ Add image captions + figcaptions to all content images
8. ✅ Create posture comparison SVGs (before/after)
9. ✅ Optimize image file sizes + create WebP versions
10. ✅ Add SVG accessibility labels (`<title>`, `<desc>`)

### 🟢 Medium Priority

11. ✅ Collect client testimonial photos (with permission)
12. ✅ Simplify color palette (focus on emerald + gold)
13. ✅ Replace generic glass-morphism with solid backgrounds for content
14. ✅ Create image asset management system in Hugo
15. ✅ Test color contrast with WebAIM, WAVE

---

## 10. COMPLIANCE SUMMARY

| Standard              | Metric          | Status     | Evidence                            |
| --------------------- | --------------- | ---------- | ----------------------------------- |
| **WCAG 2.1 Level AA** | Alt text        | ❌ FAIL    | Generic alt text ("featured image") |
| **Visual Hierarchy**  | Conversion flow | ⚠️ WEAK    | No strategic visual funnel          |
| **Image Quality**     | Responsiveness  | ⚠️ PARTIAL | No srcset; missing hero image       |
| **Accessibility**     | SVG/color       | 🟡 OK      | Colors OK; missing SVG labels       |
| **E-E-A-T Signals**   | Visual proof    | ❌ MISSING | No client photos; no expert imagery |

---

**Report Generated**: 2026-08-12  
**Status**: Ready for SEO Local AI Expert audit
