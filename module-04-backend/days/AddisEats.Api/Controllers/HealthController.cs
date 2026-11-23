namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Services;

[ApiController]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    private readonly IClock _clock1;
    private readonly IClock _clock2;

    public HealthController(
        IClock clock1,
        IClock clock2)
    {
        _clock1 = clock1;
        _clock2 = clock2;
    }

    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            FirstInstance = _clock1.UtcNow,
            SecondInstance = _clock2.UtcNow
        });
    }

    [HttpGet("error")]
    public IActionResult DeliberateError()
    {
        throw new InvalidOperationException("Deliberate unhandled exception for middleware verification.");
    }
}
