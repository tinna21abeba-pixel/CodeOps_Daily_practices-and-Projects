using AddisEats.Api.Auth;
using AddisEats.Api.Filters;
using AddisEats.Api.Middleware;
using AddisEats.Api.Models;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<DeliveryOptions>(builder.Configuration.GetSection("Delivery"));

builder.Services.AddControllers(options =>
    {
        options.Filters.Add<RejectUnknownQueryParamsFilter>();
        options.Filters.Add<AuditActionFilter>();
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var problemDetails = new ValidationProblemDetails(context.ModelState)
            {
                Type = "https://addiseats.et/errors/validation-failed",
                Title = "VALIDATION_FAILED",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more fields in your request are invalid. Please check your submission and try again."
            };
            return new BadRequestObjectResult(problemDetails);
        };
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddScoped<IClock, SystemClock>();
builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IScopedRequestTracker, ScopedRequestTracker>();

builder.Services.AddAuthentication("DemoBearer")
    .AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, DemoBearerAuthenticationHandler>("DemoBearer", null);
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Addis Eats API",
        Version = "v1",
        Description = "REST API for Addis Eats restaurant discovery, menu browsing, server-priced order placement, delivery configuration, and Ethiopian mobile payments."
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    options.IncludeXmlComments(xmlPath);
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

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<RequestTrackerMiddleware>();

app.Map("/admin", adminApp =>
{
    adminApp.UseMiddleware<ApiKeyMiddleware>();
    adminApp.Run(async context =>
    {
        await context.Response.WriteAsJsonAsync(new
        {
            Message = "Admin endpoint reached.",
            CorrelationId = context.TraceIdentifier
        });
    });
});

app.MapControllers();

app.Run();
