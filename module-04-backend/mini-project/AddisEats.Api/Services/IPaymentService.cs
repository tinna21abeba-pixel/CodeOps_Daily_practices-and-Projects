namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.DTOs;

public interface IPaymentService
{
    Result<PaymentResponse> ProcessPayment(PaymentRequest request);
}
