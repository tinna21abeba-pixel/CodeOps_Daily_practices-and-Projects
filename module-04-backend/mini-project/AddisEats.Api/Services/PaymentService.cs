namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.DTOs;

public class PaymentService : IPaymentService
{
    public Result<PaymentResponse> ProcessPayment(PaymentRequest request)
    {
        if (request.Amount <= 0m || request.Amount > 50000m)
        {
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

        return Result<PaymentResponse>.Success(response);
    }
}
