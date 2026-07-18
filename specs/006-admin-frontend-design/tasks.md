# Tasks: Admin Portal Visual Redesign

**Feature dir**: `specs/006-admin-frontend-design/` · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

**Tech**: React 18 / Tailwind v4 / recharts. Visual/styling only — no logic changes, no
test changes required (existing suite is the regression guard). Paths repo-relative under
`src/frontend/src/`.

## Phase 1: User Story 1 — Shared shell + UI kit (Priority: P1) 🎯 MVP

- [x] T001 [US1] Restyle `layouts/AdminLayout.jsx`: page background, topbar (`bg-white border-gray-200` → tokens), icon-button hovers (`hover:bg-teal-50` → flat token hover), quick-action button → `.btn-primary`, sidebar ink color → `bg-ink` token, user card avatar treatment. Keep all existing behavior (mobile drawer, Escape key, inert/aria-hidden) unchanged.
- [x] T002 [US1] Restyle `components/admin/index.jsx` — `AdminPageHeader`: token text colors.
- [x] T003 [US1] Restyle `AdminCard`: flat `rounded-[2px]` / `border-2 border-border-strong` / no ambient shadow, replacing `rounded-[12px] shadow-[...]`.
- [x] T004 [US1] Restyle `AdminBtn` (all 4 variants): route through `.btn-primary`/`.btn-outline` equivalents, `rounded-[8px]` kept (button radius), remove hardcoded hex, danger variant uses `bg-danger` token.
- [x] T005 [US1] Restyle `AdminStatusBadge` + its `BADGE_VARIANTS` map: flat `rounded-[2px]` mono badges (mirror the already-fixed customer-facing `StatusBadge.jsx` pattern) instead of `rounded-full` pastel pills.
- [x] T006 [US1] Restyle `AdminToolbar`, `AdminSearchInput`, `AdminFilterPills`: flat segmented filter control (mirror the already-fixed `ApexBookingsPage` filter pattern) instead of floating pill bar; search input to token borders/focus ring.
- [x] T007 [US1] Restyle `AdminTable`/`AdminThead`/`AdminTh`/`AdminTd`: flat table borders, mono uppercase header cells using `label-mono`-style treatment.
- [x] T008 [US1] Restyle `AdminModal`: flat `rounded-[2px]` dialog, ink header rule instead of soft shadow-heavy white card; preserve focus-trap/ARIA/Escape logic untouched.
- [x] T009 [US1] Restyle `AdminFormField` + `adminInputCls`: token-based label/input treatment matching `.input-base`.
- [x] T010 [US1] Restyle `AdminPagination`: flat page-number chip instead of `rounded-full` bubble.
- [x] T011 [US1] Restyle `AdminEmptyState`/`AdminErrorState`/`AdminTableSkeleton`/`AdminTableLoader`: token colors, flat icon containers (mirror the already-fixed shared `EmptyState.jsx`).

**Checkpoint**: build the frontend and load any 2 admin pages — shell + every primitive reads as one coherent, flat, ink/paper/teal system.

## Phase 2: User Story 2 — Dashboard flagship (Priority: P2)

- [x] T012 [US2] Restyle `pages/admin/AdminDashboardPage.jsx` stat cards: flat treatment, one considered focal card (reuse the `dark`/ink-block idea already flagged in the existing `cards` data) instead of four visually identical tiles.
- [x] T013 [US2] Re-theme the revenue `BarChart` (recharts): axis/gridline/tooltip colors from token hex values (accent teal bar, ink text, paper tooltip bg) instead of library default grays.
- [x] T014 [US2] Re-theme the court-occupancy `PieChart` (recharts): `COURT_STATUS_COLORS` already token-adjacent — verify/align exact hex to `index.css` tokens; tooltip/legend restyled to match.
- [x] T015 [US2] Restyle the "Hoạt động gần đây" (recent activity) list: token dividers/text colors.

**Checkpoint**: Dashboard loads with real data and reads as a command-center, not a chart-library demo.

## Phase 3: User Story 3 — Per-page spot fixes (Priority: P3)

- [x] T016 [P] [US3] `AdminBookingsPage.jsx` — replace remaining hardcoded classes (12 hits) with tokens.
- [x] T017 [P] [US3] `AdminUsersPage.jsx` — replace remaining hardcoded classes (8 hits), including avatar/role-badge treatment.
- [x] T018 [P] [US3] `AdminCourtsPage.jsx` — replace remaining hardcoded classes (10 hits).
- [x] T019 [P] [US3] `AdminKycPage.jsx` — replace remaining hardcoded classes (23 hits, largest page); verify KYC status color semantics stay correct (Rejected = danger, etc.) per Edge Cases.
- [x] T020 [P] [US3] `AdminComplaintsPage.jsx` — replace remaining hardcoded classes (20 hits).
- [x] T021 [P] [US3] `AdminPricingPage.jsx` — replace remaining hardcoded classes (8 hits).
- [x] T022 [P] [US3] `AdminInventoryPage.jsx` — replace remaining hardcoded classes (10 hits).

**Checkpoint**: no page has leftover generic-SaaS styling outside the (now on-brand) shared kit.

## Phase 4: Polish

- [x] T023 Run `npx eslint` on every changed file — 0 errors/warnings.
- [x] T024 Run the full frontend test suite (`npx vitest run`) — 0 regressions (SC-003), paying particular attention to `AdminUsersPage.test.jsx`, `AdminCourtsPage.test.jsx`, `AdminKycPage.test.jsx`.
- [x] T025 Live-verify in the running app (logged in as admin): load all 8 pages, check console for errors (SC-002), resize to mobile width and confirm no horizontal overflow (SC-001/FR-007), exercise at least one modal + one filter interaction to confirm behavior is unchanged.

---

## Dependencies & order
- **US1 (T001–T011)** is the MVP and a hard prerequisite for US2/US3 in spirit (though
  technically independent files) — do it first so later visual judgment calls are made
  against the *new* kit, not the old one.
- **US2 (T012–T015)** touches only `AdminDashboardPage.jsx` — independent of US3.
- **US3 (T016–T022)** — each page is an independent file; parallelizable `[P]`.
- **Polish (T023–T025)** last, after all restyling.

## Implementation strategy
- **MVP = US1** (shell + shared kit) — this alone visually transforms all 8 pages since
  every page consumes the shared components.
- Then US2 (dashboard depth/signature), then US3 (mop-up spot fixes for full consistency).
- Total: **25 tasks** (US1: 11, US2: 4, US3: 7, Polish: 3).
