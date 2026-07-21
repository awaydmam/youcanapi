# FIT-CHECK AI — Product Requirements Document (PRD)

> **Your AI Shopping Gatekeeper.** Paste any product link or photo → get instant Skin DNA analysis + Virtual Try-On + honest AI verdict: "Buy" or "Skip."

**Version:** 1.0
**Date:** 2026-07-21
**Hackathon:** YouCam API Skin AI & Apparel VTO Hackathon (Devpost)
**Deadline:** August 16, 2026
**Category:** Skin AI + Apparel VTO (Combined)

---

## 1. Problem Statement

### The $200B Return Crisis
Online fashion has a 24–40% return rate — the highest of any e-commerce category.

**Top reasons for returns:**
1. Color looks different on the buyer's skin than expected
2. Fabric irritates sensitive/problematic skin
3. "Bracketing" — buying 3 sizes, returning 2
4. Impulse purchases without confidence

**No existing solution connects SKIN CONDITION to FASHION DECISIONS.**

Every virtual try-on today answers: *"How does this look on my body?"*
Nobody answers: *"Does this actually suit MY skin, MY tone, MY condition?"*

### Who Suffers
- **Buyers:** Wasted money, wasted time, skin irritation, low confidence
- **Sellers:** Crushed margins, high return logistics cost, lost repeat customers

---

## 2. Solution: FIT-CHECK AI

A **universal AI shopping companion** (web app). Users keep shopping wherever they want (Shopee, TikTok Shop, Zara, ASOS, anywhere). When they find something they like, they paste the product link or upload a photo into FIT-CHECK AI.

The app already knows their **Skin DNA** (scanned once at signup). It instantly:
1. Extracts the product image
2. Runs Virtual Try-On on the user's body photo
3. Analyzes color harmony against their skin tone
4. Checks fabric compatibility with their skin conditions
5. Delivers an honest AI verdict: **"BUY ✅"** or **"SKIP ❌"** with reasons
6. Suggests better alternatives if the verdict is Skip

**Core principle:** We don't sell clothes. We help people buy the RIGHT clothes.

---

## 3. Target Users

### Primary: Online Shoppers (18–35)
- Shop on multiple platforms (Shopee, TikTok Shop, Instagram, Zara, H&M, ASOS)
- Frustrated by returns and "looks different in real life"
- Care about how clothes match their skin appearance
- Active on social media (will share funny/surprising results)

### Secondary: Fashion Sellers / Brands
- Want to reduce return rates
- Want data on which colors/styles match which customer segments
- Need tools to understand why products get returned

---

## 4. YouCam APIs Used

| API | Purpose | When Called |
|-----|---------|------------|
| **AI Skin Analysis** | Detect 14 skin concerns (acne, wrinkles, dark spots, redness, oiliness, etc.) | Once at signup (Skin DNA creation) |
| **AI Fitzpatrick Skin Type** | Categorize skin tone (Type I–VI) | Once at signup |
| **AI Facial Color Tones** | Detect undertone (warm/cool/neutral), lip, eye, eyebrow, hair colors | Once at signup |
| **AI Clothes Virtual Try-On** | Generate photo of user wearing the pasted/uploaded garment | Every product check |
| **AI Face Attributes** (optional) | Face shape analysis for neckline/collar recommendations | Once at signup |

**Total APIs integrated: 4–5** (strongest in the "combined" category)

---

## 5. User Flow & Pages

### Page 1: LANDING PAGE (`/`)

**Purpose:** First impression. Explain the concept in 5 seconds.

**Content:**
- Hero section:
  - Headline: **"Stop Guessing. Start Glowing."**
  - Subheadline: *"Paste any product link. See it on you. Know if it's right for YOUR skin."*
  - CTA button: **"Create Your Skin DNA — Free"**
- How it works (3-step visual):
  1. 📸 Scan your skin (once)
  2. 🔗 Paste any product link
  3. ✅ Get instant verdict: Buy or Skip
- Impact stats bar:
  - "30% of online fashion purchases get returned"
  - "68% of returns are due to color/fit mismatch"
  - "FIT-CHECK AI reduces regret purchases"
- Social proof / demo video section
- Footer with links

**No login required to view. CTA leads to signup/scan.**

---

### Page 2: SKIN DNA SETUP (`/scan`)

**Purpose:** One-time skin profile creation. This is the "wow" moment.

**Flow:**
1. User uploads a clear selfie (face, good lighting)
2. Optionally uploads a full-body photo (for VTO baseline)
3. Loading animation: *"Analyzing your skin..."*
4. Results appear as a beautiful **Skin DNA Card**:

```
🧬 YOUR SKIN DNA
━━━━━━━━━━━━━━━━━━━━━━━
Skin Type    : Fitzpatrick IV (Medium Brown)
Undertone    : Warm (golden/olive undertones)
Season       : Autumn palette

Skin Status:
├── Hydration    : Good ✅
├── Oiliness     : Moderate ⚠️
├── Acne         : Mild (chin area) ⚠️
├── Dark Spots   : Minimal ✅
├── Redness      : Low ✅
└── Sensitivity  : Moderate ⚠️

Your Best Colors:
🟫 Terracotta  🟤 Chocolate  🟢 Olive
🔵 Navy        🟠 Burnt Orange  ⚫ Charcoal

Colors to Avoid:
🩷 Baby Pink  🟡 Neon Yellow  ⚪ Stark White

Fabric Advisory:
✅ Cotton, Linen, Silk, Bamboo
⚠️ Denim (ok if soft-washed)
❌ Polyester, Nylon (may irritate)
━━━━━━━━━━━━━━━━━━━━━━━
```

5. User confirms and saves → redirected to Dashboard

**Technical:** Calls Skin Analysis + Fitzpatrick + Facial Color Tones APIs simultaneously.

---

### Page 3: DASHBOARD / CHECK PAGE (`/dashboard`)

**Purpose:** The main hub. This is where the magic happens daily.

**Layout:**
- Top: User's mini Skin DNA card (collapsible)
- Center (prominent):
  - **Large input area** with two options:
    - 🔗 Text field: "Paste a product URL"
    - 📸 Upload button: "Or upload a product photo"
  - Big CTA: **"Check This Product"**
- Below: Recent checks history (thumbnails + verdicts)
- Sidebar/bottom: Quick stats
  - "Products checked: 12"
  - "Money saved from skipped items: $45"
  - "Best match this week: Navy V-neck (Score 96)"

---

### Page 4: RESULT PAGE (`/result/:id`)

**Purpose:** The detailed verdict for a specific product check. THIS is the page people screenshot and share.

**Layout — Two columns (desktop) / stacked (mobile):**

**Left column: VISUAL**
- Original product photo (as-is from the link)
- Virtual Try-On photo (user wearing the item)
- Side-by-side toggle/slider

**Right column: AI VERDICT**

```
━━━━━━━━━━━━━━━━━━━━━━━
         VERDICT
━━━━━━━━━━━━━━━━━━━━━━━

  ❌ SKIP THIS ONE

  Confidence: 73% NOT recommended

━━━━━━━━━━━━━━━━━━━━━━━
```

**Why Skip — detailed breakdown:**
- 🎨 **Color Match: 38/100** — "This pastel pink clashes with your warm undertone. It will make your skin look washed out and emphasize the redness on your cheeks."
- 🧵 **Fabric Safety: 25/100** — "This is 100% polyester. Given your moderate skin sensitivity and oiliness, synthetic fabrics may cause irritation and breakouts."
- 👕 **Style Fit: 72/100** — "The V-neck cut is actually great for you. The issue is purely color and fabric."
- 📊 **Overall Glow Score: 38/100**

**AI Recommendation:**
> *"If you love this style, look for the same cut in Navy or Olive, made from cotton or linen. That combination would score 92+ for your Skin DNA. Here's what it might look like:"*

**Alternative preview:** AI-suggested color VTO preview (if possible) or color swatch suggestion.

**Share button:** "Share your FIT-CHECK result" → generates a shareable card image

---

### Page 5: HISTORY PAGE (`/history`)

**Purpose:** Track all past checks, see patterns, celebrate good decisions.

**Content:**
- Grid/list of all checked products
- Each card shows: product thumbnail, VTO preview, verdict badge (BUY/SKIP), Glow Score
- Filter by: All / Recommended / Skipped
- Stats summary:
  - Total checks
  - Money saved (estimated from skipped items)
  - Most common recommendation
  - Your Glow Score trend

---

### Page 6: PROFILE & SKIN DNA (`/profile`)

**Purpose:** View and update Skin DNA, manage account.

**Content:**
- Full Skin DNA card (detailed)
- Option to re-scan (if skin condition changed, e.g., seasonal)
- Body photo management (for VTO)
- Preferences: fabric sensitivities, color preferences (manual overrides)
- Account settings

---

## 6. Architecture

```
┌─────────────────────────────────────────────┐
│                 FRONTEND                     │
│           React + Tailwind CSS              │
│              (Vite + Vercel)                │
├─────────────────────────────────────────────┤
│                                             │
│  Landing → Scan → Dashboard → Result        │
│                                             │
├─────────────────────────────────────────────┤
│                 BACKEND API                  │
│              Node.js / Express              │
│           (or Next.js API routes)           │
├──────────┬──────────┬───────────────────────┤
│          │          │                       │
│  YouCam  │  Product │  AI Intelligence      │
│  API     │  Scraper │  Engine               │
│  Gateway │          │                       │
│          │  - URL   │  - Color theory       │
│  - Skin  │    meta  │  - Skin × fashion     │
│    Scan  │  - Image │    matching logic     │
│  - VTO   │    extract│  - Fabric advisory   │
│  - Face  │          │  - Verdict generator  │
│          │          │  - LLM for natural    │
│          │          │    language review     │
└──────────┴──────────┴───────────────────────┘
```

### Product Link Processing Pipeline

```
User pastes URL
    ↓
Backend extracts product image
(OpenGraph meta / page scraping)
    ↓
Image sent to YouCam Apparel VTO
+ user's body photo → VTO result
    ↓
Skin DNA (stored) + Product attributes
→ Color Harmony Engine (undertone matching)
→ Fabric Safety Engine (skin condition check)
→ Style Compatibility Engine
    ↓
All scores aggregated → Glow Score
    ↓
LLM generates natural-language verdict
    ↓
Result page rendered
```

---

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+, Tailwind CSS, Vite |
| Routing | React Router v7 |
| State | Zustand (lightweight) |
| Backend | Next.js API routes OR Express.js |
| AI/ML APIs | YouCam (Skin Analysis, Fitzpatrick, Color Tones, Apparel VTO) |
| AI Text | OpenAI GPT / Claude for natural verdict text |
| Product Scraping | Cheerio + fetch for OG image extraction |
| Storage | LocalStorage / IndexedDB (local-first, no DB needed for MVP) |
| Auth | Optional (can work without login for hackathon) |
| Hosting | Vercel |
| Wireframe | NeedMCP |

---

## 8. Hackathon Judging Alignment

### Technological Implementation (Weight: High)
- **4–5 YouCam APIs** integrated (most submissions will use 1–2)
- Non-trivial pipeline: scraping → VTO → skin analysis → scoring → verdict
- Agentic AI workflow: autonomous decision-making agent

### Design (Weight: High)
- Complete product experience, not a proof-of-concept
- Landing → Onboarding → Daily Use → History loop
- Mobile-responsive, shareable results

### Potential Impact (Weight: High)
- Addresses $200B+ return problem with quantifiable metrics
- Works with ANY e-commerce platform (universal)
- Viral potential through shareable verdict cards
- Clear monetization path (affiliate + freemium)

### Quality of Idea (Weight: High)
- Nobody has built "skin-aware shopping validation"
- Novel connection: dermatology × fashion × e-commerce
- Solves a problem people don't even know they have (but instantly recognize)

---

## 9. MVP Scope (Hackathon)

### Must Have (Week 1–2)
- [ ] Landing page
- [ ] Skin DNA scan & profile creation
- [ ] Product URL paste → image extraction
- [ ] Product photo upload
- [ ] YouCam Apparel VTO integration
- [ ] Color harmony scoring (Skin DNA vs product color)
- [ ] AI verdict generation (Buy/Skip + reasons)
- [ ] Result page with VTO preview + verdict
- [ ] Mobile-responsive design

### Should Have (Week 2–3)
- [ ] Check history page
- [ ] Fabric safety advisory
- [ ] Alternative color recommendations
- [ ] Shareable verdict card (for social media)
- [ ] "Money saved" counter

### Nice to Have (if time allows)
- [ ] Browser extension (paste from any page)
- [ ] Seller analytics dashboard (mock)
- [ ] Multiple body photos for different VTO angles
- [ ] Skin re-scan for seasonal changes

---

## 10. Demo Video Script (1–3 min)

1. **Problem hook (15s):** "30% of clothes bought online get returned. The #1 reason? They look different on YOU than on the model."
2. **Solution intro (10s):** "FIT-CHECK AI is your personal shopping gatekeeper. It knows your skin, and tells you before you buy."
3. **Skin DNA demo (30s):** Show the scan process, the DNA card reveal
4. **Product check demo (45s):** Paste a real product URL → loading → VTO appears → verdict with scores → skip recommendation → alternative suggestion
5. **Second check (20s):** Show a "BUY ✅" result for contrast
6. **Impact (15s):** Stats, viral potential, business model
7. **Tech (10s):** "Built with 5 YouCam APIs, color theory engine, and AI-powered verdict generation"

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| VTO quality depends on input photo | Provide photo guidelines, use demo photos for hackathon |
| Product URL scraping may fail on some sites | Fall back to manual photo upload |
| Color analysis accuracy | Use YouCam's dermatologist-verified Skin Analysis as ground truth |
| Rate limit (1000 free API units) | Cache Skin DNA results, optimize calls |
| Limited API units for demo | Pre-cache demo scenarios, use recorded video for complex flows |

---

## 12. Future Vision (Post-Hackathon)

- **Browser Extension:** Check products directly on any e-commerce page
- **Mobile App:** Camera-based instant product scanning in physical stores
- **Seller SDK:** Brands embed FIT-CHECK scores on their own product pages
- **Social Features:** Share outfits, compare Glow Scores with friends
- **Seasonal Skin Updates:** Re-scan quarterly as skin changes with seasons
- **AI Wardrobe:** Build a virtual closet, get outfit combination suggestions

---

*FIT-CHECK AI — Stop guessing. Start glowing.* ✨
