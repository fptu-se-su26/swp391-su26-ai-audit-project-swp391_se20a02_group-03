# Quickstart: Validate MatchParticipant Status Doc Cleanup

Documentation-only change. Validation = confirm the comment is correct and nothing broke.

## 1. Inspect the edit
`src/backend/ProSport.Domain/Entities/MatchParticipant.cs` — the `Status` comment lists
exactly `Pending, Approved, Rejected` (no `Cancelled`, no `EscrowPaid`), matching
`ProSport.Domain/Constants/MatchParticipantStatus`.

## 2. Regression guard (no behavior should change)
```powershell
cd src/backend
dotnet build ProSport.sln
dotnet test ProSport.sln
```
**Expected**: build succeeds, full existing suite passes with the same pass count as before
(a comment edit changes no runtime behavior) → satisfies SC-002.

## Success =
- SC-001: only real statuses named in the entity docs.
- SC-002: build + tests green, unchanged.
