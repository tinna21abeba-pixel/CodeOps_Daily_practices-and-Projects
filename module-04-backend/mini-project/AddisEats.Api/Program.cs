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

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));

builder.Services.AddControllers(options =>
    {
        options.Filters.Add<RejectUnknownQueryParamsFilter>();
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
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
