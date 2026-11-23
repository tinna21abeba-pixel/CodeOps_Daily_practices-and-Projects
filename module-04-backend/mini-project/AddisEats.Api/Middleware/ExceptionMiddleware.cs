namespace AddisEats.Api.Middleware;

using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Text.Json;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var traceId = Activity.Current?.Id ?? context.TraceIdentifier;
            _logger.LogError(ex, "Unhandled exception occurred. TraceId: {TraceId}", traceId);
            await HandleExceptionAsync(context, traceId);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, string traceId)
    {
        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var problemDetails = new ProblemDetails
        {
            Type = "https://addiseats.et/errors/internal-server-error",
            Title = "INTERNAL_SERVER_ERROR",
            Status = StatusCodes.Status500InternalServerError,
            Detail = "An unexpected error occurred on the server. Please contact support with the trace identifier.",
            Instance = context.Request.Path
        };

        problemDetails.Extensions["code"] = "INTERNAL_SERVER_ERROR";
        problemDetails.Extensions["traceId"] = traceId;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        var json = JsonSerializer.Serialize(problemDetails, options);
        return context.Response.WriteAsync(json);
    }
}
