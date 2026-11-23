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
}
