# Comprehensive SEO Content Value Audit & Strategic Grading Report
**Target Brand:** The Firelight Studio by Paul Brown Massage Therapy (Sacramento, CA)
**Audit Date:** August 30, 2026
**Auditor Role:** Senior SEO Strategist & Clinical Content Architect
**Total Assets Audited:** 152 Markdown Documents (`content/`: 100, `out-of-date-content/`: 52)

---

## 1. Executive Summary & Site Value Scorecard

This report provides a forensic SEO audit and site-value grading for every piece of published and archived content across *The Firelight Studio*. The objective is to maximize organic visibility, protect crawl budget, eliminate thin content liabilities, reinforce Sacramento local search authority, and drive high-intent client conversions for therapeutic bodywork and pain relief.

### High-Level Content Portfolio Breakdown

| Tier / Grade | Asset Count | % of Total | Strategic Role | Recommended Disposition |
| :--- | :---: | :---: | :--- | :--- |
| **Tier 1: Core Revenue & Pillar Assets (A / A-)** | **31** | 20.4% | High-depth (600–1,500+ words) anatomical guides & core service pages | **Protect, Schema-optimize & Interlink** |
| **Tier 2: Strong Supporting Content (B+ / B / B-)** | **25** | 16.4% | Solid educational, self-care & E-E-A-T trust pages (250–600 words) | **Enhance with FAQs, Local Signals & CTAs** |
| **Tier 3: Moderate / Thin Hub Guides (C+ / C)** | **19** | 12.5% | Section overviews & mid-length blog posts (100–250 words) | **Upgrade to Comprehensive Pillars or Consolidate** |
| **Tier 4: Low Value / Outdated Promos (D / D-Archived)** | **18** | 11.8% | Expired seasonal announcements & stub pages (<100 words) | **Prune, Redirect or Leave in Archive** |
| **Tier 5: Toxic Thin / Micro-Posts (F / F-Archived)** | **59** | 38.8% | Legacy micro-posts, empty stubs, broken embeds (<90 words) | **Delete, 301 Redirect or De-index** |
| **Total Content Inventory** | **152** | **100%** | **Full Site Footprint** | **See Silo Action Plans Below** |

---

## 2. Top Critical SEO & Technical Findings

### 🚨 Finding 1: Core Landing Pages Marked as `draft: true`
Several foundational pages in the active `content/` directory contain `draft: true` in their frontmatter. In standard Hugo production builds, these pages **will not compile or render**, rendering critical conversion routes invisible to Google and site visitors:
- `content/_index.md` (Homepage)
- `content/about/_index.md` (Meet Paul Brown, CMT)
- `content/location/_index.md` (Sacramento Clinic Location)
- `content/contact/_index.md` (Contact Page)
- `content/announcements/_index.md` (Announcements Index)
- `content/announcements/booking.md` (Booking Announcement)

> **Immediate Fix:** Change `draft: true` to `draft: false` on these essential routes.

### ⚠️ Finding 2: Crawl Dilution from Legacy Micro-Posts (Writings & Archive)
- **38 files in `content/writings/`**: 18 of these are legacy social media blurbs under 90 words from 2016–2017 (e.g. `happy-rules-to-live-by` [5 words], `theracanes-are-great` [0 words], `flu-shot` [49 words]).
- These create thin content signals under Google's Helpful Content System and dilute link equity.
- **Recommendation:** Remove/redirect the 18 micro-posts to their corresponding topic hubs (`/services/pain-relief/`, `/about/`, or `/writings/myofascial-release/`).

### 🌟 Finding 3: The "Gold Standard" Pillar Silos: `shoulder` & `headaches`
- The `shoulder/` (16 pages) and `headaches/` (10 pages) directories represent world-class clinical SEO.
- Articles like `unloading-the-upper-arch.md` (1,182 words) and `shoulder-pain-rotator-cuff-injury.md` (760 words) feature precise medical terminology, anatomical SVG illustrations, clear client symptoms, and strong booking calls to action.
- **Action:** Use these two folders as the exact architectural template to elevate `low-back-pain`, `mid-back-pain`, `hip-pain`, and `fibromyalgia`.

### 💎 Finding 4: High-Potential Content in the Archive (`out-of-date-content/`)
While most archived items are obsolete seasonal promos, two long-form evergreen articles should be refreshed and migrated to active content:
1. `out-of-date-content/archive/massage-near-me/index.md` (591 words): Excellent localized search intent asset for "Massage Near Me Sacramento".
2. `out-of-date-content/archive/massage-holiday-gift-ideas/index.md` (570 words): Evergreen holiday/gift voucher guide for seasonal revenue.

---

## 3. Topical Silo Breakdown & Value Analysis

### 📂 Silo: About & E-E-A-T Trust (7 Items | Avg: 329 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **advanced-table** | [`advanced-table.md`](file:///d:/dev/ascent/content/about/advanced-table.md) | 370 | ⭐⭐⭐ **B- (Tier 2)** | E-E-A-T asset (370 words) supporting brand credibility. | KEEP & OPTIMIZE - Ensure all bio/philosophy pages are interconnected with strong conversion paths. |
| **appointment-policies** | [`appointment-policies.md`](file:///d:/dev/ascent/content/about/appointment-policies.md) | 257 | ⭐⭐⭐ **B- (Tier 2)** | E-E-A-T asset (257 words) supporting brand credibility. | KEEP & OPTIMIZE - Ensure all bio/philosophy pages are interconnected with strong conversion paths. |
| **free-massage** | [`free-massage.md`](file:///d:/dev/ascent/content/about/free-massage.md) | 113 | ⭐⭐⭐ **B- (Tier 2)** | E-E-A-T asset (113 words) supporting brand credibility. | KEEP & OPTIMIZE - Ensure all bio/philosophy pages are interconnected with strong conversion paths. |
| **about** | [`_index.md`](file:///d:/dev/ascent/content/about/_index.md) | 106 | ⭐⭐⭐ **B- (Tier 2)** | E-E-A-T asset (106 words) supporting brand credibility. | KEEP & OPTIMIZE - Ensure all bio/philosophy pages are interconnected with strong conversion paths. |
| **tos** | [`tos.md`](file:///d:/dev/ascent/content/about/tos.md) | 520 | ⭐⭐⭐⭐ **A- (Tier 1)** | Crucial E-E-A-T trust asset (520 words) establishing practitioner expertise, experience, and ethos. | KEEP & ENHANCE - Add credentials, licenses, certifications, clinic photos, and schema markup (Person / HealthAndBeautyBusiness). |
| **massage-prep** | [`massage-prep.md`](file:///d:/dev/ascent/content/about/massage-prep.md) | 485 | ⭐⭐⭐⭐ **A- (Tier 1)** | Crucial E-E-A-T trust asset (485 words) establishing practitioner expertise, experience, and ethos. | KEEP & ENHANCE - Add credentials, licenses, certifications, clinic photos, and schema markup (Person / HealthAndBeautyBusiness). |
| **sms** | [`sms.md`](file:///d:/dev/ascent/content/about/sms.md) | 452 | ⭐⭐⭐⭐ **A- (Tier 1)** | Crucial E-E-A-T trust asset (452 words) establishing practitioner expertise, experience, and ethos. | KEEP & ENHANCE - Add credentials, licenses, certifications, clinic photos, and schema markup (Person / HealthAndBeautyBusiness). |

### 📂 Silo: Announcements (3 Items | Avg: 24 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **i'm-moving** | [`i'm-moving.md`](file:///d:/dev/ascent/content/announcements/i'm-moving.md) | 34 | ⭐⭐ **C (Tier 3)** | General page (34 words). | REVIEW - Ensure proper meta tags and clear CTA. |
| **booking** | [`booking.md`](file:///d:/dev/ascent/content/announcements/booking.md) | 31 | ⭐⭐ **C (Tier 3)** | General page (31 words). | REVIEW - Ensure proper meta tags and clear CTA. |
| **announcements** | [`_index.md`](file:///d:/dev/ascent/content/announcements/_index.md) | 7 | ⭐⭐ **C (Tier 3)** | General page (7 words). | REVIEW - Ensure proper meta tags and clear CTA. |

### 📂 Silo: Anxiety & Depression Hub (2 Items | Avg: 437 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **anxiety-and-depression** | [`_index.md`](file:///d:/dev/ascent/content/anxiety-and-depression/_index.md) | 0 | ⚠️ **D (Tier 4)** | Empty section index placeholder. Missing meta description and introductory copy. | OPTIMIZE - add authoritative hub intro, meta description, and schema markup. |
| **my-depression-and-anxiety-strategy** | [`index.md`](file:///d:/dev/ascent/content/anxiety-and-depression/my-depression-and-anxiety-strategy/index.md) | 874 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Good anatomical targeting (874 words) addressing core client pain point. | KEEP & UPGRADE - Expand to 800+ words with Sacramento local targeting and link to related condition articles. |

### 📂 Silo: Archive: Announcements (3 Items | Avg: 52 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **big-sale** | [`big-sale.md`](file:///d:/dev/ascent/out-of-date-content/announcements-archive/big-sale.md) | 83 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (83 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **holiday-hours** | [`holiday-hours.md`](file:///d:/dev/ascent/out-of-date-content/announcements-archive/holiday-hours.md) | 39 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (39 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **valentines-day** | [`valentines-day.md`](file:///d:/dev/ascent/out-of-date-content/announcements-archive/valentines-day.md) | 33 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (33 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |

### 📂 Silo: Archive: Legacy Posts (49 Items | Avg: 89 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **self-care-is-health-care** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/self-care-is-health-care/index.md) | 68 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (68 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **i-was-doing-some-data-analysis-this-morning-of** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/i-was-doing-some-data-analysis-this-morning-of/index.md) | 68 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (68 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **last-minute-egift-cards** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/last-minute-egift-cards/index.md) | 65 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (65 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **what-to-blame-for-your-stomach-bug-not-always-the** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/what-to-blame-for-your-stomach-bug-not-always-the/index.md) | 65 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (65 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **arriving-with-the-autumnal-chill-in-the-air-flu** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/arriving-with-the-autumnal-chill-in-the-air-flu/index.md) | 58 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (58 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **remembering-the-fallen** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/remembering-the-fallen/index.md) | 58 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (58 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **myofascial-therapy-price-increase** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/myofascial-therapy-price-increase/index.md) | 58 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (58 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **tawdrytalk-gnome-or-excuses-book-your-massage** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/tawdrytalk-gnome-or-excuses-book-your-massage/index.md) | 57 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (57 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **after-work-today-i-did-some-emotional-self-care** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/after-work-today-i-did-some-emotional-self-care/index.md) | 57 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (57 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **who-doesnt-like-free-stuff** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/who-doesnt-like-free-stuff/index.md) | 47 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (47 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **wishing-john-spires-luck-for-his-cim-attempt-this** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/wishing-john-spires-luck-for-his-cim-attempt-this/index.md) | 43 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (43 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **january-special** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/january-special/index.md) | 42 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (42 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **does-the-smoky-air-got-you-down-here-are-some** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/does-the-smoky-air-got-you-down-here-are-some/index.md) | 39 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (39 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **paul-browns-sacramento-massage-therapy-pain** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/paul-browns-sacramento-massage-therapy-pain/index.md) | 32 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (32 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **ill-be-seeing-clients-this-monday-january-9th** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/ill-be-seeing-clients-this-monday-january-9th/index.md) | 31 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (31 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **im-pleased-to-announce-my-sponsorship-of** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/im-pleased-to-announce-my-sponsorship-of/index.md) | 30 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (30 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **i-love-when-this-sort-of-thing-happens-did-you** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/i-love-when-this-sort-of-thing-happens-did-you/index.md) | 24 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (24 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **via-httpswwwyoutubecomwatchv-syxdsv9sbvq** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/via-httpswwwyoutubecomwatchv-syxdsv9sbvq/index.md) | 24 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (24 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **this-kind-of-pressure-reduces-the-other-kind-of** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/this-kind-of-pressure-reduces-the-other-kind-of/index.md) | 22 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (22 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **black-friday-sale** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/black-friday-sale/index.md) | 21 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (21 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **im-donating-three-free-months-membership-in-my** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/im-donating-three-free-months-membership-in-my/index.md) | 21 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (21 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **click-here-for-a-special-deal-from-paul-brown** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/click-here-for-a-special-deal-from-paul-brown/index.md) | 19 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (19 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **httpsgpagepaulbrownmassagetherapy** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/httpsgpagepaulbrownmassagetherapy/index.md) | 18 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (18 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **youre-fine-just-the-way-you-are** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/youre-fine-just-the-way-you-are/index.md) | 16 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (16 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **be-present-and-breathe** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/be-present-and-breathe/index.md) | 13 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (13 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **new-infill-development-in-oak-park** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/new-infill-development-in-oak-park/index.md) | 12 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (12 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **i-have-a-last-minute-opening-today-call** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/i-have-a-last-minute-opening-today-call/index.md) | 11 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (11 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **this-weeks-sign** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/this-weeks-sign/index.md) | 9 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (9 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **now-accepting-venmo** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/now-accepting-venmo/index.md) | 7 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (7 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **one-90m-massage-down-one-to-go** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/one-90m-massage-down-one-to-go/index.md) | 7 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (7 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **its-warm-outside-stay-hydrated** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/its-warm-outside-stay-hydrated/index.md) | 6 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (6 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **late-morning-in-winters-ca-2** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/late-morning-in-winters-ca-2/index.md) | 5 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (5 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **late-morning-in-winters-ca** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/late-morning-in-winters-ca/index.md) | 5 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (5 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **all-done** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/all-done/index.md) | 3 | ❌ **F (Archive)** | Obsolete micro-blurb/social post (3 words) with zero SEO value. | KEEP ARCHIVED / DO NOT PUBLISH - Maintain in archive or permanently delete. |
| **ready-for-today** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/ready-for-today/index.md) | 0 | ❌ **F (Tier 5 / Thin)** | Empty file with 0 words. | DELETE or DRAFT until substantial content is created. |
| **take-some-time-for-you** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/take-some-time-for-you/index.md) | 0 | ❌ **F (Tier 5 / Thin)** | Empty file with 0 words. | DELETE or DRAFT until substantial content is created. |
| **my-new-office-is-ready-for-you** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/my-new-office-is-ready-for-you/index.md) | 306 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (306 words). | KEEP ARCHIVED - Historical reference only. |
| **special-covid-19-precautions** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/special-covid-19-precautions/index.md) | 256 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (256 words). | KEEP ARCHIVED - Historical reference only. |
| **saying-yes** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/saying-yes/index.md) | 246 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (246 words). | KEEP ARCHIVED - Historical reference only. |
| **dads-and-grads-sale-2022** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/dads-and-grads-sale-2022/index.md) | 240 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (240 words). | KEEP ARCHIVED - Historical reference only. |
| **autumn-is-for-for-massage** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/autumn-is-for-for-massage/index.md) | 202 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (202 words). | KEEP ARCHIVED - Historical reference only. |
| **massage-muse** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/massage-muse/index.md) | 184 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (184 words). | KEEP ARCHIVED - Historical reference only. |
| **practice-temporarily-closed** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/practice-temporarily-closed/index.md) | 182 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (182 words). | KEEP ARCHIVED - Historical reference only. |
| **save-big-on-massage-gift-vouchers-im-very** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/save-big-on-massage-gift-vouchers-im-very/index.md) | 159 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (159 words). | KEEP ARCHIVED - Historical reference only. |
| **new-location** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/new-location/index.md) | 130 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (130 words). | KEEP ARCHIVED - Historical reference only. |
| **bariatric-chronicles-on-dealing-cravings** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/bariatric-chronicles-on-dealing-cravings/index.md) | 119 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (119 words). | KEEP ARCHIVED - Historical reference only. |
| **the-well-run-group-is-not-a-battlefield-of-egos** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/the-well-run-group-is-not-a-battlefield-of-egos/index.md) | 106 | ⚠️ **D (Archive)** | Outdated promotion, announcement, or legacy update (106 words). | KEEP ARCHIVED - Historical reference only. |
| **massage-near-me** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/massage-near-me/index.md) | 591 | ⭐⭐ **C+ (Tier 3)** | Archived piece (591 words) with salvageable evergreen keyword targeting. | RESTORE & MODERNIZE - Update dates/offers, rewrite thin sections, and republish under content/writings or services. |
| **massage-holiday-gift-ideas** | [`index.md`](file:///d:/dev/ascent/out-of-date-content/archive/massage-holiday-gift-ideas/index.md) | 570 | ⭐⭐ **C+ (Tier 3)** | Archived piece (570 words) with salvageable evergreen keyword targeting. | RESTORE & MODERNIZE - Update dates/offers, rewrite thin sections, and republish under content/writings or services. |

### 📂 Silo: Core Services (8 Items | Avg: 209 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **coaching** | [`coaching.md`](file:///d:/dev/ascent/content/services/coaching.md) | 0 | ❌ **F (Tier 5 / Thin)** | Empty file with 0 words. | DELETE or DRAFT until substantial content is created. |
| **services** | [`_index.md`](file:///d:/dev/ascent/content/services/_index.md) | 12 | ⚠️ **D (Tier 4)** | Thin stub service page (12 words). | REWRITE / EXPAND or merge into main services overview. |
| **discount-membership** | [`discount-membership.md`](file:///d:/dev/ascent/content/services/discount-membership.md) | 261 | ⭐⭐⭐ **B (Tier 2)** | Important service page (261 words) but lacks comprehensive service description and FAQs. | EXPAND - Upgrade copy to 500+ words with benefits, contraindications, booking links, and FAQs. |
| **relaxation** | [`relaxation.md`](file:///d:/dev/ascent/content/services/relaxation.md) | 223 | ⭐⭐⭐ **B (Tier 2)** | Important service page (223 words) but lacks comprehensive service description and FAQs. | EXPAND - Upgrade copy to 500+ words with benefits, contraindications, booking links, and FAQs. |
| **couples-massage-workshop** | [`couples-massage-workshop.md`](file:///d:/dev/ascent/content/services/couples-massage-workshop.md) | 143 | ⭐⭐⭐ **B (Tier 2)** | Important service page (143 words) but lacks comprehensive service description and FAQs. | EXPAND - Upgrade copy to 500+ words with benefits, contraindications, booking links, and FAQs. |
| **sports** | [`sports.md`](file:///d:/dev/ascent/content/services/sports.md) | 106 | ⭐⭐⭐ **B (Tier 2)** | Important service page (106 words) but lacks comprehensive service description and FAQs. | EXPAND - Upgrade copy to 500+ words with benefits, contraindications, booking links, and FAQs. |
| **pain-relief** | [`pain-relief.md`](file:///d:/dev/ascent/content/services/pain-relief.md) | 552 | ⭐⭐⭐⭐ **A- (Tier 1)** | Core commercial conversion page (552 words) describing high-value service offerings. | KEEP & OPTIMIZE - Inject local Sacramento keywords, structured booking CTA, pricing/session details, and testimonials. |
| **prenatal** | [`prenatal.md`](file:///d:/dev/ascent/content/services/prenatal.md) | 372 | ⭐⭐⭐⭐ **A- (Tier 1)** | Core commercial conversion page (372 words) describing high-value service offerings. | KEEP & OPTIMIZE - Inject local Sacramento keywords, structured booking CTA, pricing/session details, and testimonials. |

### 📂 Silo: Fibromyalgia Hub (2 Items | Avg: 96 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **fibromyalgia** | [`_index.md`](file:///d:/dev/ascent/content/fibromyalgia/_index.md) | 0 | ⚠️ **D (Tier 4)** | Empty section index placeholder. Missing meta description and introductory copy. | OPTIMIZE - add authoritative hub intro, meta description, and schema markup. |
| **massage-and-fibromyalgia** | [`index.md`](file:///d:/dev/ascent/content/fibromyalgia/massage-and-fibromyalgia/index.md) | 193 | ⭐⭐ **C+ (Tier 3)** | Moderate value (193 words), but needs depth to rank competitively against medical sites. | EXPAND - Add clinical context, trigger points, home stretches, and booking link. |

### 📂 Silo: General (1 Items | Avg: 0 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **test** | [`test.md`](file:///d:/dev/ascent/content/test.md) | 0 | ❌ **F (Tier 5 / Thin)** | Orphaned dummy test file with 4 words. | DELETE - remove immediately to prevent index bloat. |

### 📂 Silo: Headaches Condition Hub (10 Items | Avg: 938 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **headaches** | [`_index.md`](file:///d:/dev/ascent/content/headaches/_index.md) | 29 | ⭐⭐ **C+ (Tier 3)** | Section index or brief overview (29 words). | EXPAND - Turn into comprehensive condition pillar guide. |
| **unraveling-the-knot** | [`unraveling-the-knot.md`](file:///d:/dev/ascent/content/headaches/unraveling-the-knot.md) | 1406 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (1406 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **mapping-the-relief** | [`mapping-the-relief.md`](file:///d:/dev/ascent/content/headaches/mapping-the-relief.md) | 1183 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (1183 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **unloading-the-upper-arch** | [`unloading-the-upper-arch.md`](file:///d:/dev/ascent/content/headaches/unloading-the-upper-arch.md) | 1182 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (1182 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **beyond the neurological event** | [`beyond the neurological event.md`](file:///d:/dev/ascent/content/headaches/beyond the neurological event.md) | 1060 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (1060 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **mapping-the-coordinates** | [`mapping-the-coordinates.md`](file:///d:/dev/ascent/content/headaches/mapping-the-coordinates.md) | 940 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (940 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **breaking-the-emergency** | [`breaking-the-emergency.md`](file:///d:/dev/ascent/content/headaches/breaking-the-emergency.md) | 902 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (902 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **behind-the-sockets** | [`behind-the-sockets.md`](file:///d:/dev/ascent/content/headaches/behind-the-sockets.md) | 897 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (897 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **unlocking-the-base** | [`unlocking-the-base.md`](file:///d:/dev/ascent/content/headaches/unlocking-the-base.md) | 893 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (893 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **unmasking-the-storm** | [`unmasking-the-storm.md`](file:///d:/dev/ascent/content/headaches/unmasking-the-storm.md) | 886 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (886 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |

### 📂 Silo: Hip Pain Hub (2 Items | Avg: 214 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **hip-pain** | [`_index.md`](file:///d:/dev/ascent/content/hip-pain/_index.md) | 0 | ⚠️ **D (Tier 4)** | Empty section index placeholder. Missing meta description and introductory copy. | OPTIMIZE - add authoritative hub intro, meta description, and schema markup. |
| **the-overlooked-hipsters-the-adductors** | [`index.md`](file:///d:/dev/ascent/content/hip-pain/the-overlooked-hipsters-the-adductors/index.md) | 428 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Good anatomical targeting (428 words) addressing core client pain point. | KEEP & UPGRADE - Expand to 800+ words with Sacramento local targeting and link to related condition articles. |

### 📂 Silo: Homepage Core (1 Items | Avg: 9 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **content** | [`_index.md`](file:///d:/dev/ascent/content/_index.md) | 9 | ⭐⭐ **C (Tier 3)** | General page (9 words). | REVIEW - Ensure proper meta tags and clear CTA. |

### 📂 Silo: Location & Contact (Local SEO) (2 Items | Avg: 16 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **contact** | [`_index.md`](file:///d:/dev/ascent/content/contact/_index.md) | 16 | ⭐⭐ **C (Tier 3)** | General page (16 words). | REVIEW - Ensure proper meta tags and clear CTA. |
| **location** | [`_index.md`](file:///d:/dev/ascent/content/location/_index.md) | 16 | ⭐⭐ **C (Tier 3)** | General page (16 words). | REVIEW - Ensure proper meta tags and clear CTA. |

### 📂 Silo: Low Back Pain Hub (5 Items | Avg: 204 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **you-can-help-reduce-the-low-back-strain-you-feel** | [`index.md`](file:///d:/dev/ascent/content/low-back-pain/you-can-help-reduce-the-low-back-strain-you-feel/index.md) | 45 | ⚠️ **D (Tier 4)** | Thin content (45 words) or empty section index. | CONSOLIDATE or BUILD OUT into full clinical pillar guide. |
| **low-back-pain** | [`_index.md`](file:///d:/dev/ascent/content/low-back-pain/_index.md) | 0 | ⚠️ **D (Tier 4)** | Empty section index placeholder. Missing meta description and introductory copy. | OPTIMIZE - add authoritative hub intro, meta description, and schema markup. |
| **neck-and-low-back-pain-try-massage-study** | [`index.md`](file:///d:/dev/ascent/content/low-back-pain/neck-and-low-back-pain-try-massage-study/index.md) | 149 | ⭐⭐ **C+ (Tier 3)** | Moderate value (149 words), but needs depth to rank competitively against medical sites. | EXPAND - Add clinical context, trigger points, home stretches, and booking link. |
| **lower-back-pain-check-the-gluteus-medius** | [`index.md`](file:///d:/dev/ascent/content/low-back-pain/lower-back-pain-check-the-gluteus-medius/index.md) | 428 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Good anatomical targeting (428 words) addressing core client pain point. | KEEP & UPGRADE - Expand to 800+ words with Sacramento local targeting and link to related condition articles. |
| **no-more-low-back-pain** | [`no-more-low-back-pain.md`](file:///d:/dev/ascent/content/low-back-pain/no-more-low-back-pain.md) | 396 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Good anatomical targeting (396 words) addressing core client pain point. | KEEP & UPGRADE - Expand to 800+ words with Sacramento local targeting and link to related condition articles. |

### 📂 Silo: Mid Back Pain Hub (2 Items | Avg: 195 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **mid-back-pain** | [`_index.md`](file:///d:/dev/ascent/content/mid-back-pain/_index.md) | 0 | ⚠️ **D (Tier 4)** | Empty section index placeholder. Missing meta description and introductory copy. | OPTIMIZE - add authoritative hub intro, meta description, and schema markup. |
| **mid-back-pain-check-the-lats** | [`index.md`](file:///d:/dev/ascent/content/mid-back-pain/mid-back-pain-check-the-lats/index.md) | 390 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Good anatomical targeting (390 words) addressing core client pain point. | KEEP & UPGRADE - Expand to 800+ words with Sacramento local targeting and link to related condition articles. |

### 📂 Silo: Oz Theme Showcase (1 Items | Avg: 8 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **oz** | [`_index.md`](file:///d:/dev/ascent/content/oz/_index.md) | 8 | ⭐⭐ **C (Tier 3)** | General page (8 words). | REVIEW - Ensure proper meta tags and clear CTA. |

### 📂 Silo: Shoulder & Neck Condition Hub (16 Items | Avg: 603 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **shoulder** | [`_index.md`](file:///d:/dev/ascent/content/shoulder/_index.md) | 25 | ⭐⭐ **C+ (Tier 3)** | Section index or brief overview (25 words). | EXPAND - Turn into comprehensive condition pillar guide. |
| **shoulder-pain-supraspinatus** | [`shoulder-pain-supraspinatus.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-supraspinatus.md) | 535 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Solid anatomical/clinical focus (535 words) with clear search intent. | KEEP & ENHANCE - Expand with FAQ, anatomical diagram references, and self-care stretches to hit 800+ words. |
| **shoulder-pain-infraspinatus** | [`shoulder-pain-infraspinatus.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-infraspinatus.md) | 414 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Solid anatomical/clinical focus (414 words) with clear search intent. | KEEP & ENHANCE - Expand with FAQ, anatomical diagram references, and self-care stretches to hit 800+ words. |
| **shoulder-pain-subscapularis** | [`shoulder-pain-subscapularis.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-subscapularis.md) | 384 | ⭐⭐⭐⭐ **B+ (Tier 2)** | Solid anatomical/clinical focus (384 words) with clear search intent. | KEEP & ENHANCE - Expand with FAQ, anatomical diagram references, and self-care stretches to hit 800+ words. |
| **neck-shoulder-pain-one-side** | [`neck-shoulder-pain-one-side.md`](file:///d:/dev/ascent/content/shoulder/neck-shoulder-pain-one-side.md) | 876 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (876 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **shoulder-pain-rotator-cuff-injury** | [`shoulder-pain-rotator-cuff-injury.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-rotator-cuff-injury.md) | 760 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (760 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **neck-pain-when-turning-head** | [`neck-pain-when-turning-head.md`](file:///d:/dev/ascent/content/shoulder/neck-pain-when-turning-head.md) | 707 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (707 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **how-to-fix-stiff-neck-fast** | [`how-to-fix-stiff-neck-fast.md`](file:///d:/dev/ascent/content/shoulder/how-to-fix-stiff-neck-fast.md) | 699 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (699 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **shoulder-pain-radiating-down-arm** | [`shoulder-pain-radiating-down-arm.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-radiating-down-arm.md) | 684 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (684 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **text-neck-symptoms** | [`text-neck-symptoms.md`](file:///d:/dev/ascent/content/shoulder/text-neck-symptoms.md) | 674 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (674 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **pinched-nerve-neck-symptoms** | [`pinched-nerve-neck-symptoms.md`](file:///d:/dev/ascent/content/shoulder/pinched-nerve-neck-symptoms.md) | 673 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (673 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **burning-pain-between-shoulder-blades** | [`burning-pain-between-shoulder-blades.md`](file:///d:/dev/ascent/content/shoulder/burning-pain-between-shoulder-blades.md) | 668 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (668 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **shoulder-pain-worse-at-night** | [`shoulder-pain-worse-at-night.md`](file:///d:/dev/ascent/content/shoulder/shoulder-pain-worse-at-night.md) | 658 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (658 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **trapezius-muscle-pain-relief** | [`trapezius-muscle-pain-relief.md`](file:///d:/dev/ascent/content/shoulder/trapezius-muscle-pain-relief.md) | 649 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (649 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **pain-at-base-of-skull-and-neck** | [`pain-at-base-of-skull-and-neck.md`](file:///d:/dev/ascent/content/shoulder/pain-at-base-of-skull-and-neck.md) | 627 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (627 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |
| **shoulder-anatomy** | [`shoulder-anatomy.md`](file:///d:/dev/ascent/content/shoulder/shoulder-anatomy.md) | 612 | ⭐⭐⭐⭐⭐ **A (Tier 1)** | High-value long-form clinical content (612 words) targeting high-intent search queries for pain/symptoms. | KEEP & OPTIMIZE - Add Sacramento local schema, internal links to Pain Relief service page, and clear CTA. |

### 📂 Silo: Writings / Blog (38 Items | Avg: 231 words)

| Page Title | File Path | Words | Grade | Primary SEO Intent & Value | Strategic Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **jim-js-review-of-paul-brown-massage-therapy** | [`index.md`](file:///d:/dev/ascent/content/writings/jim-js-review-of-paul-brown-massage-therapy/index.md) | 91 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (91 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **you-are-not-your-thoughts** | [`index.md`](file:///d:/dev/ascent/content/writings/you-are-not-your-thoughts/index.md) | 87 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (87 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **the-happy-baby-pose-or-ananda-balasana-is-a-deep** | [`index.md`](file:///d:/dev/ascent/content/writings/the-happy-baby-pose-or-ananda-balasana-is-a-deep/index.md) | 60 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (60 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **egift-card-sale** | [`index.md`](file:///d:/dev/ascent/content/writings/egift-card-sale/index.md) | 57 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (57 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **flu-shot** | [`index.md`](file:///d:/dev/ascent/content/writings/flu-shot/index.md) | 49 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (49 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **5-bad-habits-walking-can-help-kick-myfitnesspal** | [`index.md`](file:///d:/dev/ascent/content/writings/5-bad-habits-walking-can-help-kick-myfitnesspal/index.md) | 46 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (46 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **getting-your-steps-in** | [`index.md`](file:///d:/dev/ascent/content/writings/getting-your-steps-in/index.md) | 41 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (41 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **via-httpswwwyoutubecomwatchv-dr97vqvvtaai** | [`index.md`](file:///d:/dev/ascent/content/writings/via-httpswwwyoutubecomwatchv-dr97vqvvtaai/index.md) | 37 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (37 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **you-deserve-it** | [`index.md`](file:///d:/dev/ascent/content/writings/you-deserve-it/index.md) | 36 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (36 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **chris-a-video-testimonial** | [`index.md`](file:///d:/dev/ascent/content/writings/chris-a-video-testimonial/index.md) | 29 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (29 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **i-entered-the-330s-today-hw-457-03222017** | [`index.md`](file:///d:/dev/ascent/content/writings/i-entered-the-330s-today-hw-457-03222017/index.md) | 27 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (27 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **another-5-star-review-for-my-couples-massage** | [`index.md`](file:///d:/dev/ascent/content/writings/another-5-star-review-for-my-couples-massage/index.md) | 24 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (24 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **writings** | [`_index.md`](file:///d:/dev/ascent/content/writings/_index.md) | 20 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (20 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **following-up-i-worked-on-that-client-from-the** | [`index.md`](file:///d:/dev/ascent/content/writings/following-up-i-worked-on-that-client-from-the/index.md) | 19 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (19 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **harder-than-normal** | [`index.md`](file:///d:/dev/ascent/content/writings/harder-than-normal/index.md) | 11 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (11 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **honoring-veterans-this-veterans-day-weekend** | [`index.md`](file:///d:/dev/ascent/content/writings/honoring-veterans-this-veterans-day-weekend/index.md) | 9 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (9 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **happy-rules-to-live-by** | [`index.md`](file:///d:/dev/ascent/content/writings/happy-rules-to-live-by/index.md) | 5 | ❌ **F (Tier 5 / Thin)** | Thin legacy post / micro-blurb (5 words) causing crawl dilution and thin content penalty risk. | PRUNE / ARCHIVE or 301 REDIRECT to relevant topic hub. |
| **theracanes-are-great** | [`index.md`](file:///d:/dev/ascent/content/writings/theracanes-are-great/index.md) | 0 | ❌ **F (Tier 5 / Thin)** | Empty file with 0 words. | DELETE or DRAFT until substantial content is created. |
| **februarys-feature** | [`index.md`](file:///d:/dev/ascent/content/writings/februarys-feature/index.md) | 197 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (197 words). | EVALUATE - Merge with related guides or move to archive. |
| **fathers-day-gift-idea** | [`index.md`](file:///d:/dev/ascent/content/writings/fathers-day-gift-idea/index.md) | 157 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (157 words). | EVALUATE - Merge with related guides or move to archive. |
| **fathers-day-and-graduate-gift-cards** | [`index.md`](file:///d:/dev/ascent/content/writings/fathers-day-and-graduate-gift-cards/index.md) | 137 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (137 words). | EVALUATE - Merge with related guides or move to archive. |
| **the-power-of-touch-especially-for-men** | [`index.md`](file:///d:/dev/ascent/content/writings/the-power-of-touch-especially-for-men/index.md) | 125 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (125 words). | EVALUATE - Merge with related guides or move to archive. |
| **koan-the-muddy-road-tanzan-and-ekido-were-once** | [`index.md`](file:///d:/dev/ascent/content/writings/koan-the-muddy-road-tanzan-and-ekido-were-once/index.md) | 118 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (118 words). | EVALUATE - Merge with related guides or move to archive. |
| **private-couples-massage-workshop** | [`index.md`](file:///d:/dev/ascent/content/writings/private-couples-massage-workshop/index.md) | 114 | ⭐⭐ **C (Tier 3)** | Marginal value blog post (114 words). | EVALUATE - Merge with related guides or move to archive. |
| **massage-boosts-immunity** | [`index.md`](file:///d:/dev/ascent/content/writings/massage-boosts-immunity/index.md) | 486 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (486 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **pulling-up-short-aka-ctrrl-alt-del** | [`index.md`](file:///d:/dev/ascent/content/writings/pulling-up-short-aka-ctrrl-alt-del/index.md) | 451 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (451 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **the-apple-test** | [`index.md`](file:///d:/dev/ascent/content/writings/the-apple-test/index.md) | 431 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (431 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **what-is-myofascial-therapy** | [`index.md`](file:///d:/dev/ascent/content/writings/what-is-myofascial-therapy/index.md) | 402 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (402 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **self-myofascial-release-helpful-or-a-waste-of-time** | [`index.md`](file:///d:/dev/ascent/content/writings/self-myofascial-release-helpful-or-a-waste-of-time/index.md) | 306 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (306 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **holiday-availability** | [`index.md`](file:///d:/dev/ascent/content/writings/holiday-availability/index.md) | 288 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (288 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **scalp-massage-yes** | [`index.md`](file:///d:/dev/ascent/content/writings/scalp-massage-yes/index.md) | 251 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (251 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **massage-servicemembers-and-veterans** | [`index.md`](file:///d:/dev/ascent/content/writings/massage-servicemembers-and-veterans/index.md) | 228 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (228 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **the-two-hour-massage-returns** | [`index.md`](file:///d:/dev/ascent/content/writings/the-two-hour-massage-returns/index.md) | 217 | ⭐⭐⭐ **B- (Tier 2)** | Decent educational or self-care article (217 words) but short for organic ranking. | REFRESH - Beef up with research, clinical observations, and local Sacramento context. |
| **myofascial-release** | [`index.md`](file:///d:/dev/ascent/content/writings/myofascial-release/index.md) | 1312 | ⭐⭐⭐⭐ **A- (Tier 1)** | In-depth educational essay (1312 words) with strong evergreen search and authority potential. | KEEP & OPTIMIZE - Add H2/H3 subheadings, meta descriptions, FAQ schema, and links to relevant Service pages. |
| **you-dont-have-to-hurt** | [`index.md`](file:///d:/dev/ascent/content/writings/you-dont-have-to-hurt/index.md) | 1166 | ⭐⭐⭐⭐ **A- (Tier 1)** | In-depth educational essay (1166 words) with strong evergreen search and authority potential. | KEEP & OPTIMIZE - Add H2/H3 subheadings, meta descriptions, FAQ schema, and links to relevant Service pages. |
| **what-is-swedish-massage** | [`index.md`](file:///d:/dev/ascent/content/writings/what-is-swedish-massage/index.md) | 655 | ⭐⭐⭐⭐ **A- (Tier 1)** | In-depth educational essay (655 words) with strong evergreen search and authority potential. | KEEP & OPTIMIZE - Add H2/H3 subheadings, meta descriptions, FAQ schema, and links to relevant Service pages. |
| **back-pain-massage-myofascial-release** | [`index.md`](file:///d:/dev/ascent/content/writings/back-pain-massage-myofascial-release/index.md) | 547 | ⭐⭐⭐⭐ **A- (Tier 1)** | In-depth educational essay (547 words) with strong evergreen search and authority potential. | KEEP & OPTIMIZE - Add H2/H3 subheadings, meta descriptions, FAQ schema, and links to relevant Service pages. |
| **what-you-need-to-kinow-zero-point-advanced-myofascial-release** | [`index.md`](file:///d:/dev/ascent/content/writings/what-you-need-to-kinow-zero-point-advanced-myofascial-release/index.md) | 529 | ⭐⭐⭐⭐ **A- (Tier 1)** | In-depth educational essay (529 words) with strong evergreen search and authority potential. | KEEP & OPTIMIZE - Add H2/H3 subheadings, meta descriptions, FAQ schema, and links to relevant Service pages. |

---

## 4. Prioritized Action Plan & Content Transformation Roadmap

### Phase 1: High-Impact Technical & Crawl Hygiene (Immediate)
1. **Remove `draft: true`** from `content/_index.md`, `content/about/_index.md`, `content/contact/_index.md`, and `content/location/_index.md` to ensure site indexing.
2. **Purge Orphaned / Zero-Value Files:**
   - Delete `content/test.md` (orphaned dummy file).
   - Delete or draft `content/writings/theracanes-are-great/index.md` (0 words).
   - Either write body copy for `content/services/coaching.md` (currently 0 words) or mark it `draft: true` until ready.

### Phase 2: Hub Index Architecture & Clinical Silo Expansion (Weeks 1–2)
1. **Populate Empty Section Indexes:**
   - Add 300–500 words of rich introductory copy, schema markup, and symptom checklists to:
     - `content/low-back-pain/_index.md`
     - `content/mid-back-pain/_index.md`
     - `content/hip-pain/_index.md`
     - `content/fibromyalgia/_index.md`
     - `content/anxiety-and-depression/_index.md`
2. **Mirror Shoulder/Headache Structure:**
   - Create 3–5 high-depth clinical sub-articles for Low Back Pain (e.g. Quadratus Lumborum strain, Sciatica vs Piriformis Syndrome, Sacroiliac joint dysfunction).
   - Create targeted articles for Hip Pain (Gluteal tendinopathy, Iliopsoas tightness).

### Phase 3: Prune & Consolidate Legacy Blog Snippets (Weeks 2–3)
1. **Clean up `content/writings/`:**
   - Migrate the 18 micro-posts (under 90 words) to `out-of-date-content/archive/` or set up 301 redirects in Hugo aliases.
   - Maintain and promote the 5 Tier 1 articles (`myofascial-release`, `you-dont-have-to-hurt`, `what-is-swedish-massage`, `back-pain-massage-myofascial-release`, `what-you-need-to-kinow-zero-point-advanced-myofascial-release`).
2. **Revive & Modernize High-Value Archive Assets:**
   - Move `out-of-date-content/archive/massage-near-me` into `content/writings/massage-near-me-sacramento/index.md` and optimize for local SEO.
   - Move `out-of-date-content/archive/massage-holiday-gift-ideas` into active content for Q4 holiday promotion.

### Phase 4: Local Schema & Conversion Optimization (Weeks 3–4)
1. **Structured Data Injection:**
   - Add `MedicalBusiness` / `HealthAndBeautyBusiness` JSON-LD schema across all pages, referencing Sacramento, CA NAP.
   - Add `MedicalWebPage` and `FAQPage` schema to all Grade A and B condition articles.
2. **Conversion Pathways:**
   - Replace any `[PLACEHOLDER_BOOKING_URL]` and `[PLACEHOLDER_EGIFT_URL]` tokens in `headaches/` and `shoulder/` with live Vagaro booking links.
   - Add localized callouts: *Serving Midtown, East Sacramento, Land Park, Downtown, and surrounding areas.*

---
*Report generated by Antigravity SEO Content Audit Engine for The Firelight Studio.*
