# Quickstart: Validate Tournament Lifecycle

Backend-only feature. Validate via unit tests (primary) and, optionally, the running API.

## Prerequisites
- .NET 8 SDK
- From `src/backend/`

## 1. Build + unit tests (primary validation)
```powershell
dotnet build ProSport.sln
dotnet test ProSport.sln --filter "FullyQualifiedName~TournamentLifecycle"
```
**Expected**: all new transition tests pass — see [contracts](./contracts/tournament-lifecycle.md)
and [data-model](./data-model.md) for the behaviors asserted:
- Open → Closed succeeds; close-from-non-Open → rejected.
- Closed → Completed succeeds; complete-from-non-Closed → rejected.
- Open|Closed → Cancelled succeeds and refunds paid registrations; cancel-from-terminal → rejected.
- Cancel run twice → no duplicate refund (idempotent).
- Non-organizer/non-admin caller → rejected.

## 2. Migration check (relational path)
```powershell
dotnet ef migrations list -p ProSport.Infrastructure -s ProSport.API
```
**Expected**: the new migration adding `CK_Tournaments_Status` appears. Applying it to SQL
Server must reject any `INSERT/UPDATE` with a Status outside the four allowed values.

## 3. Optional — exercise the API
With the API running and an organizer/admin bearer token:
```
POST /api/tournaments/{id}/close      → 200, Status "Closed"
POST /api/tournaments/{id}/complete   → 200, Status "Completed"
POST /api/tournaments/{id}/cancel     → 200, Status "Cancelled" (paid teams refunded)
```
Wrong source state → 400; missing/invalid token → 401; non-organizer → 403; unknown id → 404.

## Success = 
All items in `spec.md` Success Criteria (SC-001…SC-004) demonstrated: full happy path,
100% refund of paid registrations on cancel, all invalid/unauthorized transitions rejected,
and zero duplicate refunds.
