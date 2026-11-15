using AddisEats.Api.MenuItemServices;
using AddisEats.Api.RestuarantService;


var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddControllers();

builder.Services.AddScoped<IMenuItemService, MenuItemService>();
builder.Services.AddScoped<IRestuarantService, RestuarantService>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


var thePhoneNumber=builder.Configuration.GetValue<string>("data:contact:phone");
Console.WriteLine(thePhoneNumber);
var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();