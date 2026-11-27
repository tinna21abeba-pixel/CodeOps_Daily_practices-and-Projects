namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using Microsoft.Extensions.Logging;

public class PaymentService : IPaymentService
{
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(ILogger<PaymentService> logger)
    {
        _logger = logger;
    }

    public Result<PaymentResponse> ProcessPayment(PaymentRequest request)
    {
        _logger.LogDebug(
            "Initiating payment of {Amount} ETB via {Provider}",
            request.Amount,
            request.Provider);

        if (request.Amount <= 0m || request.Amount > 50000m)
        {
            _logger.LogWarning(
                "Payment of {Amount} ETB via {Provider} was declined",
                request.Amount,
                request.Provider);
            return Result<PaymentResponse>.Failure(Error.PaymentDeclined("Your payment was declined by the provider. Please verify your balance and retry."));
        }

        var response = new PaymentResponse
        {
            TransactionId = Guid.NewGuid().ToString("N")[..12].ToUpperInvariant(),
            Provider = request.Provider,
            Amount = request.Amount,
            Status = "Completed",
            ProcessedAt = DateTime.UtcNow
        };

        _logger.LogInformation(
            "Payment {TransactionId} of {Amount} ETB completed via {Provider}",
            response.TransactionId,
            response.Amount,
            response.Provider);

        return Result<PaymentResponse>.Success(response);
    }
}
