# Implementation Plan: Admin Portal Visual Redesign

**Branch**: `006-admin-frontend-design` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-admin-frontend-design/spec.md`

## Summary

Re-skin the Admin portal to the product's established "editorial sports brutalism"
identity (ink `#0d1b2a` / paper `#f3f2ee` / teal `#14b8a6` accent, flat 2px borders, no
ambient shadow at rest, mono uppercase eyebrows) — the same identity already restored to
the Apex/Customer portal. Fix by leverage order: shared shell (`AdminLayout`) → shared UI
kit (`components/admin/index.jsx`, imported by all 8 pages) → flagship Dashboard (charts +
stat cards) → per-page spot fixes for the remaining hardcoded classes each page carries
outside the kit. Visual/styling only — zero business-logic or prop-API changes.

## Technical Context

**Language/Version**: JavaScript (React 18) / JSX, Vite 5

**Primary Dependencies**: Tailwind CSS v4 (token system already defined in `index.css`),
`lucide-react` icons, `recharts` (dashboard charts) — no new dependencies

**Storage**: N/A (frontend styling only, no persistence change)

**Testing**: Vitest + Testing Library (existing `AdminUsersPage.test.jsx`,
`AdminCourtsPage.test.jsx`, `AdminKycPage.test.jsx`) — run as regression guard; no new
tests required since no behavior changes (spec explicitly excludes logic changes)

**Target Platform**: Browser, responsive down to mobile (admin sidebar already has a
tested mobile drawer pattern — must keep working)

**Project Type**: Web frontend (React SPA)

**Performance Goals**: N/A — purely CSS/className changes, no measurable perf target

**Constraints**: Zero prop-API changes to shared components (call sites in all 8 pages
must keep working unmodified); zero business-logic changes; must not regress the existing
accessibility work already in `AdminModal` (focus trap, Escape, ARIA) and `AdminLayout`
(inert, aria-hidden, Escape-to-close mobile drawer)

**Scale/Scope**: 1 shell layout + 1 shared kit file (~15 exported components) + 1 flagship
dashboard (2 recharts instances) + 7 secondary pages (spot fixes only)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is the unratified template (no project-specific gates). Applying the same
defaults used for prior features:
- **Reuse over invention**: no new design tokens, fonts, or component library are
  introduced — 100% reuse of the existing `index.css` token system and utility classes
  (`.btn-primary`, `.btn-outline`, `.label-mono`, `.card-base`, `bg-ink`, `bg-surface`,
  etc.) already used by the (already-fixed) Apex portal. ✅
- **No unjustified complexity**: no new abstractions; existing component boundaries
  (`components/admin/index.jsx` exports) are kept identical, only their internals restyled. ✅
- **Regression safety**: existing admin test suite is the guard since no test changes are
  needed for a pure styling pass; a full suite run is required before completion. ✅
- **No prop-API breakage**: every exported component in the shared kit keeps its exact
  prop signature, so no page-file needs a call-site change. ✅

**Result**: PASS (no violations; Complexity Tracking intentionally empty).

## Project Structure

### Documentation (this feature)
```text
specs/006-admin-frontend-design/
├── plan.md              # this file
├── tasks.md             # /speckit-tasks output
└── checklists/
    └── requirements.md
```
`research.md`, `data-model.md`, and `contracts/` are **not applicable** — no technical
unknowns to research (the token system and component patterns are already proven via the
Apex portal fix), no data model changes, no API/interface contract changes for a styling
pass.

### Source Code (repository root)
```text
src/frontend/src/
├── layouts/AdminLayout.jsx              # shell — sidebar/topbar tokens
├── components/admin/index.jsx           # shared UI kit — cascades to all 8 pages
└── pages/admin/
    ├── AdminDashboardPage.jsx           # flagship — stat cards + recharts re-theme
    ├── AdminBookingsPage.jsx            # spot fixes
    ├── AdminUsersPage.jsx               # spot fixes
    ├── AdminCourtsPage.jsx              # spot fixes
    ├── AdminKycPage.jsx                 # spot fixes (largest page, 455 lines)
    ├── AdminComplaintsPage.jsx          # spot fixes
    ├── AdminPricingPage.jsx             # spot fixes
    └── AdminInventoryPage.jsx           # spot fixes
```

**Structure Decision**: Existing frontend structure unchanged — this is a restyle within
already-established files/boundaries, ordered by leverage (shell → shared kit → flagship →
per-page spot fixes) so each step is independently verifiable before the next.

## Complexity Tracking

> No constitution violations — section intentionally empty.
