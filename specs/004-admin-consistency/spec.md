# Feature Specification: Admin Frontend & Database Consistency

**Feature Branch**: `004-admin-consistency`

**Created**: 2026-07-18

**Status**: Draft

**Input**: Audit of the admin-scope frontend + database for inconsistencies ("bất cập").

## Audit result (findings)

| ID | Severity | Area | Finding |
|----|----------|------|---------|
| AF1 | High | FE (admin bookings) | `AdminBookingsPage` status maps/tabs cover only Pending/Confirmed/Completed/Cancelled — **missing `PendingPayment`, `Expired`, `CheckedIn`, `NoShow`**. Bookings in those states show a raw untranslated status with a neutral badge and have no filter tab. `PendingPayment`/`Expired` were introduced recently and are now invisible to admins. |
| AD1 | Medium | DB/BE (complaints) | `Report.Status` has **no DB CHECK constraint and no constants class** (uses string literals). The service validates the transition, but the database accepts any value — inconsistent with Booking/Match/Voucher/Tournament/User integrity. |
| AD2 | Medium | DB (admin-managed) | `Court.Status`, `ProductStock.Status`, `PricingRule.Status` have **no DB CHECK constraints**, though admins manage them via AdminCourts/Inventory/Pricing pages. |
| AF2 | Low | FE (admin bookings) | `PAYMENT_VARIANT` lists `Unpaid` (never emitted by backend) and omits `Cancelled` (a real `PaymentStatus`). Cosmetic. |

**Verified correct (no issue):** AdminComplaintsPage uses the exact Report statuses; AdminCourtsPage uses the API status values the backend normalizes; AdminKycPage / AdminUsersPage handle the two E-KYC machines correctly; ReportService validates statuses and enforces staff-vs-admin role rules.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin sees every booking state correctly (Priority: P1)

An admin viewing the bookings list must see a correct, translated status (and be able to
filter) for **every** booking state the system can produce — including split-payment
(`PendingPayment`), timed-out (`Expired`), checked-in (`CheckedIn`), and no-show
(`NoShow`) bookings.

**Why this priority**: It is a user-visible defect in an existing admin screen, made worse
by the new `PendingPayment`/`Expired` states — admins currently cannot recognise or filter
those bookings.

**Independent Test**: Render the admin bookings page with bookings in each of the 8 states;
every row shows a translated label with a sensible badge colour, and a filter exists (or a
sensible grouping) for each state.

**Acceptance Scenarios**:

1. **Given** a booking in `PendingPayment` / `Expired` / `CheckedIn` / `NoShow`, **When** an admin views the bookings list, **Then** the status shows a proper Vietnamese label and a meaningful badge colour (not raw text / neutral).
2. **Given** the status filter, **When** an admin filters by any of the 8 states, **Then** only bookings in that state are shown.

### User Story 2 - Database enforces admin-managed status values (Priority: P2)

Statuses on entities admins manage (complaints, courts, product stock, pricing rules) must
not accept values the system cannot interpret.

**Why this priority**: Preventive integrity fix mirroring constraints already applied
elsewhere; no invalid data known today.

**Acceptance Scenarios**:

1. **Given** the reports table, **When** a row is written with a `Status` outside {Pending, Investigating, Resolved, Rejected}, **Then** the database rejects it.
2. **Given** the courts / product-stock / pricing-rule tables, **When** a row is written with a `Status` outside its allowed set, **Then** the database rejects it.
3. **Given** valid values, **When** written, **Then** they are accepted.

### Edge Cases

- Court status is stored as the canonical `Available` (exposed to the API as `ACTIVE`); the constraint must use the stored values, not the API-facing ones.
- Adding CHECK constraints must not fail on existing data (normalize any offending rows first).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The admin bookings screen MUST render a translated label and a meaningful badge for all eight booking states (Pending, PendingPayment, Confirmed, CheckedIn, Completed, Cancelled, Expired, NoShow).
- **FR-002**: The admin bookings screen MUST allow filtering by each of those states.
- **FR-003**: The database MUST reject any `Report.Status` outside {Pending, Investigating, Resolved, Rejected}.
- **FR-004**: The database MUST reject any `Court.Status`, `ProductStock.Status`, or `PricingRule.Status` outside its allowed set.
- **FR-005**: Report status values SHOULD be centralized in a constants class (as other statuses are) to remove literal duplication.
- **FR-006** (low): The admin bookings payment-status map SHOULD reflect real backend values (`Cancelled` included; `Unpaid` removed).

### Key Entities

- **Booking** (admin view): 8-state status set; admin list must cover all.
- **Report**: complaint with status {Pending, Investigating, Resolved, Rejected}.
- **Court / ProductStock / PricingRule**: admin-managed entities with status columns lacking DB constraints.

## Success Criteria *(mandatory)*

- **SC-001**: 100% of the 8 booking states render a non-raw, translated label with a sensible badge in the admin bookings list.
- **SC-002**: 100% of invalid values for Report/Court/ProductStock/PricingRule status are rejected by the database; 0% of valid values are rejected.
- **SC-003**: Existing backend test suite still passes (0 regressions).

## Assumptions

- Court allowed set = {Available, Maintenance, Inactive}; ProductStock/PricingRule = {Active, Inactive} (from existing constants/defaults).
- Frontend changes are limited to the admin bookings screen maps + filters; other admin screens verified correct and are out of scope.
- Scope: admin frontend + database integrity. No change to admin authorization or business rules.
