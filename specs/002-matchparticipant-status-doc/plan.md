# Implementation Plan: MatchParticipant Status Documentation Cleanup

**Branch**: `002-matchparticipant-status-doc` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-matchparticipant-status-doc/spec.md`

## Summary

Remove the two phantom statuses (`Cancelled`, `EscrowPaid`) from the inline documentation
of `MatchParticipant.Status` so the entity documents exactly the three values the system
assigns (`Pending`, `Approved`, `Rejected`), matching the `MatchParticipantStatus` constants.
Documentation-only edit — no behavior, data, or schema change.

## Technical Context

**Language/Version**: C# / .NET 8
**Primary Dependencies**: n/a (single entity file comment)
**Storage**: unchanged (no schema/migration)
**Testing**: existing `ProSport.Tests` (xUnit) — run as a regression guard only
**Target Platform**: backend web service
**Project Type**: Web service (backend only)
**Performance Goals / Constraints / Scale**: n/a — zero runtime impact

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is the unratified template (no project-specific gates). Defaults:
- **No behavior change** → no new tests required; existing suite is the regression guard. ✅
- **Reuse/consistency** → documentation aligned to the existing `MatchParticipantStatus` constants. ✅
- **No unjustified complexity** → single-line comment edit. ✅

**Result**: PASS.

## Project Structure

### Documentation (this feature)
```text
specs/002-matchparticipant-status-doc/
├── plan.md          # this file
├── quickstart.md    # verification steps
└── tasks.md         # /speckit-tasks output
```
`research.md`, `data-model.md`, and `contracts/` are **not applicable** — no unknowns to
research, no data-model change, and no interface/contract change for a comment edit.

### Source Code (repository root)
```text
src/backend/ProSport.Domain/Entities/MatchParticipant.cs   # edit the Status comment (only file touched)
```

**Structure Decision**: Single-file documentation edit within the existing Domain layer.

## Complexity Tracking

> No constitution violations — section intentionally empty.
