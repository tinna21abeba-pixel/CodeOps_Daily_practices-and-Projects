namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Middleware;
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

    [HttpGet("concurrency")]
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

        return Ok(new
        {
            MiddlewareInstanceId = middlewareTracker.InstanceId,
            ControllerInstanceId = scopedTracker.InstanceId,
            RequestedTag = tag,
            TagOnEntry = tagOnEntry,
            TagAfterDelay = middlewareTracker.Tag
        });
    }

    [Authorize]
    [HttpGet("protected")]
    public IActionResult GetProtected()
    {
        return Ok(new
        {
            User = User.Identity?.Name,
            Authenticated = User.Identity?.IsAuthenticated ?? false
        });
    }
}
