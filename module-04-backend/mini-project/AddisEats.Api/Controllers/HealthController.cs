namespace AddisEats.Api.Controllers;

using AddisEats.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Diagnostic and health verification endpoints.
/// </summary>
[ApiController]
[Tags("Health")]
[Route("api/v1/health")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Checks whether the Addis Eats API is healthy and responsive.
    /// </summary>
    /// <returns>Current service health status and UTC timestamp.</returns>
    /// <response code="200">Service is healthy.</response>
    [HttpGet]
    [ProducesResponseType(typeof(HealthCheckResponse), StatusCodes.Status200OK)]
    public ActionResult<HealthCheckResponse> Check()
    {
        return Ok(new HealthCheckResponse("Healthy", DateTime.UtcNow));
    }

    /// <summary>
    /// Deliberately throws an unhandled exception to verify global error handling.
    /// </summary>
    /// <returns>Never returns a success payload; triggers a 500 ProblemDetails response.</returns>
    /// <response code="500">Unhandled server exception formatted as RFC 7807 ProblemDetails.</response>
    [HttpGet("error")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public IActionResult DeliberateError()
    {
        throw new InvalidOperationException("Deliberate unhandled exception for middleware verification.");
    }

    /// <summary>
    /// Simulates a delayed response (clamped between 0 and 5000 ms) to test slow-request warning logs.
    /// </summary>
    /// <param name="delayMs">Requested artificial delay in milliseconds (default 1100).</param>
    /// <returns>Health status, applied delay in milliseconds, and UTC completion timestamp.</returns>
    /// <response code="200">Delayed health check completed.</response>
    /// <response code="400">Invalid query parameter or unknown query key.</response>
    [HttpGet("slow")]
    [ProducesResponseType(typeof(SlowHealthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SlowHealthResponse>> Slow([FromQuery] int delayMs = 1100)
    {
        var boundedDelay = Math.Clamp(delayMs, 0, 5000);
        await Task.Delay(boundedDelay);
        return Ok(new SlowHealthResponse("SlowHealthy", boundedDelay, DateTime.UtcNow));
    }
}
