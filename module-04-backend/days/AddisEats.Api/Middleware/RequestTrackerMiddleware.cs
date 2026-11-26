namespace AddisEats.Api.Middleware;

using AddisEats.Api.Services;

public class RequestTrackerMiddleware
{
    public const string TrackerItemKey = "MiddlewareTracker";
    private readonly RequestDelegate _next;

    public RequestTrackerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IScopedRequestTracker tracker)
    {
        if (context.Request.Query.TryGetValue("tag", out var tag))
        {
            tracker.Tag = tag.ToString();
        }

        context.Items[TrackerItemKey] = tracker;
        await _next(context);
    }
}
