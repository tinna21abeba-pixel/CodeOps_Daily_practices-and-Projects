using AddisEats.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();
builder.Services.AddScoped<IClock, SystemClock>();

builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Build application
var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Start application
app.Run();