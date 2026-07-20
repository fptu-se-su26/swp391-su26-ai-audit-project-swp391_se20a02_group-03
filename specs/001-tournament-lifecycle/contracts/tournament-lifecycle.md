# API Contract: Tournament Lifecycle

All three endpoints live on the existing `TournamentController` (`[Route("api/tournaments")]`),
require `[Authorize]`, extract `userId` from the `NameIdentifier` claim, and pass
`isAdmin = User.IsInRole(Roles.Admin)` through to the service (same pattern as `Create`).
All responses use the standard `ApiResponseDto<T>` envelope; the controller returns
`StatusCode(response.StatusCode, response)`.

## POST `/api/tournaments/{tournamentId}/close`
Close registration: **Open → Closed**.

- **Auth**: organizer of the tournament's complex, or admin.
- **Body**: none.
- **Service**: `Task<ApiResponseDto<TournamentDto>> CloseRegistrationAsync(int userId, int tournamentId, bool isAdmin)`
- **Responses**:
  | Code | When |
  |---|---|
  | 200 | closed; returns updated `TournamentDto` (Status = `Closed`) |
  | 400 | tournament not in `Open` state |
  | 401 | no/invalid auth claim |
  | 403 | caller is not organizer/admin |
  | 404 | tournament not found |

## POST `/api/tournaments/{tournamentId}/complete`
Mark finished: **Closed → Completed**.

- **Auth**: organizer or admin.
- **Body**: none.
- **Service**: `Task<ApiResponseDto<TournamentDto>> CompleteAsync(int userId, int tournamentId, bool isAdmin)`
- **Responses**:
  | Code | When |
  |---|---|
  | 200 | completed; Status = `Completed` |
  | 400 | tournament not in `Closed` state |
  | 401 / 403 / 404 | as above |

## POST `/api/tournaments/{tournamentId}/cancel`
Cancel + refund: **Open|Closed → Cancelled**.

- **Auth**: organizer or admin.
- **Body**: none (optional `{ "reason": string }` may be added later; out of scope).
- **Service**: `Task<ApiResponseDto<TournamentDto>> CancelAsync(int userId, int tournamentId, bool isAdmin)`
- **Behavior**: within a DB transaction — refund every `Registered` + `EntryFeePaid`
  registration to its captain's wallet (credit + `Refund` transaction), set those
  registrations `Cancelled`, then set the tournament `Cancelled`.
- **Responses**:
  | Code | When |
  |---|---|
  | 200 | cancelled; Status = `Cancelled`; paid registrations refunded |
  | 400 | tournament already `Completed` or `Cancelled` |
  | 401 / 403 / 404 | as above |

## Interface additions (`ITournamentService`)
```csharp
Task<ApiResponseDto<TournamentDto>> CloseRegistrationAsync(int userId, int tournamentId, bool isAdmin = false);
Task<ApiResponseDto<TournamentDto>> CompleteAsync(int userId, int tournamentId, bool isAdmin = false);
Task<ApiResponseDto<TournamentDto>> CancelAsync(int userId, int tournamentId, bool isAdmin = false);
```
