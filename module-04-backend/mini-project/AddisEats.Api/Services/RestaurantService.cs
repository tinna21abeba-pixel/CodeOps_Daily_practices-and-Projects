using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _all = SeedData.Restaurants;

    public Restaurant? GetById(int id)
        => _all.FirstOrDefault(r => r.Id == id);

    public IReadOnlyList<Restaurant> Search(RestaurantQuery query)
    {
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
        int limit = query.Limit < 1 ? 20 : query.Limit;

        return result
            .OrderBy(r => r.Name)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();
    }

    public IReadOnlyList<Restaurant> Search(string? area, int page, int limit)
    {
        return Search(new RestaurantQuery { Area = area, Page = page, Limit = limit });
    }

    public int CountAll(string? area)
    {
        return _all
            .Where(r => r.IsActive)
            .Count(r => area == null || r.Area.Equals(area, StringComparison.OrdinalIgnoreCase));
    }
}
