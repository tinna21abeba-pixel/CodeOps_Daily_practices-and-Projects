namespace AddisEats.Api.ResturantServices;

using AddisEats.Api.Services;
using Microsoft.Extensions.Logging;

public class ResturantService : RestaurantService, IResturantService, IRestuarantService
{
    public ResturantService(ILogger<ResturantService> logger) : base(logger)
    {
    }
}
