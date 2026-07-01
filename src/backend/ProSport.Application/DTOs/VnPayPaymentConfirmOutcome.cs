namespace ProSport.Application.DTOs;

public enum VnPayPaymentConfirmOutcome
{
    Success,
    AlreadyPaid,
    NotFound,
    Expired,
    AmountMismatch,
    DuplicateReference
}
