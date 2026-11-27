namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.Data;
using AddisEats.Api.Models;
using Microsoft.Extensions.Logging;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _all = SeedData.Restaurants;
    private readonly ILogger _logger;

    public RestaurantService(ILogger<RestaurantService> logger) : this((ILogger)logger)
    {
    }

    protected RestaurantService(ILogger logger)
    {
        _logger = logger;
    }

    public Result<Restaurant> GetById(int id)
    {
        _logger.LogDebug("Looking up restaurant {RestaurantId}", id);
        var found = _all.FirstOrDefault(r => r.Id == id);
        if (found is null)
        {
            _logger.LogWarning("Restaurant {RestaurantId} was not found", id);
            return Result<Restaurant>.Failure(Error.RestaurantNotFound(id));
        }

        return Result<Restaurant>.Success(found);
    }

    public IReadOnlyList<Restaurant> Search(RestaurantQuery query)
    {
        _logger.LogDebug(
            "Searching restaurants with Area {Area}, AreaCount {AreaCount}, MaxFeeEtb {MaxFeeEtb}, Page {Page}, Limit {Limit}",
            query.Area,
            query.Areas?.Count ?? 0,
            query.MaxFeeEtb,
            query.Page,
            query.Limit);

        var result = _all.Where(r => r.IsActive);

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
            result = result.Where(r => r.DeliveryFeeEtb <= query.MaxFeeEtb.Value);
        }

        int page = query.Page < 1 ? 1 : query.Page;
        int limit = query.Limit < 1 ? 20 : (query.Limit > 50 ? 50 : query.Limit);

        var matches = result
            .OrderBy(r => r.Name)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();

        _logger.LogDebug("Restaurant search returned {ResultCount} matches", matches.Count);
        return matches;
    }

    public IReadOnlyList<Restaurant> Search(string? area, int page, int limit)
    {
        return Search(new RestaurantQuery { Area = area, Page = page, Limit = limit });
    }

    public int CountAll(string? area)
    {
        _logger.LogDebug("Counting active restaurants for Area {Area}", area);
        return _all
            .Where(r => r.IsActive)
            .Count(r => area == null || r.Area.Equals(area, StringComparison.OrdinalIgnoreCase));
    }
}
