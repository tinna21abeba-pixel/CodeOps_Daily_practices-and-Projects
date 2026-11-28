
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using AddisEats.Api.Filters;
using AddisEats.Api.MenuItemServices;
using AddisEats.Api.Middleware;
using AddisEats.Api.Models;
using AddisEats.Api.ResturantServices;
using AddisEats.Api.Services;
using AddisEats.Api.Services.MenuService;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Reflection;
using System.IO;
using Microsoft.OpenApi.Models;
using AddisEats.Api.Services.Auth;
using Microsoft.AspNetCore.Identity;



var builder= WebApplication.CreateBuilder(args);

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));

builder.Services.AddControllers(options =>
    {
        options.Filters.Add<RejectUnknownQueryParamsFilter>();
        options.Filters.Add<AuditActionFilter>();
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var traceId = Activity.Current?.Id ?? context.HttpContext.TraceIdentifier;
            var problemDetails = new ValidationProblemDetails(context.ModelState)
            {
                Type = "https://addiseats.et/errors/validation-failed",
                Title = "VALIDATION_FAILED",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more fields in your request are invalid. Please check your submission and try again.",
                Instance = context.HttpContext.Request.Path
            };

            problemDetails.Extensions["code"] = "VALIDATION_FAILED";
            problemDetails.Extensions["traceId"] = traceId;

            return new BadRequestObjectResult(problemDetails);
        };
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
builder.Services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IMenuItemService, MenuService>();
builder.Services.AddScoped<IResturantService, ResturantService>();
builder.Services.AddScoped<IRestuarantService, ResturantService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5173",
            "http://localhost:3000",
            "https://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Addis Eats API",
        Description = "REST API for Addis Eats restaurant discovery, menu browsing, server-priced order placement, and Ethiopian mobile payments.",
        TermsOfService = new Uri("https://addiseats.et/terms"),
        Contact = new OpenApiContact
        {
            Name = "Addis Eats Engineering",
            Email = "api@addiseats.et",
            Url = new Uri("https://addiseats.et")
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
});

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT key is missing.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.FromSeconds(30),

            NameClaimType = "name",
            RoleClaimType = "role"
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseMiddleware<RequestTimingMiddleware>();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("frontend");
//app.UseRateLimiter();
 app.UseAuthentication();
 app.UseAuthorization();

app.Map("/api/v1/partner", partnerApp =>
{
    partnerApp.UseMiddleware<ApiKeyMiddleware>();
    partnerApp.Run(async context =>
    {
        await context.Response.WriteAsJsonAsync(new
        {
            service = "AddisEats Partner Branch",
            status = "Authorized",
            correlationId = context.Items[CorrelationIdMiddleware.ItemKey],
            timestamp = DateTime.UtcNow
        });
    });
});


app.MapControllers();

app.Run();
