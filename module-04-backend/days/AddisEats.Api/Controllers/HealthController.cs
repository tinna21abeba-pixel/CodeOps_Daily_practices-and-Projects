namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Middleware;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

[ApiController]
[Tags("Health")]
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
    [ProducesResponseType(typeof(HealthCheckResponse), StatusCodes.Status200OK)]
    public IActionResult GetHealth()
    {
        return Ok(new HealthCheckResponse(_clock1.UtcNow, _clock2.UtcNow));
    }

    [HttpGet("error")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public IActionResult DeliberateError()
    {
        throw new InvalidOperationException("Deliberate unhandled exception for middleware verification.");
    }

    [HttpGet("concurrency")]
    [ProducesResponseType(typeof(ConcurrencyCheckResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConcurrencyCheck(
        [FromServices] IScopedRequestTracker scopedTracker,
        [FromQuery] string? tag = null,
        [FromQuery] int delayMs = 0)
    {
        var middlewareTracker = HttpContext.Items[RequestTrackerMiddleware.TrackerItemKey] as IScopedRequestTracker ?? scopedTracker;
        var tagOnEntry = middlewareTracker.Tag;

        if (delayMs > 0)
        {
            await Task.Delay(delayMs);
        }

        return Ok(new ConcurrencyCheckResponse(
            middlewareTracker.InstanceId,
            scopedTracker.InstanceId,
            tag,
            tagOnEntry,
            middlewareTracker.Tag));
    }

    [Authorize]
    [HttpGet("protected")]
    [ProducesResponseType(typeof(ProtectedHealthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult GetProtected()
    {
        return Ok(new ProtectedHealthResponse(
            User.Identity?.Name,
            User.Identity?.IsAuthenticated ?? false));
    }
}
