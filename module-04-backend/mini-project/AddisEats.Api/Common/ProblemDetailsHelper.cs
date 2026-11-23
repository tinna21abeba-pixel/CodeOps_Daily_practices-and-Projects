namespace AddisEats.Api.Common;

using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

public static class ProblemDetailsHelper
{
    public static ObjectResult CreateProblemResult(HttpContext context, Error error)
    {
        var traceId = Activity.Current?.Id ?? context.TraceIdentifier;
        var problemDetails = new ProblemDetails
        {
            Type = $"https://addiseats.et/errors/{error.Code.ToLowerInvariant().Replace('_', '-')}",
            Title = error.Code,
            Status = error.StatusCode,
            Detail = error.Message,
            Instance = context.Request.Path
        };

        problemDetails.Extensions["code"] = error.Code;
        problemDetails.Extensions["traceId"] = traceId;

        return new ObjectResult(problemDetails)
        {
            StatusCode = error.StatusCode
        };
    }
}
