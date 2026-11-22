using AddisEats.Api.Services;
using AddisEats.Api.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<DeliveryOptions>(builder.Configuration.GetSection("Delivery"));

builder.Services.AddControllers();
builder.Services.AddScoped<IClock, SystemClock>();
builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();

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
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
