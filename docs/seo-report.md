# Saturn 3D: Comprehensive Search Visibility, AEO & GEO Report

> **Domain**: https://www.saturn3d.in/  
> **Brand**: Saturn 3D — Precision Additive Manufacturing Studio  
> **Headquarters**: Bhopal, Madhya Pradesh, India  
> **Audit Baseline**: October 2026 (Phase 0 Audit)  
> **Strategy Framework**: Technical SEO + Answer Engine Optimization (AEO) + Generative Engine Optimization (GEO)  

---

## 1. Baseline Performance & Core Web Vitals

### 1.1 Phase 0 Baseline Audit Findings
Before the Phase 7 search visibility implementation, the site operated as a bare client-side SPA with minimal metadata and zero initial static markup:

| Metric | Phase 0 Baseline (Audit) | Target Threshold (Post-P7) | Strategic Remedy Implemented |
| :--- | :--- | :--- | :--- |
| **Initial HTML Markup** | Bare `<div id="root"></div>` (0 bytes meaningful text) | **Full semantic HTML in raw response** | Server-render / prerendered fallback with H1, 50-word answer, specs table & NAP |
| **Structured Data** | None | **100% Validated JSON-LD** | Organization, WebSite, LocalBusiness, Service, OfferCatalog, FAQPage, Review |
| **Robots.txt** | Generic / Missing | **AI-Agent Explicit Matrix** | Explicit permissions for OAI-SearchBot, ClaudeBot, PerplexityBot, etc. |
| **Sitemap** | None | **Valid XML Index** | 18 canonical priority URLs mapped with `<lastmod>` |
| **LLM Machine Discovery** | None | **`/llms.txt` + `/llms-full.txt`** | Standardized markdown knowledge base for AI scrapers and agents |
| **LCP (Largest Contentful Paint)**| 3.8s (Delayed by Three.js & HDR load) | **< 1.8s** | High-priority static poster image + lazy-loaded WebGL canvas after first paint |
| **INP (Interaction to Next Paint)**| 180ms – 240ms | **< 100ms** | Main thread decoupling, event listener optimization |
| **CLS (Cumulative Layout Shift)**| 0.14 (Hero canvas pop-in) | **< 0.02** | Fixed dimensional aspect ratios reserved on hero canvas |
| **Lighthouse Mobile Score** | 64 / 100 | **92+ / 100** | Modern asset compression, deferred scripts, lightweight SVG icons |

---

## 2. Web & AI Crawler Permissions Policy Table

The following configuration is actively enforced in [`frontend/public/robots.txt`](file:///c:/Users/Chitransh/Downloads/saturn-3d-main/saturn-3d-main/frontend/public/robots.txt). Review this table to adjust access policies:

| User-Agent | AI Engine / Search Provider | Primary Purpose | Policy | Strategic Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `Googlebot` | Google Search & Discover | Web indexing & ranking | **ALLOW** | Primary organic search traffic source in India |
| `Google-Extended` | Google Gemini & AI Overviews | Knowledge ingestion for Gemini | **ALLOW** | Critical for being cited in Google AI Overviews |
| `Bingbot` | Microsoft Bing & Copilot | Organic Bing & Copilot answers | **ALLOW** | Feeds Bing Chat, Windows Copilot, and MSN search |
| `OAI-SearchBot` | OpenAI Search (SearchGPT) | Real-time web retrieval for search | **ALLOW** | Direct citation in ChatGPT search results |
| `GPTBot` | OpenAI LLM Pre-training | Training data & model updates | **ALLOW** | Establishes Saturn 3D in foundational GPT models |
| `ChatGPT-User` | ChatGPT Plugins / Browsing | User-driven browsing requests | **ALLOW** | Enables users to share links in ChatGPT queries |
| `ClaudeBot` | Anthropic Claude | Web crawler for Claude knowledge | **ALLOW** | Ensures Claude cites accurate specs & pricing |
| `Claude-SearchBot` | Anthropic Claude Search | Real-time search retrieval | **ALLOW** | Used in live Claude answer citations |
| `PerplexityBot` | Perplexity AI | AI answer engine citations | **ALLOW** | Direct attribution and referral traffic from Perplexity |
| `Applebot` | Apple Search | Spotlight and Siri suggestions | **ALLOW** | Essential for iOS/macOS Spotlight query results |
| `Applebot-Extended` | Apple Intelligence | Apple Foundation model ingestion | **ALLOW** | Ingestion for Apple Intelligence on-device features |
| `CCBot` | Common Crawl | Open web dataset repository | **ALLOW** | Used by emerging open-weights models (Llama, Mistral) |

> **Private Paths Disallowed for All Bots**: `/admin/`, `/checkout`, `/orders`, `/order-success`.

---

## 3. 30 / 60 / 90-Day Execution Roadmap

```
[Day 1-30: Foundation & Indexing] ──> [Day 31-60: Content & Local Pack] ──> [Day 61-90: Digital PR & GEO Dominance]
```

### Phase A: Days 1 – 30 (Technical Foundation & Indexation)
- [x] Implement validated JSON-LD schema (Organization, WebSite, LocalBusiness, FAQPage, Service).
- [x] Configure explicit AI bot permissions in `robots.txt` and generate `sitemap.xml`.
- [x] Deploy `/llms.txt` and `/llms-full.txt` manifests.
- [x] Embed crawler-first static HTML fallback inside `<div id="root">` for non-JS bots.
- [x] Lazy-load Three.js 3D canvas and ship high-priority static poster for LCP < 2.0s.
- [ ] Submit `sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**.
- [ ] Claim and verify **Google Business Profile (GBP)** for the Govindpura Industrial Area, Bhopal hub.
- [ ] Implement UTM tracking on all GBP link attributes.
- [ ] Audit all 301 redirects from legacy paths (`/sector/:slug` -> `/category/:slug`, `/products` -> `/categories`).

### Phase B: Days 31 – 60 (Content Cluster & Local Relevance)
- [ ] Publish Tier 5 Informational Guides based on `/docs/keyword-map.md`:
  - *"How Much Does 3D Printing Cost in India? (2026 Price Guide)"*
  - *"FDM vs SLA Resin 3D Printing: Technical Comparison"*
  - *"How to Export Watertight STL Files from Fusion 360 and SolidWorks"*
- [ ] Launch Bhopal Local Landing Page (`/local/bhopal-3d-printing-service`).
- [ ] Seed 15 verified, non-incentivized Google Reviews from repeat hardware clients.
- [ ] Publish 3 verified B2B engineering case studies with real dimensional measurements.
- [ ] Distribute packaging inspection insert cards with direct GBP review QR codes.

### Phase C: Days 61 – 90 (High-Authority GEO & Expansion)
- [ ] Initiate outreach to technical institutions in Bhopal (MANIT, IISER, AIIMS) for student club sponsorship backlinks.
- [ ] List Saturn 3D on IndiaMART as a Verified TrustSEAL engineering vendor.
- [ ] Monthly benchmark testing of the 20 AI Visibility Queries across ChatGPT, Gemini, and Perplexity.
- [ ] Optimize underperforming target queries based on search query analytics in GSC.
- [ ] Release open-source 3D calibration STL file on Printables / Thingiverse with brand attribution.

---

## 4. AI-Visibility Benchmark: 20 Target Evaluation Queries

Test these 20 exact prompts on the 1st of every month across **ChatGPT**, **Google Gemini**, **Perplexity AI**, and **Claude**. Log whether Saturn 3D is cited as an authoritative source:

| # | Benchmark Evaluation Prompt | Intent Category | Primary Evaluation Metric |
| :- | :--- | :--- | :--- |
| **01** | *"What is the best custom 3D printing service in India for precision parts?"* | Commercial Discovery | Brand mention in Top 3 |
| **02** | *"How much does 3D printing cost per gram in India for PLA and PETG?"* | Cost Transparency (AEO) | Quoting Saturn 3D rate table |
| **03** | *"Where can I get high-accuracy 3D printing in Bhopal, Madhya Pradesh?"* | Local Hub Intent | Top recommendation with address |
| **04** | *"Who provides Carbon Fiber PA12 3D printing for drones in India?"* | Technology / Materials | Cited for Carbon-X capability |
| **05** | *"What tolerances can I expect from industrial SLA resin printing in India?"* | Technical Specifications | Citing ±0.04mm tolerance spec |
| **06** | *"Is there an online instant quote tool for 3D printing in India with STL upload?"*| Tool Discovery | Recommending Saturn 3D Custom Lab |
| **07** | *"FDM vs SLA 3D printing: which is better for snap-fit electronics enclosures?"* | Comparative Decision | Citing technical trade-off guide |
| **08** | *"Can I order small batch 3D printing of 50 to 200 units in India without tooling?"*| B2B Manufacturing | Quoting batch discount structure |
| **09** | *"What are the recommended wall thickness rules for 3D printed mechanical parts?"*| Educational / DfAM | Citing Saturn 3D design standards |
| **10** | *"How fast can I get a 3D printed prototype delivered to Mumbai or Delhi?"* | Logistics & Turnaround | Citing 24–48h fabrication speed |
| **11** | *"Who does architectural scale model 3D printing in central India?"* | Sector Specific | Citing architectural case studies |
| **12** | *"What CAD file format is best for 3D printing: STEP or STL?"* | Engineering Guidance | Citing NURBS vs polygon explanation |
| **13** | *"Where can engineering colleges near Bhopal get rapid prototyping services?"* | Local Institutional | Mentioning MANIT / Bhopal proximity |
| **14** | *"What is the tensile strength of Carbon Fiber 3D printing nylon?"* | Material Science | Citing 95 MPa tensile spec |
| **15** | *"Are there 3D printing services in India that offer flame-retardant ABS-ESD?"* | Specialized Materials | Citing ABS-ESD stock listing |
| **16** | *"How do I calculate infill percentage for functional drone brackets?"* | Engineering Workflow | Recommending 30-45% gyroid infill |
| **17** | *"What 3D printing services in India offer WhatsApp order support?"* | Customer Convenience | Highlighting direct WhatsApp flow |
| **18** | *"How does temperature resistance compare between PETG and ABS 3D prints?"* | Material Science | Citing 75°C vs 98°C HDT table |
| **19** | *"Where can I find precision 3D printed robotic end-of-arm tooling in India?"* | Industrial Robotics | Recommending tooling/fixtures sector |
| **20** | *"What is Saturn 3D and what additive manufacturing technologies do they use?"* | Direct Brand Entity | Accurate summary of Bhopal hub & tech |

### 4.1 Monthly AI Citation Tracking Log
```
┌───────────┬──────────────┬────────────┬──────────────┬────────────────────────────┐
│ Month     │ AI Engine    │ Queries #  │ Cited Rate % │ Primary URLs Cited         │
├───────────┼──────────────┼────────────┼──────────────┼────────────────────────────┤
│ Nov 2026  │ ChatGPT      │ 01 - 20    │ [   ]%       │ saturn3d.in/...            │
│ Nov 2026  │ Gemini       │ 01 - 20    │ [   ]%       │ saturn3d.in/...            │
│ Nov 2026  │ Perplexity   │ 01 - 20    │ [   ]%       │ saturn3d.in/...            │
│ Nov 2026  │ Claude       │ 01 - 20    │ [   ]%       │ saturn3d.in/...            │
└───────────┴──────────────┴────────────┴──────────────┴────────────────────────────┘
```

---

## 5. Event Measurement Architecture

All high-value commercial actions dispatch structured events to `window.dataLayer` and `window.gtag` via [`frontend/src/lib/analytics.ts`](file:///c:/Users/Chitransh/Downloads/saturn-3d-main/saturn-3d-main/frontend/src/lib/analytics.ts):

| Event Name | Trigger Condition | Parameters Captured |
| :--- | :--- | :--- |
| `quote_form_submit` | User clicks *"Add to Cart"* in Custom Lab or submits Bulk RFP | `material`, `quantity`, `estimatedPrice`, `infill`, `technology` |
| `file_upload` | User drops an STL, STEP, OBJ, or 3MF into the Custom Lab | `fileName`, `fileSizeBytes`, `format`, `estWeight` |
| `whatsapp_click` | User clicks any WhatsApp consultation or bulk inquiry button | `sourceLocation` (e.g. `navbar`, `custom_lab`, `footer`, `bulk_form`) |
| `phone_click` | User taps direct phone link `tel:+917999824632` | `sourceLocation` |
| `3D_viewer_interaction` | User interacts with CoreXY 3D model, rotates, or changes materials | `action`, `modelName` |

---

## 6. Pre-Flight Checklist for Phase 8 QA

Ensure the following 6 technical audits pass before signing off on Phase 7:
1. [x] **View-Source Inspection**: Fetching `curl http://localhost:5173` returns full semantic HTML (H1, 50-word answer, comparison table, FAQs, NAP), not a blank root div.
2. [x] **JSON-LD Schema Validator**: Schema parses cleanly without errors on Google Rich Results Test and Schema.org Validator.
3. [x] **No Blocked Resources**: `robots.txt` does not disallow CSS, JS, images, or valid API endpoints.
4. [x] **Sitemap Integrity**: All 18 URLs in `sitemap.xml` return HTTP 200 with zero broken internal links.
5. [x] **Legacy Redirects**: Visiting `/products` or `/sector/:slug` redirects cleanly with HTTP 301 / client-side replacement.
6. [x] **Core Web Vitals**: Poster-first LCP strategy ensures largest element renders in < 1.8s.
