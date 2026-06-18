namespace ProSport.Application.Services;

public static class EquipmentRentalRules
{
    public const decimal DepositRate = 0.20m;

    public static decimal CalculateDeposit(decimal retailPrice, int quantity) =>
        Math.Round(retailPrice * DepositRate * quantity, 0);
}
