namespace AddisEats.Api.Controllers;

using AddisEats.Api.Common;
using AddisEats.Api.Models;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Tags("Auth")]
[Route("api/v1/auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Registers a new user account with a hashed password and returns public profile details.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        var result = _authService.Register(request);
        if (result.IsFailure)
        {
            return FailureProblem(result.Error);
        }

        return StatusCode(StatusCodes.Status201Created, result.Value);
    }

    /// <summary>
    /// Authenticates a user and issues a 15-minute JWT access token and a 14-day opaque refresh token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var result = _authService.Login(request);
        return result.IsFailure ? FailureProblem(result.Error) : Ok(result.Value);
    }

    /// <summary>
    /// Rotates a valid refresh token for a new access/refresh token pair, revoking the old token.
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public IActionResult Refresh([FromBody] RefreshRequest request)
    {
        var result = _authService.Refresh(request);
        return result.IsFailure ? FailureProblem(result.Error) : Ok(result.Value);
    }

    /// <summary>
    /// Revokes the supplied refresh token to end the refresh session.
    /// </summary>
    [HttpPost("logout")]
    [ProducesResponseType(typeof(LogoutResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        var result = _authService.Logout(request);
        return result.IsFailure ? FailureProblem(result.Error) : Ok(result.Value);
    }

    private ObjectResult FailureProblem(Error error)
    {
        var problemDetails = new ProblemDetails
        {
            Type = $"https://addiseats.et/errors/{error.Code.ToLowerInvariant().Replace('_', '-')}",
            Title = error.Code,
            Status = error.StatusCode,
            Detail = error.Message
        };

        return StatusCode(error.StatusCode, problemDetails);
    }
}
