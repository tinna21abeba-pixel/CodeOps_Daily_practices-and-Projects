using AddisEats.Api.Data;
using AddisEats.Api.Models;
using Microsoft.Extensions.Logging;

namespace AddisEats.Api.Services;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _restaurants = SeedData.Restaurants;
    private readonly ILogger<RestaurantService> _logger;

    public RestaurantService(ILogger<RestaurantService> logger)
    {
        _logger = logger;
    }

    public Restaurant? GetById(int id)
    {
        _logger.LogDebug("Looking up restaurant {RestaurantId}", id);
        var restaurant = _restaurants.FirstOrDefault(r => r.Id == id);
        if (restaurant == null)
        {
            _logger.LogWarning("Restaurant {RestaurantId} was not found", id);
        }

        return restaurant;
    }

    public IEnumerable<Restaurant> Search(RestaurantQuery query)
    {
        _logger.LogDebug(
            "Searching restaurants with Area {Area}, MaxFeeEtb {MaxFeeEtb}, Page {Page}, Limit {Limit}",
            query.Area,
            query.MaxFeeEtb,
            query.Page,
            query.Limit);

        var result = _restaurants.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(query.Name))
        {
            result = result.Where(r => r.Name.Contains(query.Name, StringComparison.OrdinalIgnoreCase));
        }

        if (query.Areas != null && query.Areas.Count > 0)
        {
            result = result.Where(r => query.Areas.Any(a => r.Area.Equals(a, StringComparison.OrdinalIgnoreCase)));
        }
        else if (!string.IsNullOrWhiteSpace(query.Area))
        {
            result = result.Where(r => r.Area.Equals(query.Area, StringComparison.OrdinalIgnoreCase));
        }

        if (query.MaxFeeEtb.HasValue)
        {
            result = result.Where(r => r.DeliveryFee <= query.MaxFeeEtb.Value);
        }

        int page = query.Page < 1 ? 1 : query.Page;
        int limit = query.Limit;

        var matches = result
            .OrderBy(r => r.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();

        _logger.LogDebug("Restaurant search returned {ResultCount} matches", matches.Count);
        return matches;
    }

    public IEnumerable<Restaurant> Search(string? area = null, int page = 1, int limit = 10)
    {
        return Search(new RestaurantQuery { Area = area, Page = page, Limit = limit });
    }
}
