namespace AddisEats.Api.Middleware;

using System.Diagnostics;

public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    public RequestTimingMiddleware(RequestDelegate next, ILogger<RequestTimingMiddleware> logger)
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
            var elapsedMs = stopwatch.ElapsedMilliseconds;
            var level = elapsedMs > 1000 ? LogLevel.Warning : LogLevel.Information;

            _logger.Log(
                level,
                "HTTP {Method} {Path} responded {StatusCode} in {ElapsedMs} ms [CorrelationId: {CorrelationId}]",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                elapsedMs,
                context.TraceIdentifier);
        }
    }
}
