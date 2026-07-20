# Feature Specification: MatchParticipant Status Documentation Cleanup

**Feature Branch**: `002-matchparticipant-status-doc`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Align the MatchParticipant status documentation with the three states actually used (Pending/Approved/Rejected); remove the stale 'Cancelled, EscrowPaid' from the comment. Documentation-only, no behavior/schema change."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accurate status documentation for maintainers (Priority: P1)

A developer reading the MatchParticipant entity needs to know which statuses a participant
can actually hold. Today the inline documentation lists five values, but the system only
ever assigns three. The developer should see documentation that matches reality, so they
don't write code branching on states that never occur.

**Why this priority**: It is the entire feature. The stale list is a correctness-of-docs
issue that can mislead future work (e.g. someone handling a "Cancelled"/"EscrowPaid"
participant case that the system never produces).

**Independent Test**: Read the MatchParticipant entity documentation and confirm the listed
statuses are exactly the set the system can assign; cross-check that no lower value is
missing and no phantom value is present.

**Acceptance Scenarios**:

1. **Given** the MatchParticipant entity, **When** a developer reads its status documentation, **Then** it lists exactly Pending, Approved, and Rejected — the states the system actually uses.
2. **Given** the cleanup is applied, **When** the project is built and its tests run, **Then** behavior is unchanged (documentation-only edit) and everything still passes.

### Edge Cases

- If a future state is genuinely introduced later, the documentation must be updated then; this feature only removes states that are currently never set.
- The canonical list of participant statuses already lives in a shared constants definition; the entity documentation must not contradict it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The MatchParticipant status documentation MUST list exactly the statuses the system can assign: Pending, Approved, Rejected.
- **FR-002**: The documentation MUST NOT list any status the system never assigns (specifically "Cancelled" and "EscrowPaid" must be removed).
- **FR-003**: The change MUST be documentation/comment only — no runtime behavior, stored data, or schema is altered.
- **FR-004**: The documented status set MUST agree with the shared participant-status constants used across the codebase.

### Key Entities *(include if feature involves data)*

- **Match Participant**: A user's participation in a match, carrying a status whose real value set is Pending → Approved / Rejected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the statuses named in the MatchParticipant documentation are statuses the system can actually assign (no phantom values remain).
- **SC-002**: The build and full existing test suite pass unchanged after the edit (0 new failures), confirming no behavioral impact.

## Assumptions

- The three statuses in use are Pending, Approved, Rejected, as defined by the shared participant-status constants and confirmed by a codebase check that nothing assigns "Cancelled" or "EscrowPaid" to a participant.
- No consumer (frontend, reports, integrations) depends on the entity advertising the extra values.
- Scope is backend documentation only; implementing an EscrowPaid state or any Transaction lifecycle work is explicitly excluded.
