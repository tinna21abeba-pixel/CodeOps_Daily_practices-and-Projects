namespace AddisEats.Api.Models;

public record PaymentResponse(string Provider, string Result);

public record HealthCheckResponse(DateTime FirstInstance, DateTime SecondInstance);

public record ConcurrencyCheckResponse(
    Guid MiddlewareInstanceId,
    Guid ControllerInstanceId,
    string? RequestedTag,
    string? TagOnEntry,
    string? TagAfterDelay);

public record ProtectedHealthResponse(string? User, bool Authenticated);
