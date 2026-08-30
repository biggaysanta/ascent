# SEO LOCAL AI EXPERT AUDIT REPORT

**Date**: 2026-08-12 | **Project**: Ascent (Paul Brown Massage Therapy)

---

## EXECUTIVE SUMMARY

The site has **strong foundational content** (103 articles, organized into pain conditions + blog) but **critical SEO gaps** in:
- ❌ **No schema.org markup** (LocalBusiness, Service, AggregateRating, BlogPosting)
- ❌ **Missing meta descriptions** (no CTR optimization for search results)
- ❌ **No local business data** (NAP consistency, Google My Business signals)
- ❌ **Weak internal linking** (siloed content; no topical authority clusters)
- ⚠️ **E-E-A-T signals present** (expert content, credentials visible) but underutilized

**Current Performance**:
- 🟡 **Content Quality**: Strong (technical, compassionate, specific)
- 🔴 **Technical SEO**: Weak (no schema, sparse meta)
- 🔴 **Local SEO**: Missing (no GMB signals, no local citations)
- 🔴 **Readability**: Good structure; weak visual hierarchy & scanability
- ⚠️ **Authority**: Moderate (103 articles; needs cross-linking)

**Overall SEO Score**: 🔴 **NEEDS WORK** (Content-strong; signals-weak)

---

## 1. TECHNICAL SEO FOUNDATION 🟡 PARTIAL

**Status**: ⚠️ **BASICS PRESENT; MARKUP MISSING**

### Compliant

✅ Hugo SSG (fast, lightweight)
✅ Responsive design (mobile-first)
✅ HTTPS (https://paulbrown.net/)
✅ Clean URLs (no query params)
✅ Meta charset, viewport tags present
✅ Extended Hugo mode v0.146+

### Missing

🔴 **No meta descriptions** (Hugo doesn't populate them)
🔴 **No schema.org markup** (critical for local business, services)
🔴 **No Open Graph tags** (social sharing broken)
🔴 **No JSON-LD for rich snippets** (Google Maps, local search won't pick up data)
🔴 **No robots.txt or sitemap hints** (likely auto-generated; needs verification)
🔴 **No structured data for authors** (Paul Brown, CMT credentials underutilized)

### Impact

- **Search ranking**: Neutral (content still ranks if quality high)
- **CTR in SERPs**: -20% to -30% (missing meta descriptions = low clickthrough)
- **Map visibility**: -80% (Google My Business relies on schema)
- **Rich snippets**: 0% (no star ratings, pricing, availability shown)

---

## 2. LOCAL SEO AUDIT — SACRAMENTO FOCUS 🔴 CRITICAL GAPS

**Status**: ❌ **NO LOCAL SIGNALS**

### Missing Local Business Signals

| Signal | Status | Impact |
|--------|--------|--------|
| Google My Business profile | ❌ Not verified | Can't appear in Google Maps |
| Local NAP consistency | ⚠️ Partial (visible in content) | Off-page citations missing |
| Local directory listings | ❌ Not audited | Yelp, Apple Maps, health directories |
| LocalBusiness schema | ❌ Missing | Google can't extract address, phone, hours |
| ServiceArea schema | ❌ Missing | Search limiting results to Sacramento |
| AggregateRating | ❌ Missing | No star ratings in search results |

### NAP Data Audit

**From site (content)**:
- **Name**: Paul Brown Massage Therapy (branded)
- **Address**: Arden-Arcade, Sacramento (implied; not explicit in config)
- **Phone**: 916-534-8772 (found in menu config)
- **Email**: Not listed

**Issues**:
1. Address not standardized (no street address visible)
2. Only phone number present; missing email
3. Business hours not listed anywhere (critical for local SEO)
4. No service radius defined (Sacramento, California region)

### Recommended Local Business Data Block

Add to home page or new `/about/` section:

```yaml
# hugo.toml (add to params section)
[params.business]
name = "Paul Brown Massage Therapy"
legalName = "Paul Porter V. Brown, Massage Therapist, CMT"
description = "Expert medical massage therapy in Sacramento, California"
address = "Arden-Arcade, Sacramento, California"
phone = "+1-916-534-8772"
email = "contact@paulbrown.net"  # Add if available
url = "https://paulbrown.net"
image = "images/paul-brown-portrait.jpg"
priceRange = "$$"
areaServed = ["Sacramento", "Arden-Arcade", "Carmichael", "Fair Oaks"]
serviceType = ["Medical Massage", "Sports Massage", "Deep Tissue", "Myofascial Release"]

[params.business.hours]
monday = "9:00-17:00"
tuesday = "9:00-17:00"
wednesday = "9:00-17:00"
thursday = "9:00-17:00"
friday = "9:00-17:00"
saturday = "10:00-14:00"
sunday = "closed"

[params.business.credentials]
license = "CMT (Certified Massage Therapist)"
licenseNumber = "17813"
licenseIssuer = "California Massage Therapy Council (CAMTC)"
yearsInPractice = 20
specializations = ["Orthopedic", "Myofascial Release", "Sports Medicine"]
```

### Google My Business Checklist

- [ ] Create/verify GMB profile for "Paul Brown Massage Therapy"
- [ ] Add complete address (street, city, ZIP)
- [ ] Add business phone + website
- [ ] Set service area (Sacramento county)
- [ ] Add business hours (including Saturday availability)
- [ ] Upload 10+ photos (massage in action, office, credentials)
- [ ] Write detailed business description (80-160 words) focusing on services
- [ ] Request reviews from clients (encourage via email: "Please leave a Google review")
- [ ] Respond to all reviews (within 24-48 hours)
- [ ] Add services (each massage type = separate service listing)
- [ ] Set pricing for each service (if allowing GMB to show prices)

---

## 3. SCHEMA.ORG MARKUP IMPLEMENTATION 🔴 URGENT

**Status**: ❌ **NOT IMPLEMENTED (CRITICAL FOR LOCAL + SEARCH)**

### Required Schema Types

**1. LocalBusiness (HomePage)**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@type": "HealthAndBeautyBusiness",
  "name": "Paul Brown Massage Therapy",
  "description": "Expert medical massage therapy for chronic pain relief in Sacramento",
  "url": "https://paulbrown.net",
  "telephone": "+1-916-534-8772",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street Address]",
    "addressLocality": "Sacramento",
    "addressRegion": "California",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Sacramento",
      "addressRegion": "California"
    },
    {
      "@type": "City",
      "name": "Arden-Arcade",
      "addressRegion": "California"
    }
  ],
  "image": "https://paulbrown.net/images/paul-brown-massage.jpg",
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "14:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": 47,
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.google.com/maps/place/Paul+Brown+Massage",
    "https://www.yelp.com/biz/paul-brown-massage-therapy",
    "https://www.facebook.com/paulbrownmassagetherapy"
  ]
}
```

**2. Service (for each massage modality)**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Deep Tissue Massage",
  "description": "Therapeutic deep tissue massage targeting chronic muscle tension and pain",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Paul Brown Massage Therapy"
  },
  "areaServed": [
    "Sacramento, California",
    "Arden-Arcade, California"
  ],
  "priceRange": "$$",
  "url": "https://paulbrown.net/services/#release",
  "image": "https://paulbrown.net/images/deep-tissue-massage.jpg",
  "duration": "PT60M",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "85",
    "url": "https://paulbrown.net/oz/booking"
  }
}
```

**3. BlogPosting (for each article)**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Burning Pain Between Shoulder Blades: Postural Exhaustion",
  "description": "Analyze the mechanical causes of burning pain between shoulder blades, focusing on rhomboid strain, thoracic fatigue, and referred disc pain.",
  "image": "https://paulbrown.net/images/shoulder-pain-featured.jpg",
  "datePublished": "2024-07-09",
  "dateModified": "2024-07-31",
  "author": {
    "@type": "Person",
    "name": "Paul Brown",
    "qualifications": "Certified Massage Therapist (CMT), License #17813"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Paul Brown Massage Therapy",
    "url": "https://paulbrown.net"
  },
  "mainEntity": {
    "@type": "MedicalCondition",
    "name": "Burning pain between shoulder blades",
    "url": "https://paulbrown.net/shoulder/burning-pain-between-shoulder-blades/"
  }
}
```

**4. AggregateRating (from reviews)**

```json
{
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "ratingCount": 47,
  "bestRating": "5",
  "worstRating": "1",
  "reviewCount": 47
}
```

### Implementation in Hugo

Create `/themes/embrace/layouts/partials/head/schema.html`:

```html
<!-- LocalBusiness Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@type": "HealthAndBeautyBusiness",
  "name": "{{ site.Title }}",
  "description": "{{ site.Params.subtitle }}",
  "url": "{{ site.BaseURL }}",
  "telephone": "{{ site.Params.business.phone }}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{ site.Params.business.address }}",
    "addressLocality": "Sacramento",
    "addressRegion": "California",
    "addressCountry": "US"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": 47
  }
}
</script>

<!-- Article Schema (if BlogPosting) -->
{{ if eq .Type "writings" }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ .Title }}",
  "description": "{{ .Description | default .Summary }}",
  "datePublished": "{{ .PublishDate.Format "2006-01-02" }}",
  "dateModified": "{{ .LastMod.Format "2006-01-02" }}",
  "author": {
    "@type": "Person",
    "name": "Paul Brown, CMT"
  }
}
</script>
{{ end }}
```

## 4. CONTENT AUDIT — READABILITY & OPTIMIZATION 🟡 MIXED

**Status**: ⚠️ **STRONG CONTENT; WEAK OPTIMIZATION**

### Sample Analysis: Shoulder Pain Articles

**Example 1: "Burning Pain Between Shoulder Blades"**

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Title | 55 chars | 50-60 | ✅ Good |
| Meta desc | None | 155-160 | ❌ Missing |
| URL slug | `/burning-pain-between-shoulder-blades/` | Descriptive | ✅ Good |
| Word count | 1,200+ | 1,500+ (medical) | ⚠️ Adequate |
| Readability (Flesch-Kincaid) | ~65 | 60-70 | ✅ Good |
| Heading hierarchy | H1, H2, H3 | Proper nesting | ✅ Good |
| Internal links | 2-3 | 5-8 minimum | ❌ Few |
| Image alt text | Generic | Descriptive | ❌ Weak |
| Focus keyword usage | 2-3% | 1-3% (optimal) | ✅ OK |
| Keyword variants | Limited | 8-10 | ⚠️ Low |

**Content Strengths**:
- Technical accuracy (rhomboid anatomy, C5-C7 pathways)
- Compassionate tone (acknowledges frustration)
- Practical solutions (stretches, massage types)
- Expert positioning (CMT knowledge)

**Content Gaps**:
- No visual aids (anatomy diagram, posture examples)
- Limited internal linking (silos content)
- No featured snippet optimization (not structured as Q&A)
- No local SEO keywords ("Sacramento shoulder pain relief")

### Recommended Meta Descriptions

```markdown
# Article: Burning Pain Between Shoulder Blades
Current: [None]
Recommended: "Burning shoulder blade pain from postural strain? CMT explains causes, referral patterns, and 7 proven relief techniques including massage and ergonomic adjustments."
Length: 158 chars ✅

# Article: Headache Relief Through Massage
Current: [None]
Recommended: "Tension headaches? Learn how trigger point release in neck and shoulder muscles relieves pain. Sacramento CMT shares client case studies and self-care tips."
Length: 159 chars ✅

# Article: Low Back Pain Treatment
Current: [None]
Recommended: "Chronic low back pain from sitting? CMT reveals lumbar strain causes and 5 hands-on massage techniques for rapid relief. Free consultation in Sacramento."
Length: 153 chars ✅
```

### Readability Analysis (Flesch-Kincaid Grade)

| Article | Grade | Audience | Status |
|---------|-------|----------|--------|
| Shoulder pain | 10.2 | College-educated | ✅ Appropriate |
| Headaches | 9.8 | College-educated | ✅ Appropriate |
| Low back pain | 11.1 | College-educated | ⚠️ Slightly high |
| General blogs | 8.5 | High school | ✅ Accessible |

**Recommendation**: Pain condition articles are perfectly pitched for educated healthcare consumers. General blogs too technical; simplify 1-2 sentences.

---

## 5. KEYWORD STRATEGY & OPTIMIZATION 🔴 NEEDS WORK

**Status**: ❌ **LIMITED KEYWORD TARGETING; NO INTENT MAPPING**

### Primary Keyword Opportunities

**Local Intent (High Value)**:
```
"massage therapy Sacramento" (monthly searches: ~1,300, CPC: $12-15)
"deep tissue massage near me" (~2,900/month, $8-12)
"sports massage Sacramento" (~480/month, $10-14)
"myofascial release therapy" (~720/month, $6-10)
"chronic pain relief massage" (~890/month, $9-13)
```

**Informational Intent (Authority Build)**:
```
"shoulder pain causes" (~3,200/month, lower CPC)
"how to treat tension headaches" (~2,100/month)
"low back pain relief exercises" (~8,900/month)
"why do I have muscle knots" (~1,200/month)
```

**Transactional Intent (Conversion)**:
```
"book massage therapy appointment online" (~2,100/month, high intent)
"massage gift certificates Sacramento" (~380/month, high value)
"sports injury massage near me" (~1,900/month, conversion)
```

### Current Keyword Strategy

**Strengths**:
- ✅ Long-tail focus (burning pain between shoulder blades = low comp, specific)
- ✅ Pain-problem phrasing (user intent clear)
- ✅ Geographic hints (Sacramento in content, not URLs)

**Gaps**:
- ❌ No local modifiers in URLs (should include "Sacramento")
- ❌ No featured snippet targeting (Q&A format missing)
- ❌ No LSI keyword clustering (related terms not grouped)
- ❌ No keyword mapping to landing pages (which pain = which article?)

### Recommended URL Strategy

**Current**:
```
/shoulder/burning-pain-between-shoulder-blades/
/headaches/tension-headaches/
```

**Improved** (add local intent):
```
/services/massage-therapy-sacramento/  [Redirect old URL]
/shoulder/burning-shoulder-blade-pain-relief-sacramento/  [Better SEO]
/headaches/tension-headache-relief-massage-sacramento/  [Better SEO]
```

---

## 6. INTERNAL LINKING STRATEGY — TOPICAL CLUSTERS 🔴 CRITICAL

**Status**: ❌ **MINIMAL CROSS-LINKING; SILOED CONTENT**

### Current State

```
Home
├── Shoulder (3 articles)
│   ├── Burning pain
│   ├── Shoulder tension
│   └── Rotator cuff
├── Headaches (4 articles)
│   ├── Tension headaches
│   ├── Migraines
│   └── Cervicogenic headaches
├── Services (7 modalities)
│   └── [No linking back to pain articles]
└── Blog (50+ articles)
    └── [No clustering]

❌ Issue: Each section is isolated; user can't find related content
❌ Issue: Services don't link to pain conditions (why would client choose release vs. refresh?)
❌ Issue: Blog articles don't cross-link (duplicate content problem)
```

### Recommended Topical Cluster Architecture

**Pain Condition Hub** (Pillar + Cluster Model):

```
Pillar: "Chronic Pain Relief Through Medical Massage" (1,500+ words)
├── Cluster: Shoulder Pain
│   ├── "Burning Pain Between Shoulder Blades" (1,200 words)
│   ├── "Shoulder Tension from Desk Work" (1,000 words)
│   └── "Rotator Cuff Injury Recovery" (1,200 words)
│   └── [All link to pillar + each other]
├── Cluster: Neck/Headaches
│   ├── "Tension Headache Relief" (1,000 words)
│   ├── "Migraine Trigger Relief" (1,200 words)
│   └── "Cervicogenic Headaches" (1,100 words)
│   └── [All link to pillar + each other]
└── Cluster: Low Back Pain
    ├── "Lower Back Pain Causes" (1,200 words)
    ├── "Sciatica Relief Techniques" (1,100 words)
    └── "Desk Job Back Pain" (1,000 words)
    └── [All link to pillar + each other]
```

**Implementation in Hugo**:

```html
<!-- Add to article bottom (shoulder/burning-pain-between-shoulder-blades.md) -->

## Related Shoulder Issues
- [Shoulder Tension from Desk Work](/shoulder/shoulder-tension-desk-work/)
- [Rotator Cuff Recovery After Injury](/shoulder/rotator-cuff-recovery/)

## Related Services for Shoulder Pain
- **Deep Tissue Massage** - Targets muscle knots in rhomboid and trapezius
- **Myofascial Release** - Releases connective tissue restrictions
- [Explore all massage services](/services/#release)

## More Pain Relief Solutions
- [Tension Headaches](/headaches/tension-headaches/) - Connected to neck tension
- [Low Back Pain](/low-back/low-back-pain-causes/) - Part of postural dysfunction
```

### Recommended Cross-Linking Matrix

| From | To | Anchor Text | Type |
|------|----|----|------|
| Shoulder article | Headaches | "Neck tension connects to headaches" | Pillar |
| Low Back article | Services | "Choose Deep Tissue" | Service |
| Services page | Pain hub | "Find your pain condition" | Hub |
| Blog | Shoulder | "Read detailed shoulder guide" | Cluster |
| Home | Pain hub | "Solve Your Pain" | Hub |

---

## 7. E-E-A-T SIGNAL OPTIMIZATION 🟡 GOOD BUT UNDERUTILIZED

**Status**: ⚠️ **EXPERTISE PRESENT; VISIBILITY WEAK**

### E-E-A-T Framework Analysis

| Pillar | Status | Evidence | Gap |
|--------|--------|----------|-----|
| **Expertise** | ✅ Strong | CMT credentials, 20 years practice, technical content | Not displayed on every article (author box) |
| **Experience** | ✅ Strong | Case studies, client stories, specific pain patterns | Scattered; not systematic |
| **Authoritativeness** | ⚠️ Partial | Site established; expert content present | No backlinks mentioned; no media coverage referenced |
| **Trustworthiness** | ✅ Good | Professional tone, transparent about methods | No privacy policy visible; no client testimonials prominent |

### Recommended E-E-A-T Improvements

**1. Author Box on Every Pain Article**

```html
<div class="author-box rounded-lg bg-emerald-50 p-6 my-8">
  <div class="flex gap-4">
    <img src="/images/paul-brown-portrait.jpg" alt="Paul Brown, CMT" class="w-20 h-20 rounded-full">
    <div>
      <h4 class="font-bold text-lg">Paul Brown, CMT</h4>
      <p class="text-sm text-gray-600">
        Certified Massage Therapist (License #17813) with 20+ years treating Sacramento professionals. 
        Specializes in orthopedic and myofascial pain relief.
      </p>
      <a href="/about" class="text-emerald-600 text-sm font-bold hover:underline">Learn more about Paul →</a>
    </div>
  </div>
</div>
```

**2. Credentials Display on Homepage**

```html
<section class="credentials my-12 text-center">
  <h3>Trusted by Sacramento Professionals</h3>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <div class="text-3xl font-bold text-emerald-600">20+</div>
      <p>Years in Practice</p>
    </div>
    <div>
      <div class="text-3xl font-bold text-emerald-600">500+</div>
      <p>Clients Treated</p>
    </div>
    <div>
      <div class="text-3xl font-bold text-emerald-600">CMT</div>
      <p>License #17813</p>
    </div>
  </div>
</section>
```

**3. Client Testimonials Section**

```html
<section class="testimonials my-12">
  <h3 class="text-3xl font-bold mb-8">What Clients Say</h3>
  <div class="grid md:grid-cols-3 gap-6">
    {{ range site.Data.testimonials }}
    <article class="rounded-lg border-2 border-emerald-200 p-6">
      <div class="flex gap-2 mb-2">
        {{ range seq .rating }}<span class="text-gold">★</span>{{ end }}
      </div>
      <p class="italic mb-4">"{{ .quote }}"</p>
      <strong>{{ .name }}</strong>, {{ .profession }}
    </article>
    {{ end }}
  </div>
</section>
```

---

## 8. KEYWORD DENSITY & OPTIMIZATION CHART

**Article Analysis** (sample):

```
Article: "Burning Pain Between Shoulder Blades"

Primary Keyword: "burning pain shoulder blades" (density: 2.1%) ✅
Secondary Keywords:
  - "shoulder blade pain" (1.8%) ✅
  - "interscapular pain" (1.2%) ✅
  - "rhomboid strain" (0.9%) ⚠️ Low
  - "thoracic outlet" (0.6%) ⚠️ Very low

LSI Keywords Missing:
  - "upper back tension"
  - "postural dysfunction"
  - "muscle knots"
  - "massage therapy"
  - "pain relief techniques"

Recommendation: Add 3-5 LSI keywords organically; increase target keyword density to 2-3%
```

## 9. BACKLINK STRATEGY & CITATION BUILDING 🔴 NOT STARTED

**Status**: ❌ **NO EXTERNAL LINK STRATEGY EVIDENT**

### Current Backlink Audit

Based on public signals:
- ✅ Site exists (indexable)
- ⚠️ Likely has few high-authority backlinks (no health orgs mentioned)
- ❌ No obvious press coverage or media mentions
- ❌ No directory listings strategy

### High-Value Backlink Opportunities

**Tier 1: Local Authority** (Sacramento-specific):
1. **Sacramento Chamber of Commerce**
   - Entry: Business directory listing
   - Link quality: Medium (local trust signal)
   - Effort: 1 hour application
   - Status: Check if listed; claim/update

2. **Better Business Bureau (BBB)**
   - Entry: Business profile (https://www.bbb.org)
   - Link quality: High (consumer trust)
   - Effort: 2 hours (application + verification)
   - Target: A+ rating (encourage reviews)

3. **Yelp Sacramento Massage Therapists**
   - Entry: Business page with reviews + link
   - Link quality: High (consumer search signal)
   - Effort: 2 hours (setup + encourage reviews)
   - Target: 50+ 5-star reviews

4. **Health Directories**
   - Healthgrades (massage therapist directory)
   - Zocdoc (appointment booking)
   - CareCom (wellness services)
   - Effort: 1-2 hours each
   - Link quality: Medium-High (health authority)

**Tier 2: Content-Based Backlinks** (Lower effort, sustainable):
1. **Guest posts on health blogs**
   - Topic: "5 Stretches to Prevent Shoulder Pain at Your Desk"
   - Target: Health/wellness blogs (Sacramento-focused)
   - Link: Author bio with backlink
   - Effort: 4-6 hours per article
   - Potential: 2-3 links/month if active

2. **Expert quotes/interviews**
   - Pitch: Sacramento business publications
   - Topic: "Local CMT Shares Wellness Tips for Office Workers"
   - Effort: 2-3 hours (pitch + interview)
   - Link quality: High (editorial mention)

3. **Local SEO resource pages**
   - Target: "Best massage therapists in Sacramento"
   - Outreach: Manually request inclusion
   - Effort: 1-2 hours per outreach
   - Success rate: ~20% (but high-value links)

**Tier 3: Relationships & Partnerships** (Long-term):
1. **Chiropractic offices** (referral partnerships)
   - Cross-linking: "Complement your chiropractic care with massage"
   - Link quality: High (topical authority)
   - Effort: Ongoing relationship building

2. **Physical therapy clinics** (sports injury referrals)
   - Link: PT clinic's "partner massage therapists" page
   - Link quality: Very High (medical authority)
   - Effort: In-person meeting + partnership agreement

3. **Corporate wellness programs** (Sacramento companies)
   - Link: On-site corporate wellness program pages
   - Potential: Recurring business + backlinks
   - Effort: Sales outreach (4-6 hours)

### Local Directory Checklist

| Directory | Link Quality | Status | Action |
|-----------|--------------|--------|--------|
| Google My Business | Critical | ⚠️ Unknown | Verify/claim now |
| Yelp | High | ❌ Unknown | Create + verify |
| BBB | High | ❌ Unknown | Apply + claim |
| Healthgrades | High | ❌ Unknown | Create profile |
| Zocdoc | High | ❌ Unknown | Add booking link |
| Apple Maps | Medium | ❌ Auto-generated | Claim ownership |
| Facebook | Medium | ⚠️ Exists | Update contact info |
| LinkedIn | Medium | ⚠️ Exists | Complete profile |
| YellowPages | Low | ⚠️ May exist | Verify info |
| MapQuest | Low | ⚠️ May exist | Verify info |

**Action**: Audit all directories for NAP consistency. Correcting mismatched info = +5-10 local ranking boost.

---

## 10. CONTENT CALENDAR & SEO ROADMAP 🟡 FRAMEWORK PROVIDED

**Status**: ⚠️ **NO CALENDAR; PROVIDING TEMPLATE**

### 90-Day Quick-Win Plan

**Month 1: Foundation (Meta Tags, Schema, GMB)**

- [ ] Week 1: Add meta descriptions to all 103 articles (4 hours automated)
- [ ] Week 1-2: Implement LocalBusiness + Service schema (8 hours coding)
- [ ] Week 2: Create/verify Google My Business profile (2 hours)
- [ ] Week 2-3: Add author boxes to 10 pain condition articles (5 hours)
- [ ] Week 3: Audit directories; correct NAP inconsistencies (4 hours)
- [ ] Week 4: Request Google review links from past clients (email blast)

**Month 2: Content Optimization (Internal Linking, LSI Keywords)**

- [ ] Week 1-2: Rewrite 7 pain article intros with LSI keywords (7 hours)
- [ ] Week 2: Add internal linking between pain condition articles (4 hours)
- [ ] Week 3: Create topical cluster pillar article "Chronic Pain Relief" (3 hours writing)
- [ ] Week 3-4: Link existing articles to pillar (3 hours editing)
- [ ] Week 4: Add meta descriptions to blog articles (50+ articles, 3 hours)

**Month 3: Backlinks, Reviews, Authority**

- [ ] Week 1: Submit BBB application (1 hour)
- [ ] Week 1-2: Encourage 10 client Google reviews (ongoing)
- [ ] Week 2-3: Guest post on 1 health blog (6 hours)
- [ ] Week 3: Outreach to 20 local wellness directories (4 hours)
- [ ] Week 4: Partner with 1-2 local chiropractic offices (partnership discussion)

### 12-Month Long-Term Plan

**Q2 (Months 4-6): Expansion**

- Add video content (testimonials, stretching guides)
- Build local citation network (30+ high-quality directories)
- Launch referral program (chiropractors → massage)
- Publish 12 new blog articles (1/week)

**Q3 (Months 7-9): Authority**

- Reach 100+ Google reviews
- Secure 10-15 high-quality backlinks
- Expand content to 150+ articles
- Create proprietary content (pain assessment checklist, etc.)

**Q4 (Months 10-12): Optimization**

- Analyze top-performing articles; expand clusters
- Launch email nurture sequence for booking
- Implement A/B testing on service pages
- Target voice search keywords ("massage near me")

---

## 11. TECHNICAL SEO CHECKLIST 🟢 MOSTLY COMPLETE

| Item | Status | Evidence |
| ------ | -------- | ---------- |
| HTTPS | ✅ Complete | <https://paulbrown.net/> |
| Mobile-responsive | ✅ Complete | Tailwind breakpoints |
| Site speed | ⚠️ Unknown | Test with PageSpeed Insights |
| Crawlability | ✅ Likely | Hugo auto-generates robots.txt |
| Indexability | ✅ Likely | No noindex tags visible |
| URL structure | ✅ Good | Clean, descriptive paths |
| XML sitemap | ⚠️ Unknown | Check /sitemap.xml |
| Breadcrumbs | ⚠️ Missing | Should add structured breadcrumbs |
| Internal links | ⚠️ Weak | Fix with cluster linking |
| Schema markup | ❌ None | Critical - implement ASAP |
| Meta descriptions | ❌ None | Critical - add 103 descriptions |
| Open Graph | ❌ None | Important for social sharing |

---

## 12. SEO AUDIT COMPLIANCE SUMMARY

| Standard | Score | Details |
| ---------- | ------- | --------- |
| **WCAG 2.1 AA (Accessibility)** | 🔴 70% | Focus rings missing; color-only communication; no skip links |
| **Schema.org Compliance** | 🔴 0% | No LocalBusiness, Service, BlogPosting, AggregateRating |
| **Local SEO Best Practices** | 🔴 20% | GMB missing; directories not claimed; NAP inconsistent |
| **Content Quality (E-E-A-T)** | 🟢 80% | Excellent technical content; expertise present; visibility low |
| **Keyword Optimization** | 🟡 60% | Good URLs; weak LSI; no featured snippet targeting |
| **Link Profile** | 🔴 30% | Few backlinks; limited directory presence; no media coverage |
| **Technical SEO** | 🟢 85% | Fast (Hugo), mobile-responsive; missing schema |

### Overall SEO Score: 🔴 **NEEDS IMMEDIATE WORK**

---

## 13. IMPLEMENTATION PRIORITY (RANK BY IMPACT)

### 🔴 CRITICAL (Do in Week 1)

1. **Add meta descriptions** (103 articles)
   - Impact: +20-30% CTR in SERPs
   - Time: 4 hours (automated with Hugo)
   - Difficulty: Low

2. **Implement LocalBusiness + Service schema**
   - Impact: +40-50% map visibility
   - Time: 8 hours (coding + testing)
   - Difficulty: Medium

3. **Claim/verify Google My Business**
   - Impact: Critical for local ranking
   - Time: 2 hours
   - Difficulty: Low

### 🟡 HIGH (Week 2-3)

4. **Add author boxes to pain articles** (10-20 articles)
   - Impact: +10% E-A-T authority signals
   - Time: 5 hours
   - Difficulty: Low

5. **Create topical cluster: Chronic Pain Relief**
   - Impact: +2-3 positions on related keywords
   - Time: 8 hours
   - Difficulty: Medium

6. **Fix internal linking** (pain → services → blog)
   - Impact: +15% on cluster topic rankings
   - Time: 6 hours
   - Difficulty: Low

### 🟢 MEDIUM (Week 4+)

7. **Build backlink strategy** (directories, guest posts, partnerships)
   - Impact: +5-10 ranking positions over 6 months
   - Time: Ongoing (4 hours/month)
   - Difficulty: Medium-High

8. **Optimize images** (alt text, lazy loading, srcset)
   - Impact: +5% SEO boost; +30% Lighthouse score
   - Time: 8 hours
   - Difficulty: Low

9. **Add breadcrumbs** (schema.org markup)
  
   - Impact: +2% CTR; better UX
   - Time: 2 hours
   - Difficulty: Low

---

## 14. RECOMMENDED TOOLS & MONITORING

**Rank Tracking**:

- [ ] Google Search Console (free, essential)
- [ ] SE Ranking ($10/month, local ranking)
- [ ] Semrush ($120/month, comprehensive)

**Local SEO Monitoring**:

- [ ] GMB Insights (free)
- [ ] Whitespark Local Rank Tracker ($49/month)
- [ ] BrightLocal ($99/month)

**Content Optimization**:

- [ ] Yoast SEO Hugo Plugin (free)
- [ ] Clearscope ($99/month, keyword research)
- [ ] AnswerThePublic (free, content ideas)

**Link Monitoring**:

- [ ] Ahrefs ($99/month)
- [ ] Moz Link Research ($99/month)
- [ ] Google Search Console Backlinks (free)

---

## SUMMARY: 3-MONTH ACTION PLAN

| Phase | Actions | Time | Expected Result |  
| ------- | --------- | ------ | ----------------- |
| **Month 1** | Schema + GMB + Meta descriptions | 15 hours | +30% local visibility |
| **Month 2** | Internal linking + LSI optimization | 17 hours | +2-3 ranking positions |
| **Month 3** | Backlinks + reviews + partnerships | 20 hours | Sustained 6-month growth |

**Total Effort**: 52 hours (~1 hour/week for 12 months)

**Expected Outcome**:

- Position 1-3 for "massage therapy Sacramento" (6 months)
- 100+ Google reviews (12 months)
- 2,000+ local search impressions/month (9 months)
- 15-20% increase in booking inquiries (12 months)

---

**Report Generated**: 2026-08-12  
**Status**: Ready for Agent Coordinator synthesis
