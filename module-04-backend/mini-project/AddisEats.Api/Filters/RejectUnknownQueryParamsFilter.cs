namespace AddisEats.Api.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Diagnostics;
using System.Reflection;

public class RejectUnknownQueryParamsFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.HttpContext.Request.Query.Count == 0)
        {
            return;
        }

        var allowedKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (context.ActionDescriptor is ControllerActionDescriptor descriptor)
        {
            foreach (var parameter in descriptor.Parameters)
            {
                var paramType = parameter.ParameterType;
                if (paramType.IsClass && paramType != typeof(string))
                {
                    foreach (var prop in paramType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
                    {
                        allowedKeys.Add(prop.Name);
                    }
                }
                else
                {
                    allowedKeys.Add(parameter.Name);
                }
            }
        }

        var unknownKeys = context.HttpContext.Request.Query.Keys
            .Where(key => !allowedKeys.Contains(key))
            .ToList();

        if (unknownKeys.Count > 0)
        {
            var traceId = Activity.Current?.Id ?? context.HttpContext.TraceIdentifier;
            var problemDetails = new ProblemDetails
            {
                Type = "https://addiseats.et/errors/unknown-query-parameter",
                Title = "UNKNOWN_QUERY_PARAMETER",
                Status = StatusCodes.Status400BadRequest,
                Detail = $"One or more unrecognized query parameters were provided. Please verify spelling. Unknown: '{string.Join("', '", unknownKeys)}'.",
                Instance = context.HttpContext.Request.Path
            };

            problemDetails.Extensions["code"] = "UNKNOWN_QUERY_PARAMETER";
            problemDetails.Extensions["traceId"] = traceId;

            context.Result = new BadRequestObjectResult(problemDetails);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
