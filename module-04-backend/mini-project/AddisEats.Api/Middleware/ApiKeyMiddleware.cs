namespace AddisEats.Api.Middleware;

public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ApiKeyMiddleware> _logger;

    public ApiKeyMiddleware(
        RequestDelegate next,
        IConfiguration configuration,
        ILogger<ApiKeyMiddleware> logger)
    {
        _next = next;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var expectedKey = _configuration["ApiKey"];

        var providedKey = context.Request.Headers["X-API-Key"]
            .FirstOrDefault();

        var fullPath = $"{context.Request.PathBase}{context.Request.Path}";

        if (string.IsNullOrWhiteSpace(expectedKey) ||
            providedKey != expectedKey)
        {
            _logger.LogWarning(
                "ApiKeyMiddleware short-circuited {Method} {Path} with 401 (invalid or missing X-API-Key).",
                context.Request.Method,
                fullPath);

            context.Response.StatusCode =
                StatusCodes.Status401Unauthorized;

            await context.Response.WriteAsJsonAsync(new
            {
                message = "Invalid or missing API key."
            });

            return;
        }

        _logger.LogInformation(
            "ApiKeyMiddleware verified X-API-Key for {Method} {Path}; forwarding to branch handler.",
            context.Request.Method,
            fullPath);

        await _next(context);
    }
}