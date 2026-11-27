namespace AddisEats.Api.Filters;

using AddisEats.Api.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;

public class AuditActionFilter : IAsyncActionFilter
{
    private readonly ILogger<AuditActionFilter> _logger;

    public AuditActionFilter(ILogger<AuditActionFilter> logger)
    {
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var descriptor = context.ActionDescriptor as ControllerActionDescriptor;
        var actionName = descriptor is not null
            ? $"{descriptor.ControllerName}.{descriptor.ActionName}"
            : context.ActionDescriptor.DisplayName ?? "UnknownAction";

        var method = context.HttpContext.Request.Method;
        var path = context.HttpContext.Request.Path;
        var correlationId = context.HttpContext.Items[CorrelationIdMiddleware.ItemKey]?.ToString()
            ?? context.HttpContext.TraceIdentifier;
        var parameterNames = context.ActionArguments.Count > 0
            ? string.Join(", ", context.ActionArguments.Keys)
            : "none";

        _logger.LogInformation(
            "Audit [START]: {Action} | {Method} {Path} | Params: [{Params}] | CorrelationId: {CorrelationId}",
            actionName,
            method,
            path,
            parameterNames,
            correlationId);

        var executed = await next();

        if (executed.Exception is not null && !executed.ExceptionHandled)
        {
            _logger.LogWarning(
                "Audit [EXCEPTION]: {Action} | {Method} {Path} | Exception: {ExceptionType} | CorrelationId: {CorrelationId}",
                actionName,
                method,
                path,
                executed.Exception.GetType().Name,
                correlationId);
            return;
        }

        var statusCode = executed.Result switch
        {
            IStatusCodeActionResult statusResult when statusResult.StatusCode.HasValue => statusResult.StatusCode.Value,
            ObjectResult objectResult when objectResult.StatusCode.HasValue => objectResult.StatusCode.Value,
            _ => context.HttpContext.Response.StatusCode
        };

        _logger.LogInformation(
            "Audit [END]: {Action} | {Method} {Path} | Status: {StatusCode} | CorrelationId: {CorrelationId}",
            actionName,
            method,
            path,
            statusCode,
            correlationId);
    }
}
