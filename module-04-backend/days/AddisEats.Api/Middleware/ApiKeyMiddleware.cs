namespace AddisEats.Api.Middleware;

using Microsoft.AspNetCore.Mvc;

public class ApiKeyMiddleware
{
    public const string HeaderName = "X-Api-Key";
    private readonly RequestDelegate _next;

    public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue(HeaderName, out var apiKey) || string.IsNullOrWhiteSpace(apiKey))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/unauthorized",
                Title = "UNAUTHORIZED",
                Status = StatusCodes.Status401Unauthorized,
                Detail = $"Missing required '{HeaderName}' header."
            });
            return;
        }

        await _next(context);
    }
}
