using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Services;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    private readonly IClock _clock;
    private readonly IHostEnvironment _environment;

    public HealthController(
        IClock clock,
        IHostEnvironment environment)
    {
        _clock = clock;
        _environment = environment;
    }

    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            Status = "Healthy",
            UtcTime = _clock.UtcNow,
            Environment = _environment.EnvironmentName
        });
    }
}