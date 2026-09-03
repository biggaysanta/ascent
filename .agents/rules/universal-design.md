---
trigger: always_on
---

---

title: Universal Design

---

# Website Design Brief

## Brand

- Name: [The Firelight Studio by Paul Brown Massage Therapy]
- Industry: [massage therapy, healthcare, life coaching]
- Personality: [intelligent, sophisticated, compassionate]
- Tone: [80 percent technical, 15 percent casual, 5 percent sassy]

## Target Audience
- Primary: [sacramentans and surrounding cities, "35-65"]
- Pain point: [they are solving back pain, neck pain, carpal tunnel, deep stress, body pain in general]
- Decision drivers: [features, what's in it for them, pain relief, availability, trust, price is not a concern]

## Visual Direction
- Style: [minimal sophisticated elegance, but a colorful restrained palette]
- Color mood: [neutral most, but vibrant where important]
- Primary color: There are twelve fully formed themes, each with its own primary color, and a palette of supporting colors.
- Dark mode: a fully dark mode that leverages each color themes unique mood and professional presentation

## Page Structure

- Type: home page
- sections: hero video, conditions treated, service tabs. sidebar: announcements, author bio, featured article theme. footer: typical footer stuff: copyright, tertiary menu, book now link/button, gift card link.
- Type: [Pillar page]
- sections: hero, overview, pages related to pillar topic. sidebar
- Sections needed: [welcome, ask them how i can help, lead them throughhero, features, pricing, testimonials, cta, footer]
- Priority content: [What should visitors see first?]
- CTA goal: [signup / demo / purchase / contact]

# Technical Constraints

- Framework: [tailwindcss latest, hugo ssg, alpine.js, Cassoon Atlas]
- Must be: [responsive / accessible / SSR-safe/ super lightweight]
- Has: [subtle animation, lightweight javascript, lightweight videos and images]

## Content Hints

- Headline style: [concise, compassionate, scientific, funny]
- Imagery: [imagery reminiscent of muscle tissue, flow-y, scientific]
- Social proof: [testimonials and videos]

## some design constraints

= glassmorphism: 
opacity presets:
bg-*/10
border-*/20
if appropriate, hover: add 10 to opacity value
for active a: subtract 5 from normal opacity
backdrop-blur-sm
all buttons have a base elevation of 2, hover elevation of 3, active elevation of 1
focus-visible ring outline-offset-3 offset-tertiary/20 hover adds 10

bg-gradients, linear to bottom, secondary/30 to primary/30


- default theme: the default theme is ALWAYS "theme-auntie-em" NOT "theme-neutral"
