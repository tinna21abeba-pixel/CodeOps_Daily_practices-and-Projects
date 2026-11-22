using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Reflection;

namespace AddisEats.Api.Filters;

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
            var problemDetails = new ProblemDetails
            {
                Type = "https://addiseats.et/errors/validation",
                Title = "Unknown query parameter",
                Status = StatusCodes.Status400BadRequest,
                Detail = $"Unknown query parameter: '{string.Join("', '", unknownKeys)}'."
            };

            context.Result = new BadRequestObjectResult(problemDetails);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
