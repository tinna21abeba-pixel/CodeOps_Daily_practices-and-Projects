namespace AddisEats.Api.DTOs;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

/// <summary>
/// Request payload to initiate an Ethiopian mobile money payment.
/// </summary>
public class PaymentRequest
{
    /// <summary>
    /// Payment provider name (for example, TeleBirr or CbeBirr).
    /// </summary>
    /// <example>TeleBirr</example>
    [Required(ErrorMessage = "Payment provider is required.")]
    public string Provider { get; set; } = string.Empty;

    /// <summary>
    /// Charge amount in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>500.00</example>
    [Required(ErrorMessage = "Payment amount is required.")]
    [EtbAmount(ErrorMessage = "Payment amount must be a positive ETB amount with at most two decimal places.")]
    public decimal Amount { get; set; }

    /// <summary>
    /// Payer mobile number in Ethiopian format (09..., 07..., +2519..., or +2517...).
    /// </summary>
    /// <example>+251911234567</example>
    [Required(ErrorMessage = "Customer phone number is required.")]
    [EthiopianMobile(ErrorMessage = "Customer phone must be a valid Ethiopian mobile number (09..., 07..., or +251...).")]
    public string Phone { get; set; } = string.Empty;
}

/// <summary>
/// Confirmation details returned after processing a payment.
/// </summary>
public class PaymentResponse
{
    /// <summary>
    /// Provider-generated transaction reference identifier.
    /// </summary>
    /// <example>9F3C2A81B4D0</example>
    public string TransactionId { get; set; } = string.Empty;

    /// <summary>
    /// Payment provider that processed the charge.
    /// </summary>
    /// <example>TeleBirr</example>
    public string Provider { get; set; } = string.Empty;

    /// <summary>
    /// Settled amount in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>500.00</example>
    public decimal Amount { get; set; }

    /// <summary>
    /// Settlement outcome status.
    /// </summary>
    /// <example>Completed</example>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// UTC timestamp when the payment settled.
    /// </summary>
    /// <example>2026-11-27T09:30:00Z</example>
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}
