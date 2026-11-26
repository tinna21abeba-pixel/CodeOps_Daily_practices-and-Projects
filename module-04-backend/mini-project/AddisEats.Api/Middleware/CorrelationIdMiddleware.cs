
using Microsoft.AspNetCore.Http;

namespace AddisEats.Api.Middleware;

public class CorrelationIdMiddleware
{
    private const string HeaderName = "X-Correlation-ID";

    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check whether the client provided an ID.
        var correlationId = context.Request.Headers[HeaderName].FirstOrDefault();

        // Generate an ID if none was provided.
        if (string.IsNullOrWhiteSpace(correlationId))
        {
            correlationId = Guid.NewGuid().ToString();
        }

        // Store the ID for other components.
        context.Items[HeaderName] = correlationId;

        // Add the ID to the response.
        context.Response.OnStarting(() =>
        {
            context.Response.Headers[HeaderName] = correlationId;
            return Task.CompletedTask;
        });

        await _next(context);
    }
}
