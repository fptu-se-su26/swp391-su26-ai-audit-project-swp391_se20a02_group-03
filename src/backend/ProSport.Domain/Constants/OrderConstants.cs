namespace ProSport.Domain.Constants;

public static class OrderStatuses
{
    public const string Pending = "Pending";
    public const string Paid = "Paid";
    public const string Processing = "Processing";
    public const string Shipped = "Shipped";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";
}

public static class OrderPaymentMethods
{
    public const string Wallet = "Wallet";
    public const string PayOS = "PayOS";
    public const string COD = "COD";

    public static bool IsValid(string? method) =>
        method is Wallet or PayOS or COD;
}

public static class ShippingStatuses
{
    public const string Pending = "Pending";
    public const string Created = "Created";
    public const string Delivering = "Delivering";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";
}
