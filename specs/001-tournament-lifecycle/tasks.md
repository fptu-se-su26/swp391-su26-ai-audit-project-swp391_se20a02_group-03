# Tasks: Tournament Lifecycle

**Feature dir**: `specs/001-tournament-lifecycle/` · **Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

**Tech**: .NET 8 / EF Core / xUnit. Backend only. Tests requested (unit test per transition).

**Conventions**: paths are repo-relative under `src/backend/`. `[P]` = parallelizable
(different file, no incomplete dependency). `[US#]` maps to spec user stories.

---

## Phase 1: Setup

No new project or dependency — feature extends the existing ProSport solution. Proceed to Foundational.

## Phase 2: Foundational (blocking prerequisites)

- [x] T001 [P] Create `TournamentStatus` constants (`Open`, `Closed`, `Completed`, `Cancelled`) in `ProSport.Domain/Constants/TournamentStatus.cs`, mirroring `BookingConstants.MatchStatus`.
- [x] T002 Add check constraint `CK_Tournaments_Status IN ('Open','Closed','Completed','Cancelled')` to the Tournament entity mapping in `ProSport.Infrastructure/Data/ProSportDbContext.cs` (same shape as `CK_Matches_Status`).
- [x] T003 Generate EF migration for the new constraint: `dotnet ef migrations add TournamentStatusConstraint -p ProSport.Infrastructure -s ProSport.API` → commit the generated file under `ProSport.Infrastructure/Migrations/`. Depends on T002.

**Checkpoint**: solution builds; statuses centralized; DB integrity in place.

---

## Phase 3: User Story 1 — Close registration (Priority: P1) 🎯 MVP

**Goal**: Organizer/admin moves an Open tournament to Closed; new registrations blocked.
**Independent test**: Open tournament → close → status `Closed` and `RegisterAsync` refuses.

- [x] T004 [US1] Add `CloseRegistrationAsync(int userId, int tournamentId, bool isAdmin = false)` to `ProSport.Application/Interfaces/ITournamentService.cs`.
- [x] T005 [US1] Implement `CloseRegistrationAsync` in `ProSport.Infrastructure/Services/TournamentService.cs`: load tournament (404 if missing), `await _ownerAccess.RequireComplexAccessAsync(userId, ComplexId, isAdmin)` (403), reject if `Status != TournamentStatus.Open` (400), else set `Status = TournamentStatus.Closed`, save, return `TournamentDto`.
- [x] T006 [US1] Add `POST api/tournaments/{tournamentId}/close` to `ProSport.API/Controllers/TournamentController.cs` (`[Authorize]`, extract userId from `NameIdentifier`, pass `User.IsInRole(Roles.Admin)`), returning `StatusCode(response.StatusCode, response)`.
- [x] T007 [US1] Unit tests in `ProSport.Tests/TournamentLifecycleTests.cs`: (a) Open→Closed succeeds; (b) close from `Closed`/`Completed` → 400; (c) non-owner caller → 403; (d) new registration after close → rejected. Depends on T005.

**Checkpoint**: US1 shippable — the Open→Closed slice works end to end.

---

## Phase 4: User Story 2 — Cancel + refund (Priority: P2)

**Goal**: Organizer/admin cancels an Open/Closed tournament; paid registrations refunded.
**Independent test**: tournament with a paid registration → cancel → status `Cancelled`, captain refunded once, registration `Cancelled`; second cancel refunds nobody.

- [x] T008 [US2] Add `CancelAsync(int userId, int tournamentId, bool isAdmin = false)` to `ProSport.Application/Interfaces/ITournamentService.cs`.
- [x] T009 [US2] Implement `CancelAsync` in `ProSport.Infrastructure/Services/TournamentService.cs`: load tournament + `Registrations` (404), authz via `RequireComplexAccessAsync` (403), reject if `Status` is `Completed`/`Cancelled` (400). In a `BeginTransactionAsync`: for each registration with `Status == "Registered" && EntryFeePaid && Tournament.EntryFee > 0` → `_escrowRepository.CreditWalletAsync(reg.CaptainUserId, EntryFee)`, add `Transaction { Type = Refund, Status = Completed, ReferenceId = $"TournamentRefund_{reg.Id}" }`, set `reg.Status = "Cancelled"`. Set tournament `Status = TournamentStatus.Cancelled`, save, commit. Return `TournamentDto`.
- [x] T010 [US2] Add `POST api/tournaments/{tournamentId}/cancel` to `ProSport.API/Controllers/TournamentController.cs` (same auth pattern as T006).
- [x] T011 [US2] Unit tests in `ProSport.Tests/TournamentLifecycleTests.cs`: (a) Open→Cancelled and Closed→Cancelled refund a paid registration in full + mark it `Cancelled`; (b) running cancel twice → no duplicate refund (wallet unchanged on 2nd); (c) cancel from `Completed`/`Cancelled` → 400; (d) non-owner → 403. Depends on T009.

**Checkpoint**: US2 shippable — cancellation + refund correct and idempotent.

---

## Phase 5: User Story 3 — Complete (Priority: P3)

**Goal**: Organizer/admin marks a Closed tournament Completed (terminal).
**Independent test**: Closed tournament → complete → status `Completed`; further transitions rejected.

- [x] T012 [US3] Add `CompleteAsync(int userId, int tournamentId, bool isAdmin = false)` to `ProSport.Application/Interfaces/ITournamentService.cs`.
- [x] T013 [US3] Implement `CompleteAsync` in `ProSport.Infrastructure/Services/TournamentService.cs`: load (404), authz (403), reject if `Status != TournamentStatus.Closed` (400), else set `Status = TournamentStatus.Completed`, save, return `TournamentDto`.
- [x] T014 [US3] Add `POST api/tournaments/{tournamentId}/complete` to `ProSport.API/Controllers/TournamentController.cs`.
- [x] T015 [US3] Unit tests in `ProSport.Tests/TournamentLifecycleTests.cs`: (a) Closed→Completed succeeds; (b) complete from `Open`/`Completed`/`Cancelled` → 400. Depends on T013.

**Checkpoint**: full lifecycle Open→Closed→Completed and Open/Closed→Cancelled implemented.

---

## Phase 6: Polish & cross-cutting

- [x] T016 Run `dotnet build ProSport.sln` and `dotnet test ProSport.sln` from `src/backend/` — 0 errors, all tests green (no regressions in existing suite).
- [x] T017 Walk the [quickstart.md](./quickstart.md) validation steps; confirm SC-001…SC-004 from spec are met.

---

## Dependencies & order

- **Foundational (T001–T003)** blocks all stories (constants + DB integrity).
- **US1 (T004–T007)** → **US2 (T008–T011)** → **US3 (T012–T015)** in priority order. Stories are independent after Foundational (each adds its own interface method + impl + endpoint + tests), but share `TournamentService.cs`, `ITournamentService.cs`, `TournamentController.cs`, and `TournamentLifecycleTests.cs`, so run their tasks **sequentially within a story**.
- Within a story: interface signature → implementation → endpoint → tests.
- **Polish (T016–T017)** last.

## Parallel opportunities

- T001 `[P]` runs independently of everything.
- Across stories the touched files overlap (same service/controller/interface/test files), so cross-story parallelism is limited; parallelize by having one contributor per story only if the shared files are coordinated.

## Implementation strategy

- **MVP = Foundational + US1** (Open→Closed). Delivers the first real lifecycle progression and unblocks roster finalization.
- Then US2 (money path — cancel+refund), then US3 (terminal marker).
- Total: **17 tasks** — Foundational 3, US1 4, US2 4, US3 4, Polish 2.
