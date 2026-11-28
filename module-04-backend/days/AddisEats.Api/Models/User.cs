namespace AddisEats.Api.Models;

/// <summary>
/// Supported user roles within Addis Eats.
/// </summary>
public static class UserRoles
{
    public const string Customer = "Customer";
    public const string Restaurant = "Restaurant";
    public const string Courier = "Courier";
    public const string Admin = "Admin";

    public static readonly HashSet<string> SelfRegistrable = new(StringComparer.OrdinalIgnoreCase)
    {
        Customer,
        Restaurant,
        Courier
    };
}

/// <summary>
/// Represents an authenticated Addis Eats account (customer, restaurant, or courier).
/// </summary>
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = UserRoles.Customer;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
