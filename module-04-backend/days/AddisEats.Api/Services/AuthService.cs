namespace AddisEats.Api.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AddisEats.Api.Common;
using AddisEats.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly IUserStore _userStore;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IClock _clock;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserStore userStore,
        IRefreshTokenStore refreshTokenStore,
        IPasswordHasher<User> passwordHasher,
        IClock clock,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _userStore = userStore;
        _refreshTokenStore = refreshTokenStore;
        _passwordHasher = passwordHasher;
        _clock = clock;
        _configuration = configuration;
        _logger = logger;
    }

    public Result<UserResponse> Register(RegisterRequest request)
    {
        var role = ResolveRegistrableRole(request.Role);
        if (role is null)
        {
            return Result<UserResponse>.Failure(Error.InvalidRole());
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            Role = role,
            CreatedAtUtc = _clock.UtcNow
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        if (!_userStore.TryAdd(user))
        {
            _logger.LogWarning("Registration rejected: duplicate mobile number");
            return Result<UserResponse>.Failure(Error.MobileAlreadyRegistered());
        }

        _logger.LogInformation("Registered user {UserId} with role {Role}", user.Id, user.Role);
        return Result<UserResponse>.Success(new UserResponse(
            user.Id,
            user.Name,
            user.MobileNumber,
            user.Role,
            user.CreatedAtUtc));
    }

    public Result<AuthTokenResponse> Login(LoginRequest request)
    {
        var user = _userStore.GetByMobileNumber(request.MobileNumber);
        if (user is null)
        {
            _logger.LogWarning("Login failed: unknown mobile number");
            return Result<AuthTokenResponse>.Failure(Error.InvalidCredentials());
        }

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("Login failed for user {UserId}: invalid password", user.Id);
            return Result<AuthTokenResponse>.Failure(Error.InvalidCredentials());
        }

        if (verification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            _userStore.Update(user);
        }

        var now = _clock.UtcNow;
        var refreshToken = CreateRefreshTokenRecord(user.Id, now);
        _refreshTokenStore.Add(refreshToken);

        var response = CreateAuthTokenResponse(user, refreshToken, now);
        _logger.LogInformation("User {UserId} logged in with role {Role}", user.Id, user.Role);
        return Result<AuthTokenResponse>.Success(response);
    }

    public Result<AuthTokenResponse> Refresh(RefreshRequest request)
    {
        var presentedToken = request.RefreshToken.Trim();
        var existing = _refreshTokenStore.GetByToken(presentedToken);
        if (existing is null)
        {
            _logger.LogWarning("Refresh rejected: token not found");
            return Result<AuthTokenResponse>.Failure(Error.InvalidRefreshToken());
        }

        var user = _userStore.GetById(existing.UserId);
        if (user is null)
        {
            _logger.LogWarning("Refresh rejected: user {UserId} not found", existing.UserId);
            return Result<AuthTokenResponse>.Failure(Error.InvalidRefreshToken());
        }

        var now = _clock.UtcNow;
        var replacement = CreateRefreshTokenRecord(user.Id, now);
        var rotation = _refreshTokenStore.TryRotate(presentedToken, replacement, now);

        switch (rotation.Status)
        {
            case RefreshRotationStatus.NotFound:
                return Result<AuthTokenResponse>.Failure(Error.InvalidRefreshToken());
            case RefreshRotationStatus.ReuseDetected:
                _logger.LogWarning(
                    "Refresh token reuse detected for user {UserId}; revoked all active refresh tokens",
                    existing.UserId);
                return Result<AuthTokenResponse>.Failure(Error.RefreshTokenReuseDetected());
            case RefreshRotationStatus.Revoked:
                _logger.LogWarning("Refresh rejected: token for user {UserId} was already revoked", existing.UserId);
                return Result<AuthTokenResponse>.Failure(Error.RefreshTokenRevoked());
            case RefreshRotationStatus.Expired:
                _logger.LogWarning("Refresh rejected: token for user {UserId} is expired", existing.UserId);
                return Result<AuthTokenResponse>.Failure(Error.RefreshTokenExpired());
            case RefreshRotationStatus.Success:
                _logger.LogInformation(
                    "Rotated refresh token {OldTokenId} -> {NewTokenId} for user {UserId}",
                    rotation.ExistingToken!.Id,
                    replacement.Id,
                    user.Id);
                return Result<AuthTokenResponse>.Success(CreateAuthTokenResponse(user, replacement, now));
            default:
                return Result<AuthTokenResponse>.Failure(Error.InvalidRefreshToken());
        }
    }

    public Result<LogoutResponse> Logout(LogoutRequest request)
    {
        var presentedToken = request.RefreshToken.Trim();
        var found = _refreshTokenStore.TryRevoke(presentedToken, _clock.UtcNow, "User logout", out var wasAlreadyRevoked);
        if (!found)
        {
            _logger.LogWarning("Logout rejected: refresh token not found");
            return Result<LogoutResponse>.Failure(Error.InvalidRefreshToken());
        }

        _logger.LogInformation(
            "Refresh token revoked on logout (alreadyRevoked={AlreadyRevoked})",
            wasAlreadyRevoked);

        return Result<LogoutResponse>.Success(new LogoutResponse("Logged out successfully. Refresh token revoked."));
    }

    private static string? ResolveRegistrableRole(string? requestedRole)
    {
        if (string.IsNullOrWhiteSpace(requestedRole))
        {
            return UserRoles.Customer;
        }

        return UserRoles.SelfRegistrable.FirstOrDefault(
            r => string.Equals(r, requestedRole.Trim(), StringComparison.OrdinalIgnoreCase));
    }

    private RefreshToken CreateRefreshTokenRecord(int userId, DateTime now)
    {
        var refreshDays = _configuration.GetValue<int?>("Jwt:RefreshTokenDays") ?? 14;
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        var opaqueToken = Base64UrlEncoder.Encode(randomBytes);

        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = opaqueToken,
            UserId = userId,
            CreatedAtUtc = now,
            ExpiresAtUtc = now.AddDays(refreshDays)
        };
    }

    private AuthTokenResponse CreateAuthTokenResponse(User user, RefreshToken refreshToken, DateTime now)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is missing.");
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer is missing.");
        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience is missing.");
        var accessMinutes = _configuration.GetValue<int?>("Jwt:AccessTokenMinutes") ?? 15;

        var accessExpires = now.AddMinutes(accessMinutes);
        var issuedAtUnix = EpochTime.GetIntDate(now);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, issuedAtUnix.ToString(), ClaimValueTypes.Integer64),
            new Claim("name", user.Name),
            new Claim("phone_number", user.MobileNumber),
            new Claim("role", user.Role)
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: now,
            expires: accessExpires,
            signingCredentials: credentials);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);

        return new AuthTokenResponse(
            AccessToken: accessToken,
            TokenType: "Bearer",
            ExpiresInSeconds: accessMinutes * 60,
            AccessTokenExpiresAtUtc: accessExpires,
            RefreshToken: refreshToken.Token,
            RefreshTokenExpiresAtUtc: refreshToken.ExpiresAtUtc);
    }
}
