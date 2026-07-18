# Feature Specification: User Module Data-Integrity & Schema-Script Consistency

**Feature Branch**: `003-user-db-consistency`

**Created**: 2026-07-18

**Status**: Draft

**Input**: Audit of the frontend + user database for inconsistencies ("bất cập"). Two real
findings surfaced (stale checked-in SQL schema; missing status CHECK constraints on user
tables); frontend E-KYC handling was verified correct.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trustworthy database schema artifact (Priority: P1)

A teammate (or grader) needs the checked-in SQL schema file to reflect the real database
the running app produces, so they can create/submit a database that matches the code.
Today the file is from an older migration lineage and omits the integrity constraints the
app relies on.

**Why this priority**: The file is advertised (in its own README) as the authoritative,
"100% accurate" artifact to submit or run in SSMS. Being silently outdated is misleading
and produces a schema that differs from the app's — the highest-impact inconsistency found.

**Independent Test**: Regenerate the schema script from the current migrations; diff it
against a schema produced by applying migrations to a clean database — they must match, and
the script must contain every status CHECK constraint the model defines.

**Acceptance Scenarios**:

1. **Given** the current EF migrations, **When** the checked-in SQL schema file is produced, **Then** it reflects the latest migration set (InitialCreate + TournamentStatusConstraint) and includes all status CHECK constraints (Bookings, Matches, Vouchers, Tournaments).
2. **Given** the README describing the file as authoritative, **When** a teammate reads it, **Then** the described regeneration step actually yields the committed file (docs match reality).

---

### User Story 2 - Database-enforced user status values (Priority: P2)

The system must never store an invalid user verification status, KYC-profile status, or
role. Today these columns accept any string, so a bug or manual edit can persist a value
the app cannot interpret (e.g. "Approved" in the user verification column, which the app
only ever reads as "Verified").

**Why this priority**: Consistency/robustness fix that mirrors the integrity already applied
to Booking/Match/Voucher/Tournament statuses. Lower priority than P1 because no invalid data
is known to exist today; this is preventive.

**Independent Test**: Attempt to store an out-of-set value for each of the three columns and
confirm the database rejects it; confirm all valid values are still accepted.

**Acceptance Scenarios**:

1. **Given** the users table, **When** a row is written with `EKycStatus` outside {Unverified, Pending, Verified, Rejected}, **Then** the database rejects it.
2. **Given** the ekyc-profiles table, **When** a row is written with `Status` outside {Pending, Approved, Rejected}, **Then** the database rejects it.
3. **Given** the users table, **When** a row is written with `Role` outside the defined role set, **Then** the database rejects it.
4. **Given** all valid values, **When** written, **Then** they are accepted (no false rejections).

### Edge Cases

- The two E-KYC state sets are intentionally different (`User.EKycStatus` uses "Verified";
  `EkycProfile.Status` uses "Approved"). Constraints must reflect each column's own set —
  they must NOT be merged.
- Applying a new CHECK constraint must not fail on existing data; any pre-existing invalid
  rows must be identified/normalized first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The checked-in SQL schema artifact MUST be regenerated from the current EF migrations so it matches the schema the running application creates.
- **FR-002**: The regenerated artifact MUST contain every status CHECK constraint defined by the model, including the Tournament status constraint added most recently.
- **FR-003**: The database MUST reject any `User.EKycStatus` value outside {Unverified, Pending, Verified, Rejected}.
- **FR-004**: The database MUST reject any `EkycProfile.Status` value outside {Pending, Approved, Rejected}.
- **FR-005**: The database MUST reject any `User.Role` value outside the system's defined role set.
- **FR-006**: All valid values for the three columns MUST continue to be accepted.
- **FR-007**: Any documentation describing the schema artifact MUST match the actual regeneration procedure and the committed file.

### Key Entities *(include if feature involves data)*

- **User**: has `EKycStatus` (verification state) and `Role`; both currently unconstrained at the database level.
- **EkycProfile**: has `Status` (KYC review state); currently unconstrained at the database level.
- **Schema artifact**: the checked-in SQL file meant to mirror the migrations-produced schema.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The committed schema file, when applied to a clean database, produces a schema identical to the one migrations produce (0 differences), including 100% of status CHECK constraints.
- **SC-002**: 100% of invalid values for the three user-status columns are rejected by the database; 0% of valid values are rejected.
- **SC-003**: The full existing backend test suite still passes (0 regressions).

## Assumptions

- Frontend E-KYC handling is already correct (verified during the audit): the admin users
  view reads `User.EKycStatus` (incl. "Verified"); the customer KYC panel reads
  `EkycProfile.Status` (incl. "Approved"). No frontend change is required for correctness.
- The cosmetic frontend label "NotSubmitted" (never emitted by the backend) is out of scope
  (harmless fallback) unless bundled as a trivial cleanup.
- Role values are those already centralized in the backend `Roles` constants.
- Scope: backend/database integrity + the checked-in schema artifact. No user-facing behavior change.
