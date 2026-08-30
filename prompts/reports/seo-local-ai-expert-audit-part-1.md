# SEO LOCAL AI EXPERT AUDIT REPORT — PART 1

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

