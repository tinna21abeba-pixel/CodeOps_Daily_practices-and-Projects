using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AddisEats.Api.Models;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/delivery")]
public class DeliveryController : ControllerBase
{
    private readonly DeliveryOptions _deliveryOptions;

    public DeliveryController(IOptions<DeliveryOptions> options)
    {
        _deliveryOptions = options.Value;
    }

    [HttpGet("options")]
    public IActionResult GetOptions()
    {
        return Ok(new
        {
            FreeAboveEtb = _deliveryOptions.FreeAboveEtb,
            DefaultFeeEtb = _deliveryOptions.DefaultFeeEtb
        });
    }
}