using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AddisEats.Api.Models;

namespace AddisEats.Api.Controllers;

[ApiController]
[Tags("Delivery")]
[Route("api/v1/delivery")]
public class DeliveryController : ControllerBase
{
    private readonly DeliveryOptions _deliveryOptions;

    public DeliveryController(IOptions<DeliveryOptions> options)
    {
        _deliveryOptions = options.Value;
    }

    [HttpGet("options")]
    [ProducesResponseType(typeof(DeliveryOptions), StatusCodes.Status200OK)]
    public IActionResult GetOptions()
    {
        return Ok(new DeliveryOptions
        {
            FreeAboveEtb = _deliveryOptions.FreeAboveEtb,
            DefaultFeeEtb = _deliveryOptions.DefaultFeeEtb
        });
    }
}