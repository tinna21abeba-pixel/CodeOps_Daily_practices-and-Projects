using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Services;

namespace AddisEats.Api.Controllers;

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
    public IActionResult ProcessPayment(decimal amount)
    {
        return Ok(new
        {
            Provider = _paymentProvider.ProviderName,
            Result = _paymentProvider.ProcessPayment(amount)
        });
    }
}