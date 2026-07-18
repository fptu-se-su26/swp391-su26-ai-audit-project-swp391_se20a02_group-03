# Tasks: MatchParticipant Status Documentation Cleanup

**Feature dir**: `specs/002-matchparticipant-status-doc/` · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

**Tech**: .NET 8 backend. Documentation-only — no tests requested (no runtime surface changes).
Paths are repo-relative under `src/backend/`.

## Phase 1: Setup

No setup — single-file comment edit in the existing solution.

## Phase 2: Foundational

None — no shared prerequisites.

## Phase 3: User Story 1 — Accurate status documentation (Priority: P1) 🎯 MVP

**Goal**: The `MatchParticipant.Status` documentation lists only the real states.
**Independent test**: Read the entity; the comment names exactly Pending/Approved/Rejected and
matches `MatchParticipantStatus`; build + existing tests stay green.

- [x] T001 [US1] Edit the `Status` comment on `ProSport.Domain/Entities/MatchParticipant.cs` to list only `Pending, Approved, Rejected` (remove `Cancelled, EscrowPaid`); keep it consistent with `ProSport.Domain/Constants/MatchParticipantStatus`.

**Checkpoint**: entity documentation matches reality.

## Phase 4: Polish & cross-cutting

- [x] T002 Run `dotnet build ProSport.sln` and `dotnet test ProSport.sln` from `src/backend/` as a regression guard — expect 0 errors and the same pass count as before (comment edit → no behavior change). Satisfies SC-002.

---

## Dependencies & order
- T001 → T002. No parallelism (2 sequential tasks, 1 file + 1 verification).

## Implementation strategy
- MVP = US1 (the entire feature). Total: **2 tasks** (US1: 1, Polish: 1).
