namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Services;

/// <summary>
/// Processes Ethiopian mobile money payments (TeleBirr and CBE Birr).
/// </summary>
[ApiController]
[Tags("Payments")]
[Route("api/v1/payment")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    /// <summary>
    /// Processes a mobile money payment for an order.
    /// </summary>
    /// <param name="request">The payment request payload containing provider, ETB amount, and customer mobile number.</param>
    /// <returns>The settled payment confirmation.</returns>
    /// <response code="200">Payment processed successfully.</response>
    /// <response code="400">One or more payment request fields failed validation.</response>
    /// <response code="402">Payment was declined by the provider (for example, exceeding transaction limits).</response>
    [HttpPost]
    [Route("")]
    [Route("/api/v1/orders/{orderId:int}/payments")]
    [ProducesResponseType(typeof(PaymentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Simulates a TeleBirr payment using a query-supplied ETB amount.
    /// </summary>
    /// <param name="amount">Payment amount in Ethiopian Birr (ETB).</param>
    /// <returns>The simulated payment confirmation.</returns>
    /// <response code="200">Payment processed successfully.</response>
    /// <response code="400">Invalid amount query parameter or unknown query key.</response>
    /// <response code="402">Payment declined because the amount is non-positive or exceeds 50,000 ETB.</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaymentResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
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
