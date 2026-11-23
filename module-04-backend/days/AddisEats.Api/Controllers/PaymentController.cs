namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Services;

[ApiController]
[Route("api/v1/payment")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentProvider _paymentProvider;

    public PaymentController(IPaymentProvider paymentProvider)
    {
        _paymentProvider = paymentProvider;
    }

    [HttpGet]
    public IActionResult ProcessPayment([FromQuery] decimal amount)
    {
        if (amount <= 0 || amount > 50000m)
        {
            return StatusCode(StatusCodes.Status402PaymentRequired, new ProblemDetails
            {
                Type = "https://addiseats.et/errors/payment-declined",
                Title = "PAYMENT_DECLINED",
                Status = StatusCodes.Status402PaymentRequired,
                Detail = "Your payment was declined by the provider. Please verify your balance and retry."
            });
        }

        return Ok(new
        {
            Provider = _paymentProvider.ProviderName,
            Result = _paymentProvider.ProcessPayment(amount)
        });
    }
}
