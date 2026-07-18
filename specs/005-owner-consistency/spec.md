# Feature Specification: Owner Frontend & Database Consistency

**Feature Branch**: `005-owner-consistency`

**Created**: 2026-07-18

**Status**: Draft

**Input**: Audit of the owner (CourtOwner) scope frontend + database for inconsistencies.

## Audit result (findings)

| ID | Severity | Area | Finding |
|----|----------|------|---------|
| OF2 | **High (real bug)** | FE (owner memberships) | `OwnerMembershipsPage.toggleStatus` sends `Status = 'Suspended'`, but `MembershipService` only accepts {Active, Expired, Cancelled} → backend returns **400**. The **"Tạm ngưng" button is broken** — an owner cannot deactivate a membership. |
| OF1 | Medium | FE (owner bookings) | `OwnerBookingsPage` status filter (`STATUS_OPTIONS`) is **missing `Expired` and `NoShow`**. Bookings in those states cannot be filtered. Labels are also raw English (cosmetic, unlike the Vietnamese admin page). |
| OD1 | Medium | BE/DB (equipment) | `Equipment.Status` is set via an **unvalidated generic setter** (`EquipmentService` `equipment.Status = dto.Status`) **and has no DB CHECK constraint** → accepts arbitrary values (same class as the PricingRule gap fixed earlier). |
| OD2 | Low | DB (owner-managed) | `Complex.Status`, `ComplexOwner.Status`, `ComplexReview.Status` have **no CHECK constraints** (currently only fixed values are written; defense-in-depth debt, not a bug). |
| OF3 | Low | FE (owner staff) | `OwnerStaffPage` toggles only Active↔Inactive; the backend also allows `Suspended`, which no UI can set. Either wire it up or drop `Suspended` from the backend allowed set (and the state diagram). |

**Verified correct (no issue):** OwnerBookingsPage already includes `PendingPayment` and `CheckedIn` in its filter; OwnerCourtsPage / pricing / products status handling matches the backend; Membership & StaffAssignment statuses are validated at the service layer.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner can deactivate a membership (Priority: P1)

An owner viewing memberships must be able to deactivate (pause) an active membership from the
list. Today the toggle sends a status the backend rejects, so nothing happens (error).

**Why this priority**: It is a broken action on a live owner screen — the highest-impact
finding.

**Independent Test**: On the memberships list, toggle an `Active` membership; the request
succeeds and the membership moves to a valid non-active state; toggling back reactivates it.

**Acceptance Scenarios**:

1. **Given** an `Active` membership, **When** the owner clicks the deactivate toggle, **Then** the membership becomes a valid backend status (not `Suspended`) and the request returns success.
2. **Given** a deactivated membership, **When** the owner clicks activate, **Then** it returns to `Active`.

### User Story 2 - Owner bookings shows every booking state (Priority: P2)

An owner filtering bookings must be able to filter by every state the system can produce,
including `Expired` and `NoShow`.

**Acceptance Scenarios**:

1. **Given** the bookings filter, **When** the owner selects `Expired` or `NoShow`, **Then** only bookings in that state are listed.
2. **Given** a booking in any of the 8 states, **When** shown in the list, **Then** its status renders with a clear label.

### User Story 3 - Owner-managed statuses are integrity-protected (Priority: P3)

Statuses on owner-managed entities must not accept values the system cannot interpret —
especially Equipment, which today has an unvalidated setter and no constraint.

**Acceptance Scenarios**:

1. **Given** an equipment update, **When** an out-of-set `Status` is submitted, **Then** it is rejected (service and/or database).
2. **Given** the database, **When** a row is written with an invalid `Equipment.Status`, **Then** the database rejects it.

### Edge Cases

- The intended "deactivate membership" target status must be a real backend value (recommended: `Cancelled`; `Expired` is time-driven and not an owner action).
- Adding CHECK constraints must not fail on existing data.

## Requirements *(mandatory)*

- **FR-001**: The owner memberships deactivate/activate toggle MUST send only backend-valid statuses ({Active, Expired, Cancelled}); deactivation MUST use a valid value (recommended `Cancelled`).
- **FR-002**: The owner bookings filter MUST offer all eight booking states (add `Expired`, `NoShow`); every state MUST render a readable label.
- **FR-003**: `Equipment.Status` updates MUST be validated against the allowed set {Active, Inactive} at the service layer.
- **FR-004**: The database MUST reject any `Equipment.Status` outside {Active, Inactive}.
- **FR-005** (low): Add CHECK constraints for `Complex.Status`, `ComplexOwner.Status`, `ComplexReview.Status` to complete database-level integrity for owner-managed entities.
- **FR-006** (low): Resolve the `StaffAssignment` `Suspended` status — either expose it in the owner staff UI or remove it from the backend allowed set and align the state diagram.

### Key Entities

- **Membership**: status {Active, Expired, Cancelled} — owner toggles activate/deactivate.
- **Booking** (owner view): 8-state status set.
- **Equipment / Complex / ComplexOwner / ComplexReview**: owner-managed entities with status columns lacking validation/constraints.

## Success Criteria *(mandatory)*

- **SC-001**: The owner can deactivate and reactivate a membership with 100% success (0 backend rejections for the toggle).
- **SC-002**: 100% of the 8 booking states are filterable and labelled in the owner bookings list.
- **SC-003**: 100% of invalid `Equipment.Status` values are rejected; existing backend test suite still passes (0 regressions).

## Assumptions

- "Deactivate membership" maps to `Cancelled` (decision to confirm); no `Suspended` state exists for memberships.
- Equipment allowed set = {Active, Inactive}; Complex/ComplexOwner default to "Active", ComplexReview to "Published".
- Scope: owner frontend + database integrity. No change to owner authorization or pricing/booking business rules.
