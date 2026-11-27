namespace AddisEats.Api.DTOs;

/// <summary>
/// Basic API health check status payload.
/// </summary>
public record HealthCheckResponse
{
    /// <summary>
    /// Overall operational status of the Addis Eats API.
    /// </summary>
    /// <example>Healthy</example>
    public string Status { get; init; }

    /// <summary>
    /// UTC timestamp when the health check was evaluated.
    /// </summary>
    /// <example>2026-11-27T09:30:00Z</example>
    public DateTime Timestamp { get; init; }

    public HealthCheckResponse(string status, DateTime timestamp)
    {
        Status = status;
        Timestamp = timestamp;
    }
}

/// <summary>
/// Simulated slow health check payload used to verify request timing thresholds.
/// </summary>
public record SlowHealthResponse
{
    /// <summary>
    /// Health status reported after the simulated processing delay.
    /// </summary>
    /// <example>SlowHealthy</example>
    public string Status { get; init; }

    /// <summary>
    /// Bounded delay applied in milliseconds.
    /// </summary>
    /// <example>1100</example>
    public int DelayMs { get; init; }

    /// <summary>
    /// UTC timestamp when the response completed.
    /// </summary>
    /// <example>2026-11-27T09:30:01Z</example>
    public DateTime Timestamp { get; init; }

    public SlowHealthResponse(string status, int delayMs, DateTime timestamp)
    {
        Status = status;
        DelayMs = delayMs;
        Timestamp = timestamp;
    }
}
