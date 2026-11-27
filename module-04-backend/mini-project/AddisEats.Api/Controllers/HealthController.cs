namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Check()
    {
        return Ok(new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("error")]
    public IActionResult DeliberateError()
    {
        throw new InvalidOperationException("Deliberate unhandled exception for middleware verification.");
    }

    [HttpGet("slow")]
    public async Task<IActionResult> Slow([FromQuery] int delayMs = 1100)
    {
        var boundedDelay = Math.Clamp(delayMs, 0, 5000);
        await Task.Delay(boundedDelay);
        return Ok(new
        {
            status = "SlowHealthy",
            delayMs = boundedDelay,
            timestamp = DateTime.UtcNow
        });
    }
}
