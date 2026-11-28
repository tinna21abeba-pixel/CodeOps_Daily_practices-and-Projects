namespace AddisEats.Api.Services;

using AddisEats.Api.Models;

public class InMemoryRefreshTokenStore : IRefreshTokenStore
{
    private readonly object _gate = new();
    private readonly Dictionary<string, RefreshToken> _tokens = new(StringComparer.Ordinal);

    public void Add(RefreshToken refreshToken)
    {
        lock (_gate)
        {
            _tokens[refreshToken.Token] = refreshToken;
        }
    }

    public RefreshToken? GetByToken(string token)
    {
        lock (_gate)
        {
            return _tokens.TryGetValue(token, out var record) ? record : null;
        }
    }

    public RefreshRotationResult TryRotate(string oldTokenValue, RefreshToken replacementToken, DateTime utcNow)
    {
        lock (_gate)
        {
            if (!_tokens.TryGetValue(oldTokenValue, out var existing))
            {
                return new RefreshRotationResult(RefreshRotationStatus.NotFound);
            }

            if (existing.IsRevoked)
            {
                if (!string.IsNullOrEmpty(existing.ReplacedBy))
                {
                    RevokeAllForUserUnsafe(existing.UserId, utcNow, "Reuse of rotated refresh token detected");
                    return new RefreshRotationResult(RefreshRotationStatus.ReuseDetected, existing);
                }

                return new RefreshRotationResult(RefreshRotationStatus.Revoked, existing);
            }

            if (existing.IsExpired(utcNow))
            {
                return new RefreshRotationResult(RefreshRotationStatus.Expired, existing);
            }

            existing.RevokedAtUtc = utcNow;
            existing.RevokedReason = "Rotated";
            existing.ReplacedBy = replacementToken.Token;

            _tokens[replacementToken.Token] = replacementToken;
            return new RefreshRotationResult(RefreshRotationStatus.Success, existing);
        }
    }

    public bool TryRevoke(string tokenValue, DateTime utcNow, string reason, out bool wasAlreadyRevoked)
    {
        lock (_gate)
        {
            if (!_tokens.TryGetValue(tokenValue, out var existing))
            {
                wasAlreadyRevoked = false;
                return false;
            }

            wasAlreadyRevoked = existing.IsRevoked;
            if (!existing.IsRevoked)
            {
                existing.RevokedAtUtc = utcNow;
                existing.RevokedReason = reason;
            }

            return true;
        }
    }

    private void RevokeAllForUserUnsafe(int userId, DateTime utcNow, string reason)
    {
        foreach (var token in _tokens.Values)
        {
            if (token.UserId == userId && !token.IsRevoked)
            {
                token.RevokedAtUtc = utcNow;
                token.RevokedReason = reason;
            }
        }
    }
}
