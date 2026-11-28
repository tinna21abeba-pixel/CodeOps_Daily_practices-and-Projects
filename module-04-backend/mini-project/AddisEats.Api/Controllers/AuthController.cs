using AddisEats.Api.DTOs.Auth;
using AddisEats.Api.Models;
using AddisEats.Api.Services.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<AppUser> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthController(
        IUserRepository userRepository,
        IPasswordHasher<AppUser> passwordHasher,
        IConfiguration configuration)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        var email = request.Email.Trim();

        if (_userRepository.GetByEmail(email) != null)
            return Conflict(new { message = "Email is already registered." });

        var user = new AppUser
        {
            Name = request.Name.Trim(),
            Email = email,
            Role = "Customer"
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        if (!_userRepository.TryAdd(user))
            return Conflict(new { message = "Email is already registered." });

        return Ok(new { message = "Registration successful." });
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var user = _userRepository.GetByEmail(request.Email);

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password." });

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid email or password." });

        var token = GenerateAccessToken(user);

        return Ok(token);
    }

    private AuthResponse GenerateAccessToken(AppUser user)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is missing.");

        var issuer = _configuration["Jwt:Issuer"]!;
        var audience = _configuration["Jwt:Audience"]!;

        var expires = DateTime.UtcNow.AddMinutes(15);

        var claims = new[]
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("jti", Guid.NewGuid().ToString()),
            new Claim("name", user.Name),
            new Claim("role", user.Role)
        };

        var signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            signingKey,
            SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        return new AuthResponse
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(jwt),
            ExpiresAtUtc = expires
        };
    }
}