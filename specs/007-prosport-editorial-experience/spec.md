# Feature Specification: ProSport Editorial Experience (Nike-inspired Customer/Public UI)

**Feature Branch**: `007-prosport-editorial-experience`

**Created**: 2026-07-18

**Status**: Draft — awaiting `APPROVE SPEC`

**Input**: Redesign the Customer/Public-facing surfaces (Homepage, Navbar/Footer, Apex
booking/matches/shop, Gear catalog/cart/checkout, Matches discovery/create/detail) toward
a modern editorial sports-commerce direction "inspired by Nike, not a copy of Nike" —
strong purposeful sports imagery, large confident type, generous whitespace, simple
navigation, short CTAs, full-width hero, content rails (Featured/Trending/Shop by Sport),
minimal image-led product cards, strong mobile responsiveness. Admin/Owner/Elite and all
backend/API/business logic are explicitly out of scope.

## Audit Findings (grounding this spec)

Read directly from the running codebase (`index.css`, live app, and every in-scope file)
before drafting — not assumed from documentation.

### A. A real identity already exists and is inconsistently applied
`index.css` defines a genuine, non-generic identity — "editorial sports brutalism": ink
navy (`--color-ink: #0d1b2a`), cream paper (`--color-paper: #f3f2ee`), teal accent
(`--color-accent: #14b8a6`), Montserrat/Be Vietnam Pro/Anton display type (uppercase, wide
tracking), Inter body, JetBrains Mono uppercase "eyebrow" labels, a deliberate two-radius
system (`rounded-[2px]` for data objects, `rounded-[8px]` for buttons/inputs), and flat
borders with **no ambient shadow at rest** (shadow only appears on hover-lift for truly
interactive elements). This is confirmed live in `HomePage.jsx` (GSAP-animated hero,
"Hiệu suất mượt mà. Kiểm soát đỉnh cao."), `Navbar.jsx`, `Footer.jsx`, `GearLayout.jsx`,
`MatchProLayout.jsx`, `MatchDetailPage.jsx`, and the already-remediated `ApexHomePage.jsx`
/ `ApexBookingsPage.jsx` / `ApexLayout.jsx` (fixed in a prior session pass) — all of which
correctly use the token vocabulary (`bg-ink`, `bg-surface`, `text-foreground`,
`border-border-strong`, `label-mono`, `.btn-primary`, `.btn-outline`).

**However**, most of the remaining in-scope surface has NOT been brought in line and still
carries generic "AI SaaS" styling — hardcoded `bg-white`/`text-gray-*`, `bg-teal-50`
pastel washes, `rounded-full` pill buttons/badges, and soft ambient
`shadow-[0_2px_12px_rgba(0,0,0,0.03)]`-style shadows, measured directly by grep:

| File | Hardcoded/off-brand hits |
|---|---|
| `pages/apex/ApexBookingPage.jsx` | 75 |
| `pages/apex/ApexMatchesPage.jsx` | 71 |
| `pages/matches/CreateMatchPage.jsx` | 59 |
| `pages/apex/ApexShopPage.jsx` | 55 |
| `pages/gear/CartPage.jsx` | 36 |
| `pages/matchpro/MatchProFeedPage.jsx` | 39 |
| `pages/gear/GearCatalogPage.jsx` | 30 |
| `pages/gear/CartCheckoutPage.jsx` | 27 |
| `pages/gear/GearDetailPage.jsx` | 22 |
| `pages/matches/MatchDetailPage.jsx` | 0 (already on-brand — a working reference) |

### B. `docs/ui/*.md` describe a DIFFERENT, abandoned direction — flagged, not followed
`docs/ui/design-system-spec.md`, `ui-audit.md`, `remediation-plan.md`, and
`market-benchmark.md` describe a "Minimalist/Cold Luxury" system with soft ambient shadow
tokens (`--shadow-sm/md/float`), large radii (`rounded-2xl`/16px), three "density tiers"
(Comfortable/Operational/Compact padding per role), a different ink hex (`#0f172a` vs. the
real `#0d1b2a`), and shared components (`BaseButton`/`BaseTable`/`BaseCard` in
`src/components/ui/`) that **do not exist in the codebase**. This is the exact opposite of
what is actually implemented and live (flat, hard-bordered, no-shadow-at-rest). These docs
are **stale / superseded planning artifacts from an earlier, abandoned direction** and must
not be treated as the source of truth.

**Recommended source of truth**: `src/frontend/src/index.css` (the `@theme` token block)
plus the already-correct live pages (`HomePage.jsx`, `Navbar.jsx`, `Footer.jsx`,
`MatchDetailPage.jsx`, the remediated Apex home/bookings pages). This spec proceeds on that
basis. **This is flagged for explicit confirmation** — see Assumptions.

### C. One orphaned file
`src/layouts/MatchProLayout.css` (292 lines) defines an entirely different, inconsistent
palette (`#0F172A`, `#0fc8b5`, `#22c55e`, `#ef4444`, pastel blue-grays) and is **not
imported anywhere** in the codebase (confirmed via full-repo search) — dead code that
happens to cause no active harm, but is a trap for future confusion. Flagged for cleanup;
disposition decided in Assumptions (not treated as in-scope redesign work).

### D. Shell layer is largely solid already
`Navbar.jsx`, `Footer.jsx`, `GearLayout.jsx`, and `MatchProLayout.jsx` (the JSX, not the
orphaned CSS) already use the correct token vocabulary. The redesign effort concentrates on
**page content**, not chrome — the navigation/shell foundation mostly needs consistency
verification and light unification (e.g. `/matches/nearby` appearing as both a top-level
Navbar link and a MatchPro sub-nav item), not a rebuild.

## Design Direction (Pass 1 — per `frontend-design` skill)

**Subject**: ProSport is a real-time racket-sports platform unifying three needs into one
journey — *find a court → find people to play with → gear up for the match* — for
Badminton, Pickleball, and Tennis players in Vietnam (current data-backed sports; no others
invented).

**Audience**: Vietnamese recreational and competitive racket-sport players, mobile-first,
who need fast decisions and trustworthy information (real-time court availability, real
match rosters, real stock) — not a lifestyle-browsing audience.

**Job per surface**:
- **Homepage**: route the visitor to Đặt sân (Book), Ghép trận (Match), or Cửa hàng (Shop) within seconds — already close to right; extend the pattern into a homepage-as-hub for logged-in Apex users too.
- **Booking discovery**: find an open court + time fast, understand price, finish the reservation with zero ambiguity.
- **Match discovery**: scan open matches, understand skill level/format/time at a glance, join or create in a few taps.
- **Shop/catalog**: browse gear relevant to the sport you play, get to product detail and checkout without friction.

**Visual thesis**: *ProSport is a scoreboard, not a storefront.* Every surface should read
like match-day instrumentation — courts as a live availability board, matches as a roster/
scoreboard object, gear as equipment inventory — using the editorial-brutalist system
already proven on the homepage and in the already-fixed Apex home/bookings pages, extended
consistently rather than reinvented.

**Token proposal — inherit, do not replace**:
- **Color** (existing, reused): Ink `#0d1b2a` · Paper `#f3f2ee` · Accent Teal `#14b8a6` · Warning `#b26a00` · Danger `#b23b3b`. No new hues introduced.
- **Type**: Display = Montserrat (800/900) uppercase wide-tracking, used with restraint (headlines, section titles, big numerals) — existing. Body = Inter — existing. Utility/data = JetBrains Mono uppercase tracked (`label-mono`) for eyebrows, prices-as-data, timestamps, status — existing.
- **Type scale**: existing Tailwind scale as already used (`text-4xl`/`5xl` display headlines, `text-[13px]`–`text-sm` body, `text-[10px]`–`text-[11px]` mono eyebrows) — kept, not redefined.
- **Spacing rhythm**: generous section padding on public/marketing surfaces (already `py-16`+ on Homepage sections); tighter, task-focused rhythm inside booking/match/shop flows (already the Apex pattern) — kept as-is, not merged into a single density.
- **Radius/border/shadow**: the existing two-tier system is correct and must be extended, not replaced — `rounded-[2px]` + `border-2 border-border-strong` for data objects (court cards, match cards, product cards), `rounded-[8px]` for buttons/inputs, **no ambient shadow at rest**, hover = lift + accent glow only on genuinely interactive elements.
- **Image ratio/treatment**: consistent aspect ratios per card family (e.g. 4:3 for court/venue photography, 1:1 or 4:5 for product photography), object-cover, a single treatment for "no image" fallback states — to be finalized in Plan with an asset shot-list if stock photography gaps exist (no Nike imagery).
- **Motion**: reuse the existing GSAP-on-Homepage vocabulary (reveal-on-scroll, hero entrance) for hero/rail moments only; everything else stays static per the skill's "less is more" guidance; `prefers-reduced-motion` respected everywhere motion is added.

**Layout directions (ASCII, two options per surface, decided during Plan)**:

*Homepage (extends the existing hero pattern into a rail-based body)*
```
Option A — Full-bleed hero + 3 content rails
┌──────────────────────────────────────────┐
│  FULL-WIDTH HERO (existing GSAP pattern)  │
│  Headline + 2 CTAs: Đặt sân / Tìm trận    │
├──────────────────────────────────────────┤
│  RAIL: Sân nổi bật (Featured courts)      │
│  [card][card][card][card] →scroll         │
├──────────────────────────────────────────┤
│  RAIL: Trận đang mở (Trending matches)    │
│  [card][card][card][card] →scroll         │
├──────────────────────────────────────────┤
│  RAIL: Khám phá theo môn (Shop by Sport)  │
│  [Badminton][Pickleball][Tennis]          │
└──────────────────────────────────────────┘

Option B — Hero + single unified "Match Day Rail" (signature) + shop teaser
┌──────────────────────────────────────────┐
│  HERO (as above)                          │
├──────────────────────────────────────────┤
│  MATCH DAY RAIL (signature — see below):  │
│  one scannable row mixing open courts +   │
│  open matches + relevant gear, same sport │
├──────────────────────────────────────────┤
│  Shop by Sport (3 tiles)                  │
└──────────────────────────────────────────┘
```

*Booking discovery*
```
Option A — Filter bar + grid            Option B — Map/list split (existing leaflet dep)
┌───────────────────────────┐           ┌───────────────┬─────────────┐
│ [Sport][Date][Time filter]│           │ [Filter bar]  │             │
├───────────────────────────┤           ├───────────────┤   MAP       │
│ [court][court][court]     │           │ [court list]  │  (courts)   │
│ [card ][card ][card ]     │           │ scroll        │             │
└───────────────────────────┘           └───────────────┴─────────────┘
```

*Match discovery*
```
Option A — Tab (Find/Mine) + card list        Option B — Feed with sticky filter rail
┌────────────────────────────┐                ┌──────┬─────────────────┐
│ [Tìm trận][Trận của tôi]   │                │Filter│ [match][match]  │
│ [match card][match card]   │                │ rail │ [match][match]  │
│ status/level/time at glance│                │      │ scroll           │
└────────────────────────────┘                └──────┴─────────────────┘
```

*Shop/catalog*
```
Option A — Sport tabs + minimal product grid   Option B — Rail-first (Featured/New) then grid
┌─────────────────────────────┐                ┌─────────────────────────────┐
│ [Badminton][Pickleball][Tennis]│              │ RAIL: Trang bị mới          │
├─────────────────────────────┤                ├─────────────────────────────┤
│ [img card][img card][img card]│               │ RAIL: Phù hợp với môn bạn chơi│
│ name / price, minimal chrome │                ├─────────────────────────────┤
└─────────────────────────────┘                │ Full catalog grid            │
                                                 └─────────────────────────────┘
```

**Signature element (one, justified)**: the **Match Day Rail** — a single horizontally
scrollable instrument row on the homepage (and echoed, scoped, on booking/match pages) that
reads like a stadium scoreboard: live court availability + open matches + sport-matched
gear, all in the same flat ink/paper/mono-data visual language already established by the
Apex "ticket stub" hero. This is subject-authentic (a real matchday instrument, not a
decorative banner) and reinforced by, not competing with, the existing Apex signature.

**Reference-pattern → ProSport translation** (as specified in the brief):
| Reference pattern | ProSport translation |
|---|---|
| Category navigation | Khám phá / Đặt sân / Ghép trận / Cửa hàng |
| Campaign hero | Full-width sports hero, CTAs "Đặt sân" + "Tìm trận" |
| Featured | Sân nổi bật / trải nghiệm nổi bật |
| Trending | Trận đang mở / khung giờ được đặt nhiều |
| Product rail | Trang bị mới / Phù hợp với môn bạn chơi |
| Shop by Sport | Cầu lông / Pickleball / Tennis only (real data) |

## Self-Critique (Pass 2)

- **Generic e-commerce template risk?** Rejected in favor of the "scoreboard, not
  storefront" thesis — rails are match/court/gear-specific, not generic "you might also
  like" carousels; product cards stay minimal (image + name + price), not badge-heavy.
- **Gradient/glassmorphism/shadow overuse?** Explicitly excluded — the existing flat,
  no-ambient-shadow system is kept exactly; only the *application* is extended, not the
  vocabulary.
- **Everything becomes identical cards?** Rejected — booking cards, match cards, and
  product cards each get a distinct information hierarchy (price+time / skill+roster /
  image+price), unified only by the shared token language (radius, border, type), not by
  identical layout.
- **Does the hero drive action or just look good?** The hero keeps two short, direct CTAs
  ("Đặt sân", "Tìm trận") as the primary job — already true of the existing Homepage hero;
  this spec extends that pattern rather than replacing it with a passive banner.
- **Do booking/match/shop still feel like one system?** Yes by construction — all three
  inherit the same token set, the same card radius/border rules, and the same signature
  rail pattern applied at different scopes (homepage = mixed rail, booking/match pages =
  scoped single-purpose rail).
- **Too close to Nike?** The signature (Match Day Rail) and the vocabulary (ink/paper/teal,
  Montserrat/Inter/JetBrains Mono, ticket-stub motif already shipped) are ProSport-specific
  and pre-existing in this codebase — not templated from Nike's actual layout, wordmark, or
  imagery. No Nike asset, font, or trade dress is referenced or copied.
- **What's genuinely ProSport here?** The ticket-stub/scoreboard visual metaphor, the
  bilingual Vietnamese editorial voice already present in `HomePage.jsx` copy, and the
  three-domain (court/match/gear) rail concept unique to this product's actual business.

**Change made after critique**: none required — the direction already avoids the three
generic-AI-design defaults (cream+serif+terracotta; near-black+single-neon-accent;
newspaper-hairline-broadsheet) because it inherits a real, already-differentiated system
rather than choosing a fresh default.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Unified navigation and visual foundation (Priority: P1)

A visitor or logged-in player moving between the homepage, booking, matches, and shop
should feel like one coherent product — not a set of screens built at different times with
different rules.

**Why this priority**: Foundation for every other story; the shared visual language
(colors, type, card treatment, navigation) must be consistent before individual surfaces
can be judged.

**Independent Test**: Navigate homepage → booking → matches → shop → cart in one session;
verify consistent color/type/card/button treatment and no jarring style discontinuity.

**Acceptance Scenarios**:
1. **Given** a visitor on the homepage, **When** they navigate to booking, matches, and shop, **Then** typography, color roles, card treatment, and button styles read as the same product throughout.
2. **Given** the top navigation, **When** viewed on any in-scope page, **Then** the same primary destinations (Khám phá / Đặt sân / Ghép trận / Cửa hàng) are reachable with consistent labeling and no duplicated/conflicting entries.

### User Story 2 - Homepage routes to the right action fast (Priority: P1)

A visitor should be able to get to Đặt sân, Ghép trận, or Cửa hàng within seconds of
landing, informed by real, current content (not placeholder).

**Independent Test**: Land on homepage; complete a path to each of the three core actions
in under 3 clicks/taps; confirm any rail content (courts/matches/gear) reflects real data.

**Acceptance Scenarios**:
1. **Given** the homepage, **When** a visitor wants to book a court, **Then** a clear, prominent path gets them into court discovery within one interaction.
2. **Given** the homepage's Match Day Rail (or equivalent), **When** displayed, **Then** it reflects real open courts/matches/gear from existing data — never invented content.
3. **Given** a signed-in Apex user, **When** they land on the homepage or their dashboard, **Then** the experience remains recognizably the same system as the public homepage.

### User Story 3 - Court discovery and booking is clear on mobile (Priority: P1)

A player finding and booking a court on a phone should understand availability, price, and
next steps without confusion or layout breakage.

**Independent Test**: On a 390px-wide viewport, complete court search → time selection →
booking summary; confirm no horizontal overflow and all controls are reachable/tappable.

**Acceptance Scenarios**:
1. **Given** the booking discovery screen, **When** viewed at 390px width, **Then** filters, court cards, and time-slot selection remain usable with no horizontal scroll and touch targets ≥ 44×44px.
2. **Given** a selected court and time, **When** the booking summary is shown, **Then** price and chosen slot are unambiguous before confirmation.

### User Story 4 - Match discovery, creation, and joining is easy to scan (Priority: P2)

A player should be able to scan open matches for sport/level/time at a glance, and create
or join a match with minimal friction.

**Independent Test**: Browse open matches, filter by sport, open a match's detail, and
complete the join (or create) action.

**Acceptance Scenarios**:
1. **Given** a list of open matches, **When** scanned, **Then** sport, skill/level, and time are legible at a glance per card without opening detail.
2. **Given** the create-match flow, **When** completed, **Then** each step's purpose and required input are unambiguous.

### User Story 5 - Shop, product detail, cart, and checkout feel like one flow (Priority: P2)

A player buying gear should move from catalog to product detail to cart to checkout with a
consistent, minimal, image-led presentation and no jarring style shifts between steps.

**Independent Test**: Browse catalog filtered by sport, open a product, add to cart,
proceed to checkout; confirm consistent card/button/type treatment throughout.

**Acceptance Scenarios**:
1. **Given** the catalog, **When** filtered by sport (Badminton/Pickleball/Tennis — only sports the system actually supports), **Then** results update to matching products with a minimal, image-forward card.
2. **Given** an item in cart, **When** proceeding through checkout, **Then** pricing and totals remain clear and consistent in presentation with the catalog/detail pages.

### User Story 6 - Responsive, accessible, and resilient across states (Priority: P1)

Every in-scope surface must work at common breakpoints, respect accessibility basics, and
handle loading/empty/error states gracefully.

**Independent Test**: Resize through 1440/1024/768/390px on each in-scope page; trigger
empty and error states; navigate by keyboard only; enable `prefers-reduced-motion`.

**Acceptance Scenarios**:
1. **Given** any in-scope page, **When** viewed at 1440px, 1024px, 768px, or 390px, **Then** no horizontal overflow occurs and content remains usable.
2. **Given** a loading, empty, or error condition on any in-scope page, **Then** the state clearly communicates what happened and, for empty/error, what to do next.
3. **Given** keyboard-only navigation, **When** moving through interactive elements, **Then** focus is always visible.
4. **Given** `prefers-reduced-motion` is enabled, **When** any animated element would normally move, **Then** it does not animate.

### Edge Cases

- Court, match, or product rails with zero current results must show a direct, actionable
  empty state (not a blank gap) — e.g. "no matches now → create one" rather than nothing.
- Sports shown in "Shop by Sport" / filters must be driven by what the API/data actually
  returns; if a sport has no current inventory, it is not fabricated to fill a rail.
- Product/court photography gaps: use a consistent fallback treatment (not a broken image)
  and, where a real content need can't be met by existing assets, produce a shot-list
  (subject, angle, crop) rather than substituting stock imagery that isn't already in the
  project or inventing Nike-sourced imagery.
- `MatchProLayout.css` (dead, unimported) must not be silently revived by accidentally
  importing it while touching MatchPro pages.
- Any change to shared primitives consumed outside this scope (e.g. a component also used
  by Owner/Admin/Elite) must preserve their current visual behavior — verified by loading
  at least one out-of-scope page as a regression spot-check, not by assumption.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage, navigation, footer, booking, match, and shop surfaces MUST present a single, coherent visual identity (consistent color roles, typography, card and button treatment) — no surface may read as a different, disconnected product.
- **FR-002**: The homepage MUST provide an unambiguous, fast path to each of: booking a court, finding/joining a match, and browsing the shop.
- **FR-003**: Any "featured/trending/rail" content on the homepage or elsewhere MUST be sourced from real existing data (courts, matches, products) — never fabricated placeholder content, and never sports the system does not actually support.
- **FR-004**: Court discovery and the booking flow MUST remain fully usable (no overflow, all controls reachable) at mobile widths down to 390px.
- **FR-005**: Match discovery cards MUST make sport, skill/level, and time scannable without opening a detail view.
- **FR-006**: The shop catalog, product detail, cart, and checkout MUST present a consistent, minimal, image-led product treatment throughout the flow.
- **FR-007**: All in-scope pages MUST remain responsive and overflow-free at 1440px, 1024px, 768px, and 390px.
- **FR-008**: All in-scope interactive elements MUST have a visible keyboard focus state and a touch target of at least 44×44px.
- **FR-009**: All in-scope pages MUST present clear loading, empty, and error states, with empty/error states telling the user what happened and what to do next.
- **FR-010**: Any animation introduced MUST respect `prefers-reduced-motion` and MUST NOT be the primary means of conveying information.
- **FR-011**: No business logic, API contract, route behavior, authentication, or payment logic may change as a result of this visual redesign.
- **FR-012**: No Nike logo, wordmark, proprietary font, copy, product imagery, or pixel-level layout/trade dress may be used or approximated.

### Key Entities *(content/domain, not data-model changes)*

- **Court**: a bookable venue/surface for a specific sport (Badminton/Pickleball/Tennis today), with availability and price — the subject of the booking discovery flow.
- **Match**: an open or scheduled game with a sport, skill/level, time, and roster — the subject of match discovery/create/join.
- **Product (Gear)**: sport-specific equipment/apparel with an image, name, and price — the subject of the shop/catalog/cart/checkout flow.
- **Sport**: the taxonomy (Badminton/Pickleball/Tennis, as currently supported by the system) used to scope "Shop by Sport" and match/court filters — must reflect real supported sports only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify and start all three core actions (book a court, find a match, browse gear) within 3 clicks/taps of landing on the homepage, in a usability walkthrough.
- **SC-002**: 100% of in-scope pages render with no horizontal overflow at 1440px, 1024px, 768px, and 390px viewport widths.
- **SC-003**: 100% of in-scope pages use the established token vocabulary (no hardcoded off-brand colors, no soft ambient shadows at rest, no stray `rounded-full` pill treatment outside genuinely circular elements like avatars) — verified by a zero-hardcoded-hit sweep equivalent to the audit method used in this spec.
- **SC-004**: A person can complete the court-booking, match-join, and shop-checkout journeys via keyboard alone, with focus always visible.
- **SC-005**: The existing automated frontend test suite passes with 0 regressions after implementation.
- **SC-006**: A person using a screen reader or `prefers-reduced-motion` setting encounters no motion-only information and no un-labelled interactive controls on any in-scope page.

## Assumptions

- **Source of truth for design tokens**: `src/frontend/src/index.css` plus the already-
  correct live pages, NOT `docs/ui/design-system-spec.md` / `ui-audit.md` /
  `remediation-plan.md` / `market-benchmark.md`, which describe an abandoned, contradictory
  direction (different ink hex, soft-shadow tokens, large radii, nonexistent
  `BaseButton`/`BaseTable`/`BaseCard` components). **Flagged for explicit human
  confirmation** before Plan proceeds — if this assumption is wrong, Plan must be redone
  against the docs instead.
- **`MatchProLayout.css`** stays as dead/unimported code for this feature (not deleted, not
  revived) — removing an orphaned file is a separate, low-risk cleanup that can be called
  out as a follow-up rather than bundled into a visual-identity feature.
- **Sports scope**: Badminton, Pickleball, Tennis are the sports with real data support
  today per existing pages/API usage; "Shop by Sport" and similar rails are scoped to
  whatever the data actually returns, which may be a subset of these three at any given
  time.
- **Imagery**: existing stock photography patterns already used in `HomePage.jsx` (Unsplash-
  sourced court/venue photography) may continue to be used for court/venue imagery in the
  same spirit; product photography needs are assessed in Plan, with a shot-list produced
  for any gap rather than substituting Nike-sourced or unlicensed imagery.
- **Component reuse**: existing shared primitives (e.g. `EmptyState`, `StatusBadge`,
  `BookingCard`, `.btn-primary`/`.btn-outline`, `.card-base`, `ticket-divider`) are reused
  and extended where they fit, per the brief's preference for shared components over broad
  rewrites; new shared components are introduced only where no reasonable existing one fits.
- **Out of scope confirmed**: `/admin/*`, `/owner/*`, `/elite/*`, and all backend/API/
  business-rule/auth/payment logic are excluded from this feature. Any touch to a file
  shared with those surfaces is limited to what's required to avoid regressing them, and is
  called out explicitly before being made.
