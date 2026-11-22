using AddisEats.Api.Models;
using AddisEats.Api.MenuItemServices;
using AddisEats.Api.ResturantServices;
using AddisEats.Api.Services.MenuService;

var builder = WebApplication.CreateBuilder(args);

// Register configuration options
builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));

// Register services
builder.Services.AddControllers();

builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IMenuItemService, MenuService>();
builder.Services.AddScoped<IResturantService, ResturantService>();
builder.Services.AddScoped<IRestuarantService, ResturantService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var thePhoneNumber = builder.Configuration.GetValue<string>("data:contact:phone");
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
