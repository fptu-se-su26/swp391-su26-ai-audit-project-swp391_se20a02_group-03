# Tasks: ProSport Editorial Experience

**Feature dir**: `specs/007-prosport-editorial-experience/` · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

**Tech**: React 18 / Tailwind v4 / GSAP (existing). Visual/content-structure only — no
route, auth, API, payment, or business-logic changes; the set of sports the project
supports is not changed. No new npm dependency. Existing Vitest suite is the regression
guard. Paths repo-relative under `src/frontend/src/`.

## Phase 1: Foundation — shared card components (Priority: P1) 🎯 blocks all page batches

- [X] T001 [US1] Create `components/ui/CourtCard.jsx` — image + name + price/hour + availability `StatusBadge`, flat `rounded-[2px] border-2 border-border-strong`, `.img-zoom` hover, min props: `court`, `onClick`/`href`. No fetch/state inside — pure presentational.
- [X] T002 [US1] Create `components/ui/MatchCard.jsx` — sport + skill/level `label-mono` badge + time + roster count (people/time-dense, minimal/no image), flat card, same token vocabulary as `MatchInvitationCard.jsx` but generic View/Join action set (not Join/Decline).
- [X] T003 [US1] Create `components/ui/ProductCard.jsx` — image-forward + name + price only, minimal chrome, `.img-zoom` hover, placeholder block (ink-bordered icon square) when `product.imageUrl` is missing.
- [X] T004 [US1] Create `components/home/MatchDayRail.jsx` — horizontally-scrollable rail composing `CourtCard`/`MatchCard`/`ProductCard`, keyboard-operable scroll (arrow buttons + native scroll, not swipe-only), plain (non-ticket-stub) divider between cells per plan's Complexity Tracking decision.
- [X] T005 [US1] Lint + minimal render smoke check for T001–T004 (mount each with representative real-shaped data, e.g. from an existing page's fetched sample) — no dedicated new test files required beyond what existing suites already cover via page integration in later phases.

**Checkpoint**: 4 new components exist, compile, lint-clean, not yet wired into any page — zero risk to running app so far.

## Phase 2: User Story 2 — Homepage & navigation pilot (Priority: P2)

- [X] T006 [US2] `pages/HomePage.jsx` — insert `MatchDayRail` (mixed courts + open matches + sport-matched gear, real fetched/existing data only) as the signature moment; keep existing hero/facilities sections and their GSAP entrance pattern intact, extend the same `prefers-reduced-motion` guard to the new rail's entrance.
- [X] T007 [US2] `components/Navbar.jsx` — token/consistency pass only: dedupe or clarify any redundant nav entries (e.g. `/matches` vs `/matches/nearby` both listed), no route changes, no removal of any sport-related link.
- [X] T008 [US2] `components/Footer.jsx` — spot-check only; already on-brand per audit, fix only if a genuine hardcoded-class regression is found during this pass.

**Checkpoint**: homepage carries the new signature; nav/footer verified consistent. Highest-visibility, lowest-risk batch — validates the direction before touching transactional flows.

## Phase 3: User Story 3 — Booking discovery (Priority: P3)

- [X] T009 [US3] `pages/apex/ApexBookingPage.jsx` — replace inline court-card markup (line ~44, 75 hardcode hits) with `CourtCard`; preserve all existing filter/search/booking-flow state and handlers unchanged.
- [X] T010 [US3] `pages/apex/ApexBookingPage.jsx` — mobile-width (390px) clarity pass on filters/list layout (FR-004), no functional change.

**Checkpoint**: booking discovery reads visually consistent with homepage; booking creation flow itself untouched and still works.

## Phase 4: User Story 4 — Match discovery & creation (Priority: P4)

- [X] T011 [US4] `pages/apex/ApexMatchesPage.jsx` — replace inline match-card markup (line ~219, 71 hardcode hits) with `MatchCard`.
- [X] T012 [US4] `pages/matchpro/MatchProFeedPage.jsx` — replace inline match-card markup (39 hardcode hits) with `MatchCard`.
- [X] T013 [US4] `pages/matches/CreateMatchPage.jsx` — token restyle only (59 hardcode hits: form inputs → `.input-base`, buttons → `.btn-primary`/`.btn-outline`), all sport-selection options and form fields/validation logic unchanged.
- [X] T014 [US4] `pages/matches/MatchDetailPage.jsx` — spot-check only (0 hardcode hits found in audit); confirm still on-brand, no changes expected.

**Checkpoint**: match browse/create/detail all read as one family; sport list and creation logic identical to before.

## Phase 5: User Story 5 — Shop, cart & checkout (Priority: P5)

- [X] T015 [US5] `pages/apex/ApexShopPage.jsx` — replace inline product markup (55 hardcode hits) with `ProductCard`.
- [X] T016 [US5] `pages/gear/GearCatalogPage.jsx` — replace inline product markup (30 hardcode hits) with `ProductCard`.
- [X] T017 [US5] `pages/gear/GearDetailPage.jsx` — token restyle only (22 hardcode hits), single-item detail layout, no `ProductCard` (not a list context).
- [X] T018 [US5] `pages/gear/CartPage.jsx` — token restyle only (36 hardcode hits), cart line items/quantity/remove logic unchanged.
- [X] T019 [US5] `pages/gear/CartCheckoutPage.jsx` — token restyle only (27 hardcode hits); explicitly **no** change to payment/response-handling logic even if `docs/ui/remediation-plan.md`'s "Batch 1.5 hotfix" note is still relevant — any such logic bug is out of scope for this visual feature and must be reported separately, not bundled here.

**Checkpoint**: shop/cart/checkout visually consistent; cart/checkout/payment behavior byte-for-byte unchanged.

## Phase 6: User Story 6 — Cross-cutting responsive/a11y/regression polish (Priority: P6)

- [X] T020 [US6] Full responsive sweep of all touched pages at 1440/1024/768/390px; fix any overflow/wrapping issue found (visual only).
- [X] T021 [US6] Keyboard focus-visible + touch-target (≥44×44px) audit across all new components and touched pages.
- [X] T022 [US6] Reduced-motion audit: verify every new/extended GSAP trigger respects `prefers-reduced-motion` and that content/order is identical with motion off.
- [X] T023 [US6] Regression spot-check: load one Admin page and one Owner page after all Navbar/Footer/shared-component touches — confirm zero visual/behavioral bleed outside scope.
- [X] T024 Run `npx eslint` on every changed/new file — 0 errors/warnings.
- [X] T025 Run `npx vitest run` (full suite) — 0 regressions.
- [X] T026 Run `npm run build` — clean build, no new warnings.
- [X] T027 Run `npm run doctor` (react-doctor) — review output.
- [X] T028 Run `dotnet test src/backend/ProSport.sln` — sanity check, expect unchanged (no backend edits this feature).
- [X] T029 Manual smoke test (seed accounts, running dev servers): 7 flows — browse home → view court → start booking; browse/filter matches → open detail; create a match (verify full existing sport list still offered) → confirm; browse shop → add to cart → checkout screen loads; mobile (390px) nav + booking + shop pass with no horizontal scroll; keyboard-only pass through homepage rail and one card grid; verify Admin/Owner unaffected.
- [X] T030 Compile final report per governing brief: changed files, before/after rationale per batch, smoke-tested flows, test results, screenshots (where captured), limitations, explicit confirmation of zero business-logic/API/scope/sport-list changes.

---

## Dependencies & order

- **Phase 1 (T001–T005)** is a hard prerequisite for every page batch — build and lint the 4 shared components before any page adopts them.
- **Phase 2 (T006–T008)** should land next: lowest-risk, highest-visibility, validates the signature direction live before touching transactional flows.
- **Phase 3 → 4 → 5** each depend only on Phase 1, not on each other — could be reordered, but sequential batching (per plan's rollout) keeps each verification loop small and reviewable.
- **Phase 6 (T020–T030)** runs last, after all restyling batches are individually verified.

## Implementation strategy

- **MVP-equivalent** = Phase 1 + Phase 2: the new shared components exist and the homepage carries the signature — the direction is provable end-to-end before wider rollout.
- Each phase/batch ends with: lint → relevant Vitest run → live browser check (desktop + mobile) → screenshot + self-critique → at least one fix round before marking tasks `[X]`, per the mandated batch loop.
- Total: **30 tasks** (Foundation: 5, Homepage/Nav: 3, Booking: 2, Match: 4, Shop: 5, Polish/regression: 11).
- **Hard constraint restated per user's approval message**: UI/visual/content-structure only. No change to app behavior, feature scope, or the set of sports the project supports (Badminton/Pickleball/Tennis per real data) at any task above.
