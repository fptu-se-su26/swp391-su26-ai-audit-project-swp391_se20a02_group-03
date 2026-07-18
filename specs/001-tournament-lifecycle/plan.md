# Implementation Plan: Tournament Lifecycle

**Branch**: `001-tournament-lifecycle` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tournament-lifecycle/spec.md`

## Summary

Add the three missing Tournament state transitions — Close (Open→Closed), Complete
(Closed→Completed), and Cancel (Open/Closed→Cancelled, refunding paid registrations via
escrow) — to the existing ProSport backend. Each transition is a guarded service method
(source-state check + organizer/admin authorization) exposed as a controller endpoint,
backed by a `TournamentStatus` constants class and a DB check constraint (+ EF migration)
so only the four valid values can ever be stored. Refunds reuse the existing escrow
credit + refund-transaction pattern already used by Match and split-payment cancellation.

## Technical Context

**Language/Version**: C# / .NET 8

**Primary Dependencies**: ASP.NET Core (Web API), Entity Framework Core (SQL Server provider)

**Storage**: SQL Server (EF Core `ProSportDbContext`); in-memory provider for unit tests

**Testing**: xUnit + FluentAssertions + Moq (existing `ProSport.Tests`)

**Target Platform**: Linux/Windows server (ASP.NET Core web service)

**Project Type**: Web service (backend only — no frontend in scope)

**Performance Goals**: Standard API expectations; transitions are low-frequency admin
actions. Cancellation refund loop is O(registrations) per tournament.

**Constraints**: Refunds must be atomic and non-duplicating (DB transaction; only
`Registered` + paid registrations refunded, then flipped to `Cancelled`).

**Scale/Scope**: Small — one entity's lifecycle, 3 new service methods, 3 endpoints,
1 constants class, 1 check constraint + migration, ~6–8 unit tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is still the unratified
template (placeholders only), so no project-specific gates are defined. Applying sensible
defaults:

- **Test coverage**: each new transition (happy path + rejected source state +
  unauthorized) gets a unit test. ✅ planned
- **Reuse over new patterns**: authorization via existing `IOwnerAccessService`; refunds
  via existing escrow pattern; status via a `BookingStatus`-style constants class. ✅
- **No unjustified complexity**: no new projects, no new abstractions. ✅
- **Data integrity**: DB check constraint enforces the closed set of statuses. ✅

**Result**: PASS (no violations; Complexity Tracking left empty).

## Project Structure

### Documentation (this feature)

```text
specs/001-tournament-lifecycle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── tournament-lifecycle.md
└── tasks.md             # /speckit-tasks output (not created here)
```

### Source Code (repository root)

```text
src/backend/
├── ProSport.Domain/
│   ├── Constants/
│   │   └── TournamentStatus.cs          # NEW — Open/Closed/Completed/Cancelled (+ helpers)
│   └── Entities/Tournament.cs           # (unchanged; Status already string)
├── ProSport.Application/
│   ├── Interfaces/ITournamentService.cs # + CloseRegistrationAsync/CompleteAsync/CancelAsync
│   └── DTOs/…                            # (reuse ApiResponseDto/TournamentDto)
├── ProSport.Infrastructure/
│   ├── Services/TournamentService.cs    # implement 3 transitions (+ refund on cancel)
│   ├── Data/ProSportDbContext.cs        # + CK_Tournaments_Status check constraint
│   └── Migrations/                       # NEW migration for the constraint
├── ProSport.API/
│   └── Controllers/TournamentController.cs # + close/complete/cancel endpoints
└── ProSport.Tests/
    └── TournamentLifecycleTests.cs      # NEW — one test per transition + guards
```

**Structure Decision**: Existing layered solution (`Domain` / `Application` /
`Infrastructure` / `API` + `Tests`). This feature extends the Tournament slice already
present in each layer — no structural change.

## Complexity Tracking

> No constitution violations — section intentionally empty.
