namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Services;

[ApiController]
[Route("api/v1/payment")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    [Route("")]
    [Route("/api/v1/orders/{orderId:int}/payments")]
    [ProducesResponseType(typeof(PaymentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status402PaymentRequired)]
    public IActionResult Process([FromBody] PaymentRequest request)
    {
        var result = _paymentService.ProcessPayment(request);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PaymentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status402PaymentRequired)]
    public IActionResult ProcessQuery([FromQuery] decimal amount)
    {
        if (amount <= 0m || amount > 50000m)
        {
            return ProblemDetailsHelper.CreateProblemResult(
                HttpContext,
                Error.PaymentDeclined("Your payment was declined by the provider. Please verify your balance and retry."));
        }

        var response = new PaymentResponse
        {
            TransactionId = Guid.NewGuid().ToString("N")[..12].ToUpperInvariant(),
            Provider = "TeleBirr",
            Amount = amount,
            Status = "Completed",
            ProcessedAt = DateTime.UtcNow
        };

        return Ok(response);
    }
}
