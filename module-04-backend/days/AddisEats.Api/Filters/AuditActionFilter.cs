namespace AddisEats.Api.Filters;

using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc.Filters;

public class AuditActionFilter : IActionFilter
{
    private static readonly HashSet<string> SensitiveKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "authorization",
        "token",
        "apikey",
        "api_key",
        "x-api-key",
        "password",
        "secret",
        "customername",
        "customerphone",
        "deliveryaddress",
        "specialinstructions",
        "ownerphone",
        "phone",
        "address"
    };

    private readonly ILogger<AuditActionFilter> _logger;

    public AuditActionFilter(ILogger<AuditActionFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var actionName = context.ActionDescriptor.DisplayName;
        var sanitized = SanitizeArguments(context.ActionArguments);
        var argumentsJson = JsonSerializer.Serialize(sanitized);

        _logger.LogInformation(
            "Audit: Executing {ActionName} with arguments {ActionArguments}",
            actionName,
            argumentsJson);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }

    private static JsonObject SanitizeArguments(IDictionary<string, object?> actionArguments)
    {
        var root = new JsonObject();
        foreach (var (key, value) in actionArguments)
        {
            if (SensitiveKeys.Contains(key))
            {
                root[key] = value is null ? null : "[REDACTED]";
                continue;
            }

            var node = JsonSerializer.SerializeToNode(value);
            root[key] = SanitizeNode(node);
        }

        return root;
    }

    private static JsonNode? SanitizeNode(JsonNode? node)
    {
        if (node is JsonObject obj)
        {
            foreach (var key in obj.Select(kvp => kvp.Key).ToList())
            {
                if (SensitiveKeys.Contains(key))
                {
                    if (obj[key] is not null)
                    {
                        obj[key] = "[REDACTED]";
                    }
                }
                else
                {
                    obj[key] = SanitizeNode(obj[key]);
                }
            }

            return obj;
        }

        if (node is JsonArray array)
        {
            for (var i = 0; i < array.Count; i++)
            {
                array[i] = SanitizeNode(array[i]);
            }

            return array;
        }

        if (node is JsonValue val &&
            val.TryGetValue<string>(out var str) &&
            str.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return JsonValue.Create("[REDACTED]");
        }

        return node;
    }
}
