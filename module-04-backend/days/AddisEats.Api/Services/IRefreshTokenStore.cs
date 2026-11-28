namespace AddisEats.Api.Services;

using AddisEats.Api.Models;

public enum RefreshRotationStatus
{
    Success,
    NotFound,
    Revoked,
    ReuseDetected,
    Expired
}

public record RefreshRotationResult(
    RefreshRotationStatus Status,
    RefreshToken? ExistingToken = null);

public interface IRefreshTokenStore
{
    void Add(RefreshToken refreshToken);
    RefreshToken? GetByToken(string token);
    RefreshRotationResult TryRotate(string oldTokenValue, RefreshToken replacementToken, DateTime utcNow);
    bool TryRevoke(string tokenValue, DateTime utcNow, string reason, out bool wasAlreadyRevoked);
}
