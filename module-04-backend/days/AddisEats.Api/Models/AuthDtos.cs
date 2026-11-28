namespace AddisEats.Api.Models;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

public class RegisterRequest
{
    /// <summary>
    /// Full display name of the user.
    /// </summary>
    /// <example>Abebe Bikila</example>
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Ethiopian mobile phone number (09..., 07..., +2519..., or +2517...).
    /// </summary>
    /// <example>+251911234567</example>
    [Required(ErrorMessage = "Ethiopian mobile number is required.")]
    [EthiopianMobile]
    public string MobileNumber { get; set; } = string.Empty;

    /// <summary>
    /// Account password (minimum 8 characters).
    /// </summary>
    /// <example>StrongPass123!</example>
    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Account role: Customer, Restaurant, or Courier (defaults to Customer).
    /// </summary>
    /// <example>Customer</example>
    public string? Role { get; set; }
}

public record UserResponse(
    int Id,
    string Name,
    string MobileNumber,
    string Role,
    DateTime CreatedAtUtc);

public class LoginRequest
{
    /// <summary>
    /// Registered Ethiopian mobile number.
    /// </summary>
    /// <example>+251911111111</example>
    [Required(ErrorMessage = "Ethiopian mobile number is required.")]
    [EthiopianMobile]
    public string MobileNumber { get; set; } = string.Empty;

    /// <summary>
    /// Account password.
    /// </summary>
    /// <example>CustomerPass123!</example>
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}

public class RefreshRequest
{
    /// <summary>
    /// Opaque refresh token previously issued by login or refresh.
    /// </summary>
    [Required(ErrorMessage = "Refresh token is required.")]
    public string RefreshToken { get; set; } = string.Empty;
}

public class LogoutRequest
{
    /// <summary>
    /// Opaque refresh token to revoke.
    /// </summary>
    [Required(ErrorMessage = "Refresh token is required.")]
    public string RefreshToken { get; set; } = string.Empty;
}

public record AuthTokenResponse(
    string AccessToken,
    string TokenType,
    int ExpiresInSeconds,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc);

public record LogoutResponse(string Message);
