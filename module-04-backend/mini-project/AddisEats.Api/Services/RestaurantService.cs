using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _all = SeedData.Restaurants;

    public Restaurant? GetById(int id)
        => _all.FirstOrDefault(r => r.Id == id);

    public IReadOnlyList<Restaurant> Search(string? area, int page, int limit)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (limit < 1)
        {
            limit = 20;
        }

        return _all
            .Where(r => r.IsActive)
            .Where(r => area == null || r.Area.Equals(area, StringComparison.OrdinalIgnoreCase))
            .OrderBy(r => r.Name)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();
    }

    public int CountAll(string? area)
    {
        return _all
            .Where(r => r.IsActive)
            .Count(r => area == null || r.Area.Equals(area, StringComparison.OrdinalIgnoreCase));
    }
}
