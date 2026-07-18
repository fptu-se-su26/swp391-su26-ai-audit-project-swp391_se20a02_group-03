# Research: Tournament Lifecycle

No `NEEDS CLARIFICATION` remained in the spec; the three open product decisions were
resolved by documented assumption. This file records the technical decisions that shape
the design, all grounded in existing ProSport code.

## D1 — Authorization for transitions

- **Decision**: Reuse `IOwnerAccessService.RequireComplexAccessAsync(userId, complexId, isAdmin)`.
- **Rationale**: `TournamentService.CreateAsync` already gates creation with exactly this
  call; a tournament belongs to a `ComplexId`, and the complex owner (or an admin) is the
  "organizer". Reusing it keeps authorization consistent and needs no new concept.
- **Alternatives**: A new `IsOrganizer` check on the tournament — rejected (duplicates the
  complex-access rule already in use).

## D2 — Status values & guards

- **Decision**: Add a `TournamentStatus` constants class (`Open`, `Closed`, `Completed`,
  `Cancelled`) mirroring `BookingStatus`/`MatchStatus`; each transition method checks the
  current status against the allowed source set and returns HTTP 400 on mismatch.
- **Rationale**: The codebase already centralizes status magic-strings in
  `ProSport.Domain/Constants`. `MatchStatus` uses the identical four values but a dedicated
  class documents intent and avoids coupling the two lifecycles.
- **Alternatives**: Reuse `MatchStatus` — rejected (semantic coupling); an enum — rejected
  (entity stores `string`, and the rest of the domain uses string constants).

## D3 — Refund on cancel

- **Decision**: In `CancelAsync`, inside a DB transaction, for each registration with
  `Status == "Registered"` and `EntryFeePaid == true` and `Tournament.EntryFee > 0`:
  credit the captain's wallet via `IEscrowRepository.CreditWalletAsync(captainUserId, EntryFee)`,
  add a `Transaction { Type = Refund, Status = Completed, ReferenceId = "TournamentRefund_{regId}" }`,
  and set the registration `Status = "Cancelled"`. Then set the tournament `Status = "Cancelled"`.
- **Rationale**: This is the same credit-wallet + refund-transaction pattern used by
  `SplitPaymentService.ExpireUnpaidSharesAsync` and match cancellation. Filtering on
  `Registered` + `EntryFeePaid` makes the loop **idempotent**: once flipped to `Cancelled`,
  a re-run refunds nobody (satisfies FR-011 / SC-004).
- **Alternatives**: Reverse the original payment transaction — rejected (the wallet-credit
  pattern is the established refund mechanism; a stored `ReferenceId` gives the audit trail
  required by FR-012).

## D4 — DB integrity

- **Decision**: Add `t.HasCheckConstraint("CK_Tournaments_Status", "[Status] IN ('Open','Closed','Completed','Cancelled')")`
  in `ProSportDbContext.OnModelCreating` (same shape as `CK_Matches_Status`), plus an EF
  migration.
- **Rationale**: Guarantees FR-010 at the storage layer regardless of service bugs.
- **Alternatives**: App-only validation — rejected (weaker; the codebase already uses DB
  check constraints for Booking/Match/Voucher statuses).

## D5 — Registration blocking after close

- **Decision**: No change needed — `RegisterAsync` already rejects when
  `tournament.Status != "Open"`. Closing to `Closed` therefore blocks new registrations
  automatically (satisfies FR-003).
- **Rationale**: Existing guard at `TournamentService.RegisterAsync` line ~66.

## D6 — Testing approach

- **Decision**: xUnit tests using the EF Core in-memory provider (as existing
  `PlayerFeaturesServiceTests` / `AuditBusinessLogicTests` do), one test per transition:
  happy path, rejected-from-wrong-state, and (for cancel) refund + idempotency.
- **Rationale**: Matches the established test style; no new infra.
- **Note**: The `CK_Tournaments_Status` constraint is not enforced by the in-memory
  provider, so constraint behavior is covered by the migration/relational path, not unit
  tests. Unit tests assert the service-level guards.
