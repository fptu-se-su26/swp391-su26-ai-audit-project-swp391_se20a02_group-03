# Implementation Plan: ProSport Editorial Experience

**Branch**: `007-prosport-editorial-experience` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-prosport-editorial-experience/spec.md`
(APPROVE SPEC received)

## Summary

Extend the already-proven "editorial sports brutalism" identity (ink `#0d1b2a` / paper
`#f3f2ee` / teal `#14b8a6`, flat 2px-radius data objects, 8px-radius actions, no ambient
shadow at rest) from `HomePage.jsx` / `Navbar.jsx` / `Footer.jsx` / the already-remediated
`ApexHomePage.jsx` into the remaining Customer/Public surfaces: booking discovery, match
discovery/create/detail, and the gear shop. Introduce three shared, image-led card
components (`CourtCard`, `MatchCard`, `ProductCard`) to replace per-page duplicated card
markup, and one signature rail component (`MatchDayRail`) for the homepage and scoped reuse
on booking/match pages. Visual/content-structure work only — no API, route, auth, or
payment logic changes.

## Final Design Direction (confirmed, no changes since spec)

- **Source of truth**: `src/frontend/src/index.css` `@theme` tokens + already-correct live
  pages. `docs/ui/design-system-spec.md` / `ui-audit.md` / `remediation-plan.md` /
  `market-benchmark.md` are treated as **superseded** — approved by human in the SPEC gate.
- **Visual thesis**: "ProSport is a scoreboard, not a storefront" — courts/matches/gear
  presented as match-day instrumentation, not lifestyle merchandising.
- **Signature**: **Match Day Rail** — one horizontally-scrollable ink/paper/mono rail
  mixing real open courts, open matches, and sport-matched gear; homepage gets the full
  mixed rail, booking/match pages get a scoped single-purpose echo of the same visual
  pattern (not a second competing signature).
- **Card family differentiation** (same token vocabulary, different information hierarchy):
  - `CourtCard`: image + name + price/hour + availability badge (data-dense, price is the number that matters).
  - `MatchCard`: sport + skill/level + time + roster count, minimal/no image (people/time-dense, not photo-dense).
  - `ProductCard`: image-forward + name + price only (minimal chrome, per brief's "tối giản, tập trung vào hình ảnh").

## Token Decisions & Source of Truth

No new tokens. Reused as-is from `index.css`:

| Role | Token | Existing CSS hook |
|---|---|---|
| Ink | `#0d1b2a` | `bg-ink`, `text-foreground` (dark theme), `--color-ink` |
| Paper | `#f3f2ee` | `bg-paper`, `--color-paper` |
| Accent | `#14b8a6` | `bg-accent`, `text-accent`, `border-accent` |
| Warning / Danger | `#b26a00` / `#b23b3b` | `text-warning`, `text-danger` |
| Display type | Montserrat 800/900 uppercase | `font-heading` |
| Body type | Inter | `font-sans` |
| Data/eyebrow type | JetBrains Mono uppercase 0.18em | `label-mono` |
| Data-object radius | 2px, hard border, no ambient shadow at rest | `rounded-[2px] border-2 border-border-strong` |
| Action radius | 8px | `.btn-primary`, `.btn-outline`, `.input-base` |
| Hover lift | existing | `.card-lift` (verify usage), `.img-zoom` (image hover), `.btn-primary:hover` translateY+glow |
| Signature motif reuse | ticket-stub perforation | `.ticket-divider` (already shipped for Apex hero; reused at smaller scale inside `MatchDayRail` court/match cells only if it earns its place — see Complexity Tracking) |

`docs/ui/*.md` remain on disk, unedited (out of scope to rewrite historical docs) — noted
as superseded in this plan and the spec; a documentation-cleanup follow-up can retire them
later, outside this feature.

## Component Reuse / Refactor Matrix

| Component | Action | Rationale |
|---|---|---|
| `components/ui/EmptyState.jsx` | **Reuse as-is** | Already on-brand; used across Apex/matches/gear/mobile/shop already — extend usage into booking/match/shop pages still missing it. |
| `components/ui/StatusBadge.jsx` | **Reuse as-is** | Already on-brand, already covers all 8 booking states (fixed this session). |
| `components/ui/BookingCard.jsx` | **Reuse as-is** | Already on-brand (ticket-adjacent flat card); template/reference for the new `CourtCard`'s date-block treatment where relevant. |
| `components/ui/MatchInvitationCard.jsx` | **Reuse as-is** (invite-specific) | Already on-brand; NOT merged into the new generic `MatchCard` (different action set: Join/Decline vs. View/Join) — kept as its own narrow component per existing pattern. |
| `components/ui/SearchBar.jsx`, `PageLoader.jsx`, `ProfileDropdown.jsx`, `NotificationMenu.jsx` | **Reuse as-is** | Already shared, no styling debt found. |
| `.btn-primary` / `.btn-outline` / `.card-base` / `.input-base` / `.label-mono` (CSS) | **Reuse as-is** | Core vocabulary, no changes. |
| **`components/ui/CourtCard.jsx`** | **NEW** | No shared court card exists — `ApexBookingPage.jsx` currently inlines its own court markup (75 hardcode hits). Replaces duplicated per-page markup. |
| **`components/ui/MatchCard.jsx`** | **NEW** | No shared browse-match card exists — `ApexMatchesPage.jsx`/`MatchProFeedPage.jsx` each inline their own (71 + 39 hardcode hits). |
| **`components/ui/ProductCard.jsx`** | **NEW** | No shared product card exists — `GearCatalogPage.jsx` inlines its own (30 hardcode hits); `ApexShopPage.jsx` duplicates a similar pattern again (55 hits). |
| **`components/home/MatchDayRail.jsx`** | **NEW (signature)** | The one new, purpose-built component for the homepage signature; internally composes `CourtCard`/`MatchCard`/`ProductCard` in a horizontally-scrollable rail — not a fourth competing card style. |

No new npm dependency. No changes to `AuthContext`, `CartContext`, or any API client file.

## Exact File Paths

### New files
```text
src/frontend/src/components/ui/CourtCard.jsx
src/frontend/src/components/ui/ProductCard.jsx
src/frontend/src/components/ui/MatchCard.jsx
src/frontend/src/components/home/MatchDayRail.jsx
```

### Modified files (visual/content-structure only)
```text
src/frontend/src/pages/HomePage.jsx                  # insert MatchDayRail + Shop-by-Sport rail into existing hero page
src/frontend/src/components/Navbar.jsx                # verify/dedupe nav entries (e.g. /matches/nearby dual-listing)
src/frontend/src/pages/apex/ApexBookingPage.jsx        # adopt CourtCard, remove inline hardcoded card markup
src/frontend/src/pages/apex/ApexMatchesPage.jsx        # adopt MatchCard
src/frontend/src/pages/apex/ApexShopPage.jsx           # adopt ProductCard
src/frontend/src/pages/gear/GearCatalogPage.jsx        # adopt ProductCard
src/frontend/src/pages/gear/GearDetailPage.jsx         # token restyle (no shared card — single-item detail)
src/frontend/src/pages/gear/CartPage.jsx               # token restyle
src/frontend/src/pages/gear/CartCheckoutPage.jsx       # token restyle
src/frontend/src/pages/matches/CreateMatchPage.jsx     # token restyle
src/frontend/src/pages/matches/MatchDetailPage.jsx     # spot-check only (already 0 hardcode hits) — no changes expected
src/frontend/src/pages/matchpro/MatchProFeedPage.jsx   # adopt MatchCard
```

### Explicitly not touched
```text
src/layouts/MatchProLayout.css     # stays dead/unimported (spec Assumption) — do not import, do not delete
src/pages/admin/**, src/pages/owner/**, src/pages/elite/**
Any API client, context provider, route definition, auth/payment logic
docs/ui/*.md                        # flagged superseded, not rewritten in this feature
```

## Rollout (Batches)

1. **Foundation**: build `CourtCard`, `MatchCard`, `ProductCard`, `MatchDayRail` in isolation (no page wiring yet); lint + a lightweight render smoke test each.
2. **Homepage/navigation pilot**: wire `MatchDayRail` + Shop-by-Sport into `HomePage.jsx`; verify Navbar consistency. This is the highest-visibility, lowest-risk batch (marketing page, no auth-gated logic) — validates the signature before touching transactional flows.
3. **Booking**: `ApexBookingPage.jsx` adopts `CourtCard`; mobile-width pass (FR-004).
4. **Match**: `ApexMatchesPage.jsx` + `MatchProFeedPage.jsx` adopt `MatchCard`; `CreateMatchPage.jsx` token restyle; `MatchDetailPage.jsx` spot-check.
5. **Shop**: `ApexShopPage.jsx` + `GearCatalogPage.jsx` adopt `ProductCard`; `GearDetailPage.jsx` / `CartPage.jsx` / `CartCheckoutPage.jsx` token restyle.
6. **Cross-cutting polish**: full responsive sweep (1440/1024/768/390), a11y focus-state audit, reduced-motion check, regression spot-check of one out-of-scope page per layout family (Owner, Admin) to confirm no shared-file bleed.

Each batch ends with: lint → relevant existing tests → live browser check (desktop +
mobile) → screenshot + self-critique → fix before moving on (per the mandated Batch
verification loop in Implementation).

## Risks & Rollback

| Risk | Mitigation |
|---|---|
| New `CourtCard`/`MatchCard`/`ProductCard` used by a page outside this feature's scope in the future in a way that assumes different props | Keep prop contracts intentionally minimal and documented in each component's top comment; no defensive over-engineering beyond current call sites. |
| `Navbar.jsx`/`Footer.jsx` are shared across ALL surfaces including Admin/Owner (public shell) | Changes here limited to content/dedupe, not structural rewrite; verify one Admin and one Owner page still render correctly after any Navbar/Footer touch. |
| Booking/match/shop pages carry real business logic (fetch, filters, cart, checkout) interleaved with the markup being restyled | Every page edit changes only JSX/className, never the surrounding state/handlers/API calls — same discipline already proven safe on `ApexHomePage.jsx`/`ApexBookingsPage.jsx`/all 8 Admin pages this session (0 regressions each time). |
| Mobile overflow regressions (390px) | Measure `document.documentElement.scrollWidth` vs `clientWidth` after navigation (not immediately after resize — a false-positive trap already hit and resolved earlier this session) on every batch. |
| Scope creep into Admin/Owner/Elite | Batch 6 regression spot-check is the explicit guard; no file under those paths is edited unless a shared file requires it, and any such touch is called out before being made (per spec Assumptions). |

**Rollback**: each batch is a small, reviewable diff on top of a git working tree with no
other uncommitted conflicting work (confirmed via `git status` at spec time); reverting a
batch is a targeted `git checkout -- <files>` on that batch's file list if a regression is
found, without needing to touch other batches.

## Responsive / Accessibility Plan

- Breakpoints tested: **1440px, 1024px, 768px, 390px** (exact matrix requested).
- Touch targets ≥ 44×44px on all new interactive card/rail elements.
- Keyboard focus: rely on the existing global `:focus-visible` rule in `index.css`
  (`outline: 2px solid var(--color-accent)`) — already covers new elements automatically;
  verified per batch by tabbing through, not just visual inspection.
- Horizontal-scroll rails (`MatchDayRail`, any card carousel) get a keyboard-operable
  scroll affordance (native scroll + arrow buttons, not swipe-only) so keyboard users are
  not locked out of rail content.
- Contrast: all new text/icon colors reuse existing token pairs already verified against
  paper/ink (no new color combinations introduced).

## Motion / Reduced-Motion Plan

- New motion is limited to: (a) reveal-on-scroll for rail sections on the homepage,
  reusing the existing GSAP + `ScrollTrigger` pattern already in `HomePage.jsx` (no new
  animation library), (b) `.img-zoom`/`.card-lift` hover states already defined in
  `index.css` applied to the new cards.
- All GSAP triggers wrapped in the same `window.matchMedia('(prefers-reduced-motion: reduce)')`
  guard `HomePage.jsx` already uses — extended to any new animated block, not reinvented.
- No motion is the sole carrier of information (FR-010) — e.g. rail order/content is
  identical whether or not entrance animation plays.

## Asset Strategy

- Court/venue photography: continue the existing Unsplash-sourced pattern already used in
  `HomePage.jsx`'s `facilities` array — same licensing posture, no new source introduced.
- Product photography: audit real product/equipment data first in Batch 5 (Shop) for
  existing image URLs from the API; where a product lacks usable imagery, fall back to a
  single consistent flat placeholder treatment (ink-bordered icon block, matching the
  `EmptyState`/`AdminCard` icon-square language) rather than inventing photography.
- No Nike-sourced or Nike-hosted asset is fetched, linked, or hotlinked at any point.
- If, during implementation, a genuine photography gap is found that a placeholder can't
  reasonably cover (e.g. the hero needs a new sport not yet depicted), a short shot-list
  (subject, angle, crop ratio) is produced and reported — not filled with stock guesswork.

## Browser Screenshot Matrix

Captured per batch (where the Browser tool is available) at:

| Viewport | Width | Purpose |
|---|---|---|
| Desktop | 1440px | primary design reference |
| Laptop/tablet landscape | 1024px | rail wrapping, sidebar-adjacent layouts |
| Tablet | 768px | 2-column → stacking transition |
| Mobile | 390px | FR-004/FR-007 overflow + touch-target check |

Each screenshot is followed by an explicit self-critique note (per `frontend-design`
skill's "critique your own work" step) before the batch is marked done.

## Regression-Test Strategy

- `npm test` (Vitest) after every batch — existing suite (71 tests / 17 files as of this
  session) is the guard; 0 regressions required to proceed to the next batch.
- `npm run lint` after every file touched.
- `npm run build` at the end of the full feature (catches anything Vitest/ESLint miss,
  e.g. unused-import build warnings).
- `npm run doctor` (react-doctor) once at the end, as requested.
- `dotnet test src/backend/ProSport.sln` — run once as a sanity check even though this
  feature makes no backend changes, since FR-011 requires zero business-logic impact and
  this is cheap insurance (backend test suite already green at session start).
- Manual smoke tests (7 flows listed in the user's brief) executed at the end of
  Batch 6, using the already-running dev servers and known seed accounts
  (`customer1@prosport.vn`) from this session.

## Constitution Check

*Re-checked post-design.* Project constitution remains the unratified template (no
project-specific gates). Applying the same defaults used for every prior feature this
session:
- **Reuse over invention**: 3 new components are justified by a measured absence (no
  shared card existed; each page reinvented one) — not scope creep. ✅
- **No unjustified complexity**: `MatchDayRail` composes the 3 cards rather than defining
  a 4th visual language. ✅
- **No prop-API breakage**: no existing component's public interface changes. ✅
- **Regression safety**: existing 71-test suite + lint + build + backend sanity test all
  gate every batch. ✅

**Result**: PASS. No entries required in Complexity Tracking.

## Complexity Tracking

> No constitution violations. One judgment call flagged for visibility, not because it
> violates a rule: whether `MatchDayRail` reuses `.ticket-divider` (the Apex signature
> perforation motif) at a smaller scale, or intentionally uses a plainer divider to avoid
> two signatures competing per the Pass 2 self-critique. **Decision**: plainer divider
> inside `MatchDayRail` cells; `.ticket-divider` stays uniquely Apex's "next game" hero
> so the homepage signature reads as its own moment, not a diluted echo.

## Project Structure

### Documentation (this feature)
```text
specs/007-prosport-editorial-experience/
├── spec.md              # already approved
├── plan.md              # this file
├── tasks.md             # /speckit-tasks output (next gate)
└── checklists/
    └── requirements.md
```
`research.md` / `data-model.md` / `contracts/` remain **not applicable** — no technical
unknowns beyond what this plan already resolves, no data model change, no API contract
change for a frontend visual/content-structure feature.
