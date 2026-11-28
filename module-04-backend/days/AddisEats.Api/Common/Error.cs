namespace AddisEats.Api.Common;

public record Error(string Code, string Message, int StatusCode = 400)
{
    public static readonly Error None = new(string.Empty, string.Empty, 200);

    public static Error ValidationFailed(string detail) =>
        new("VALIDATION_FAILED", detail, 400);

    public static Error UnknownQueryParameter(string detail) =>
        new("UNKNOWN_QUERY_PARAMETER", detail, 400);

    public static Error Unauthorized(string detail = "You must be signed in to perform this request.") =>
        new("UNAUTHORIZED", detail, 401);

    public static Error PaymentDeclined(string detail = "Your payment was declined by the provider. Please verify your balance and retry.") =>
        new("PAYMENT_DECLINED", detail, 402);

    public static Error PermissionDenied(string detail = "You do not have permission to perform this action.") =>
        new("PERMISSION_DENIED", detail, 403);

    public static Error RestaurantNotFound(int id) =>
        new("RESTAURANT_NOT_FOUND", $"The requested restaurant with ID {id} could not be found.", 404);

    public static Error OrderNotFound(int id) =>
        new("ORDER_NOT_FOUND", $"The requested order with ID {id} could not be found.", 404);

    public static Error OrderAlreadyDelivered(int id) =>
        new("ORDER_ALREADY_DELIVERED", $"Order {id} has already been delivered and can no longer be modified or cancelled.", 409);

    public static Error RestaurantClosed(string name) =>
        new("RESTAURANT_CLOSED", $"Restaurant '{name}' is currently closed. Please place your order during operating hours.", 409);

    public static Error AmountInvalid(string detail) =>
        new("AMOUNT_INVALID", detail, 422);

    public static Error MobileAlreadyRegistered(string detail = "An account with this Ethiopian mobile number already exists.") =>
        new("MOBILE_ALREADY_REGISTERED", detail, 409);

    public static Error InvalidRole(string detail = "Role must be Customer, Restaurant, or Courier.") =>
        new("INVALID_ROLE", detail, 400);

    public static Error InvalidCredentials(string detail = "Invalid mobile number or password.") =>
        new("INVALID_CREDENTIALS", detail, 401);

    public static Error InvalidRefreshToken(string detail = "The provided refresh token is invalid.") =>
        new("INVALID_REFRESH_TOKEN", detail, 401);

    public static Error RefreshTokenRevoked(string detail = "This refresh token has been revoked.") =>
        new("REFRESH_TOKEN_REVOKED", detail, 401);

    public static Error RefreshTokenReuseDetected(string detail = "Refresh token reuse detected. All active sessions have been revoked for security.") =>
        new("REFRESH_TOKEN_REUSE_DETECTED", detail, 401);

    public static Error RefreshTokenExpired(string detail = "This refresh token has expired. Please sign in again.") =>
        new("REFRESH_TOKEN_EXPIRED", detail, 401);
}
