# Feature Specification: Admin Portal Visual Redesign

**Feature Branch**: `006-admin-frontend-design`

**Created**: 2026-07-18

**Status**: Draft

**Input**: "Dùng spec-kit và Frontend Design để sửa lại UI của Admin — tự nghiên cứu và sửa chữa, cố gắng làm đẹp nhất có thể." Apply the frontend-design skill's distinctive-design process to the Admin portal, matching the depth already applied to the Apex/Customer portal (specs/004, 005 fixed correctness gaps; this feature fixes the *visual identity*).

## Research finding (grounding this spec)

Pro-Sport already has a deliberate, established brand identity — "editorial sports
brutalism": ink navy (`#0d1b2a`) / cream paper (`#f3f2ee`) / teal accent (`#14b8a6`), flat
2px borders with no ambient shadow at rest, uppercase mono "eyebrow" labels, and a
considered radius split (2px for data objects, 8px for buttons/inputs). This identity is
correctly expressed on the public marketing site and was just restored to the Customer
(Apex) product surface.

The **Admin portal** (`AdminLayout.jsx` + the shared kit `components/admin/index.jsx`,
consumed by all 8 admin pages) currently ignores this identity entirely: hardcoded
`bg-white`/`text-gray-*` grays, `rounded-full` pill badges and buttons, pastel
`bg-teal-50` hover washes, and soft ambient shadows (`shadow-[0_2px_12px...]`) — the
generic "AI SaaS admin panel" look the design brief explicitly warns against defaulting to.
Because one shared kit file is imported by all 8 pages, fixing it is the highest-leverage
single change; each page also carries a smaller number of page-local hardcoded classes that
bypass the kit and need a matching spot-fix.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A shared visual language across every admin screen (Priority: P1)

An administrator moving between the dashboard, bookings, users, courts, E-KYC, complaints,
pricing, and inventory screens should feel like they are in one coherent, deliberately
designed product — not a generic dashboard template that happens to share a sidebar color.

**Why this priority**: The shared UI kit (`components/admin/index.jsx`) and shell
(`AdminLayout.jsx`) are imported everywhere; fixing them changes the felt identity of the
entire portal in one move and is the foundation every other page-level fix builds on.

**Independent Test**: Open any two different admin pages; buttons, badges, cards, tables,
pagination, empty/error states, and modals share the same flat, ink/paper/teal visual
language (radius, border weight, type, color roles) — none look like a leftover generic
template.

**Acceptance Scenarios**:

1. **Given** the admin sidebar/topbar shell, **When** an admin loads any admin page, **Then** the chrome uses the established ink/paper/teal tokens (not hardcoded grays) and reads as the same product as the public site and the Apex portal.
2. **Given** the shared UI kit (buttons, badges, cards, tables, modal, pagination, empty/error states), **When** used on any admin page, **Then** every instance renders with the flat brutalist treatment (hard borders, no soft ambient shadow at rest, correct radius per element type) instead of the previous soft/pastel/pill styling.
3. **Given** a status badge for any entity (booking, user KYC, court, complaint, voucher), **When** rendered, **Then** its color role (success/warning/danger/neutral/info) is visually consistent with how the same roles read elsewhere in the product.

### User Story 2 - A dashboard that reads as a command center, not a SaaS trial screen (Priority: P2)

The admin's first screen (Dashboard) is the most-seen admin surface. It should give a
confident, at-a-glance read of the business — revenue, activity, court occupancy — using
the same editorial instrument language as the rest of the product, with real data
visualizations that fit the brand rather than default chart-library styling.

**Independent Test**: Load the dashboard with real data; the stat cards, revenue chart, and
court-occupancy chart all use the brand token palette and flat-card treatment; nothing
reads as a default chart-library demo.

**Acceptance Scenarios**:

1. **Given** dashboard stats are loaded, **When** displayed, **Then** stat cards use the flat data-object treatment (hard border, no ambient shadow) with one considered focal element rather than four visually identical tiles.
2. **Given** the revenue trend and court-occupancy charts, **When** rendered, **Then** their colors, gridlines, and tooltips are drawn from the brand token palette, not the charting library's defaults.

### User Story 3 - Every other admin page matches, not just the shell (Priority: P3)

Each of the remaining seven admin pages (Bookings, Users, Courts, E-KYC, Complaints,
Pricing, Inventory) carries some hardcoded styling that bypasses the shared kit
(page-local badges, avatars, table cells). These should be brought in line so the fix is
complete, not partial.

**Independent Test**: Spot-check each of the seven pages; no leftover hardcoded
`bg-white`/`text-gray-*`/pastel/pill styling remains outside of what the shared kit itself
now defines.

**Acceptance Scenarios**:

1. **Given** any of the seven remaining admin pages, **When** viewed, **Then** page-local elements (avatars, inline badges, custom table cells) use the same token vocabulary as the shared kit.

### Edge Cases

- Recharts (the charting library) renders to SVG and cannot consume CSS custom properties
  reliably across all use sites; chart colors must be hardcoded to the *same* hex values as
  the design tokens (kept in one obvious place) rather than left as the library's defaults.
- The E-KYC and Users pages have the most distinct data types (profile documents, role
  badges); their status/role color-coding must stay semantically correct through the
  restyle (e.g. a rejected KYC must still read as "danger", not accidentally become neutral).
- This is a visual/styling change only — no data-fetching, business logic, or API contract
  may change. Every interactive behavior (filters, pagination, modals, forms) must keep
  working exactly as before.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The admin shell (`AdminLayout`) MUST use the established design tokens (ink/paper/teal, flat borders) instead of hardcoded gray/white Tailwind values.
- **FR-002**: The shared admin UI kit MUST re-skin every primitive (button, badge, card, table, toolbar, search input, filter pills, modal, form field, pagination, empty state, error state, skeleton) to the flat brutalist treatment, with no behavioral change to any component's props or exported API.
- **FR-003**: All 8 admin pages MUST continue to build and render without runtime errors after the kit restyle (prop contracts unchanged).
- **FR-004**: The Dashboard's stat cards and charts MUST use brand token colors and the flat data-object treatment.
- **FR-005**: Each of the remaining 7 admin pages MUST have its page-local hardcoded generic styling (bypassing the shared kit) brought to the same token vocabulary.
- **FR-006**: No business logic, data fetching, API call, or interactive behavior may change as part of this visual pass.
- **FR-007**: The result MUST remain responsive down to mobile widths with no introduced horizontal overflow, and MUST preserve existing accessibility affordances (focus trap in modals, ARIA attributes, keyboard Escape handling) already present in the shared kit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 8 admin pages render with the shared kit's new flat/token-based styling with 0 visual regressions to layout structure.
- **SC-002**: 0 runtime console errors introduced across the 8 admin pages after the restyle.
- **SC-003**: The existing frontend automated test suite (including admin-specific tests: AdminUsersPage, AdminCourtsPage, AdminKycPage) passes unchanged (0 regressions).
- **SC-004**: A manual pass through all 8 pages at desktop and mobile widths shows no hardcoded generic-SaaS styling remnants (soft pastel badges, `rounded-full` buttons/pills, ambient-shadow-at-rest cards) outside of the intentionally-updated kit.

## Assumptions

- No new dependencies are introduced; Recharts (already used) is kept, only re-themed.
- The design tokens, fonts, and utility classes (`.btn-primary`, `.btn-outline`, `.label-mono`, `.card-base`, `bg-ink`, `bg-surface`, etc.) already defined in `index.css` are reused as-is — this feature does not modify the token system itself.
- Scope is the 8 existing admin pages + `AdminLayout` + `components/admin/index.jsx`. No new admin pages or features are added.
- Component prop APIs (`AdminBtn`, `AdminCard`, `AdminStatusBadge`, etc.) stay backward-compatible so no page-file call sites need signature changes — only their internal className implementations change.
