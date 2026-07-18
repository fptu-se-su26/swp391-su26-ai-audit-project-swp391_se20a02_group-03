# Feature Specification: Tournament Lifecycle

**Feature Branch**: `001-tournament-lifecycle`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Tournament lifecycle for Pro-Sport. Currently only 'Open' is set; implement Open → Closed (registration closes), Closed → Completed (tournament ends), Open/Closed → Cancelled (organizer/admin cancels, refund paid registrations). Backend only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Close registration (Priority: P1)

An organizer running an open tournament decides registration should stop (the roster is full or the sign-up window has ended). They close registration so no one else can join, and the tournament is locked for play.

**Why this priority**: This is the first and most common progression beyond the initial "Open" state. Without it, a tournament can never leave "Open" and the roster can never be finalized — it blocks every later stage.

**Independent Test**: Create an open tournament, close its registration, then confirm the tournament reads as "Closed" and any further registration attempt is rejected.

**Acceptance Scenarios**:

1. **Given** a tournament in "Open" state, **When** its organizer closes registration, **Then** the tournament becomes "Closed" and new registrations are refused.
2. **Given** a tournament that is not "Open" (already Closed, Completed, or Cancelled), **When** someone tries to close registration, **Then** the action is rejected with a clear reason and no state change occurs.
3. **Given** a tournament in "Open" state, **When** a user who is neither the organizer nor an admin tries to close it, **Then** the action is refused.

---

### User Story 2 - Cancel a tournament and refund players (Priority: P2)

An organizer or admin must call off a tournament that has not yet finished (for example, too few teams, a venue problem, or a policy violation). Every player who already paid to register gets their money back, and the tournament is marked cancelled.

**Why this priority**: Cancellation touches players' money, so correctness matters, but it is an exception path rather than the normal progression. It must be reliable but is secondary to the happy-path close/complete flow.

**Independent Test**: Create a tournament with at least one paid registration, cancel the tournament, then confirm the tournament reads "Cancelled", each paid registration is refunded in full to the participant's wallet, and those registrations are marked cancelled.

**Acceptance Scenarios**:

1. **Given** an "Open" or "Closed" tournament with paid registrations, **When** the organizer or admin cancels it, **Then** the tournament becomes "Cancelled", every paid registration is refunded in full, and each affected registration becomes "Cancelled".
2. **Given** a tournament already "Completed" or "Cancelled", **When** someone tries to cancel it, **Then** the action is rejected and no additional refund is issued.
3. **Given** a cancellation that has already refunded a registration, **When** the cancel operation is retried, **Then** no participant is refunded twice.

---

### User Story 3 - Complete a tournament (Priority: P3)

After a closed tournament has been played, the organizer or admin marks it as finished so it moves into its final, historical state.

**Why this priority**: Completion is the terminal happy-path marker. It has no money movement and is the least time-sensitive of the three transitions, so it can ship last.

**Independent Test**: Create a "Closed" tournament, mark it completed, then confirm it reads "Completed" and can no longer be closed, completed again, or cancelled.

**Acceptance Scenarios**:

1. **Given** a tournament in "Closed" state, **When** the organizer or admin completes it, **Then** the tournament becomes "Completed".
2. **Given** a tournament that is not "Closed" (Open, Completed, or Cancelled), **When** someone tries to complete it, **Then** the action is rejected with a clear reason.

---

### Edge Cases

- Attempting any transition that is not allowed from the current state (e.g. Open → Completed directly, or completing an already-cancelled tournament) must be refused with a clear message and leave the state unchanged.
- A non-organizer, non-admin actor attempting any transition must be refused.
- Cancelling a tournament that has registrations but none paid: the tournament still becomes "Cancelled" and registrations are marked cancelled, with no refunds needed.
- Retrying/failing partway through a cancellation must not double-refund any participant.
- A tournament stored with any status value outside the four allowed values must never be possible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a tournament's organizer, or an admin, to close registration on a tournament that is in the "Open" state, moving it to "Closed".
- **FR-002**: The system MUST reject closing registration on any tournament not currently in the "Open" state, leaving its state unchanged.
- **FR-003**: Once a tournament is "Closed" (or beyond), the system MUST refuse new registrations for it.
- **FR-004**: The system MUST allow the organizer or an admin to mark a "Closed" tournament as "Completed".
- **FR-005**: The system MUST reject completing any tournament not currently in the "Closed" state.
- **FR-006**: The system MUST allow the organizer or an admin to cancel a tournament that is in the "Open" or "Closed" state, moving it to "Cancelled".
- **FR-007**: On cancellation, the system MUST refund, in full, every registration that has already been paid, crediting each participant, and MUST mark every affected registration as "Cancelled".
- **FR-008**: The system MUST reject cancelling a tournament already in a terminal state ("Completed" or "Cancelled") and MUST NOT issue further refunds for it.
- **FR-009**: The system MUST restrict close, complete, and cancel actions to the tournament's organizer or an admin; all other actors MUST be refused.
- **FR-010**: The system MUST guarantee that a tournament's status is always exactly one of: "Open", "Closed", "Completed", "Cancelled" — no other value can be persisted.
- **FR-011**: The system MUST make refunds during cancellation safe against duplication, so no participant is ever refunded more than once for the same registration.
- **FR-012**: The system MUST keep an auditable record of each refund issued during a cancellation.

### Key Entities *(include if feature involves data)*

- **Tournament**: A competitive event with a lifecycle status (Open → Closed → Completed, or Open/Closed → Cancelled) and an owning organizer.
- **Tournament Registration**: A team/player's entry into a tournament, with its own status (Registered → Cancelled) and a payment/paid state that determines whether a refund is owed on cancellation.
- **Participant Wallet / Refund Record**: The participant's balance that receives refunds, plus an auditable record of each refund transaction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An organizer can take a tournament through its full happy path (Open → Closed → Completed) using the provided actions, with each step reflected immediately in the tournament's status.
- **SC-002**: After a tournament is cancelled, 100% of paid registrations are refunded in full and 0 remain in a paid-but-unrefunded state.
- **SC-003**: 100% of disallowed transitions (wrong source state) and unauthorized attempts are rejected, and 0 invalid status values are ever stored.
- **SC-004**: Re-running a cancellation results in 0 duplicate refunds.

## Assumptions

- **Manual transitions**: Closing registration, completing, and cancelling are explicit actions taken by the organizer or admin. Automatic date-driven transitions (auto-close at a deadline, auto-complete after the end date) are out of scope for this version and may be layered on later.
- **Full refund on cancel**: Cancellation refunds paid registrations at 100% (no cancellation fee). A fee policy is out of scope for this version.
- **Authorization model**: "Organizer" means the account that owns/created the tournament; "admin" is a platform administrator. Either may perform all three transitions.
- **Refund mechanism**: Refunds reuse the platform's existing participant wallet / escrow-refund mechanism already used elsewhere (e.g. match and booking refunds).
- **Prize distribution excluded**: Marking a tournament "Completed" records the state only; awarding prizes or updating rankings is out of scope.
- **Registration status**: The Registered → Cancelled registration lifecycle already exists and is reused; this feature drives it during tournament cancellation.
- **Scope**: Backend behavior only. No user-interface work is included.
