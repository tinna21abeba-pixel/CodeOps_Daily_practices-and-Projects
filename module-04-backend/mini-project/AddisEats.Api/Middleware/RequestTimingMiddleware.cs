
using System.Diagnostics;

namespace AddisEats.Api.Middleware;

public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    private const int WarningThresholdMs = 1000;

    public RequestTimingMiddleware(
        RequestDelegate next,
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();

            var duration = stopwatch.ElapsedMilliseconds;
            var statusCode = context.Response.StatusCode;

            if (duration >= WarningThresholdMs)
            {
                _logger.LogWarning(
                    "Slow request: {Method} {Path} | Status: {StatusCode} | Duration: {Duration}ms",
                    context.Request.Method,
                    context.Request.Path,
                    statusCode,
                    duration);
            }
            else
            {
                _logger.LogInformation(
                    "Request: {Method} {Path} | Status: {StatusCode} | Duration: {Duration}ms",
                    context.Request.Method,
                    context.Request.Path,
                    statusCode,
                    duration);
            }
        }
    }
}
