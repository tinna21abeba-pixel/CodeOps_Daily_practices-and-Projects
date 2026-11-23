namespace AddisEats.Api.DTOs;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

public class PaymentRequest
{
    [Required(ErrorMessage = "Payment provider is required.")]
    public string Provider { get; set; } = string.Empty;

    [Required(ErrorMessage = "Payment amount is required.")]
    [EtbAmount(ErrorMessage = "Payment amount must be a positive ETB amount with at most two decimal places.")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Customer phone number is required.")]
    [EthiopianMobile(ErrorMessage = "Customer phone must be a valid Ethiopian mobile number (09..., 07..., or +251...).")]
    public string Phone { get; set; } = string.Empty;
}

public class PaymentResponse
{
    public string TransactionId { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}
