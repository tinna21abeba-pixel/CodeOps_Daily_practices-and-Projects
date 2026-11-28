namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.Models;

public interface IAuthService
{
    Result<UserResponse> Register(RegisterRequest request);
    Result<AuthTokenResponse> Login(LoginRequest request);
    Result<AuthTokenResponse> Refresh(RefreshRequest request);
    Result<LogoutResponse> Logout(LogoutRequest request);
}
