namespace AddisEats.Api.Filters;

using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Filters;

public class AuditActionFilter : IActionFilter
{
    private readonly ILogger<AuditActionFilter> _logger;

    public AuditActionFilter(ILogger<AuditActionFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var actionName = context.ActionDescriptor.DisplayName;
        var argumentsJson = JsonSerializer.Serialize(context.ActionArguments);

        _logger.LogInformation(
            "Audit: Executing {ActionName} with arguments {ActionArguments}",
            actionName,
            argumentsJson);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
