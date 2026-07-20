# Data Model: Tournament Lifecycle

## Entities (existing — no schema change beyond the check constraint)

### Tournament
| Field | Type | Notes |
|---|---|---|
| TournamentId | int (PK) | |
| ComplexId | int (FK) | owning complex → determines organizer via `IOwnerAccessService` |
| Status | string | **constrained** to `Open` \| `Closed` \| `Completed` \| `Cancelled` (default `Open`) |
| EntryFee | decimal | per-team fee; `0` = free tournament |
| MaxTeams / RegisteredTeams | int | capacity |
| StartDate / EndDate | DateTime | |
| Registrations | collection | child `TournamentRegistration` |

### TournamentRegistration
| Field | Type | Notes |
|---|---|---|
| TournamentRegistrationId | int (PK) | |
| TournamentId | int (FK) | |
| CaptainUserId | int (FK) | refund recipient |
| Status | string | `Registered` \| `Cancelled` (existing) |
| EntryFeePaid | bool | true when EntryFee debited from escrow (or free) |
| PaymentTransactionId | int? | original escrow payment |

### Transaction (refund audit — existing)
Refund rows added on cancel: `Type = Refund`, `Status = Completed`,
`ReferenceId = "TournamentRefund_{registrationId}"`, `Amount = EntryFee`.

## State machine — Tournament.Status

```
              close                complete
   ┌────────┐ ─────► ┌────────┐ ─────────► ┌───────────┐
   │  Open  │        │ Closed │            │ Completed │ (terminal)
   └────────┘        └────────┘            └───────────┘
      │  \ cancel        │ cancel
      │   \______________│
      ▼                  ▼
   ┌───────────────────────┐
   │       Cancelled       │ (terminal, refunds issued)
   └───────────────────────┘
```

### Allowed transitions
| From | Action | To | Side effects |
|---|---|---|---|
| Open | close registration | Closed | none |
| Closed | complete | Completed | none |
| Open | cancel | Cancelled | refund paid registrations, mark them Cancelled |
| Closed | cancel | Cancelled | refund paid registrations, mark them Cancelled |

### Rejected (return 400, no change)
- Any action whose current status is not in the allowed **From** set (e.g. Open→Completed,
  complete-from-Open, close-from-Closed, cancel-from-Completed/Cancelled).

## Validation rules (from requirements)
- **FR-002/FR-005/FR-008**: guard current status == required source before mutating.
- **FR-007/FR-011**: on cancel, refund only `Registered` + `EntryFeePaid` registrations,
  then flip them to `Cancelled` → idempotent (a second cancel refunds nobody).
- **FR-009**: actor must pass `RequireComplexAccessAsync` (organizer or admin) else 403.
- **FR-010**: DB `CK_Tournaments_Status` restricts stored values.
- **FR-012**: each refund writes a `Transaction` audit row.
