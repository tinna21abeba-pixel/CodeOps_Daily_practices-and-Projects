using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _restaurants = SeedData.Restaurants;

    public Restaurant? GetById(int id)
    {
        return _restaurants.FirstOrDefault(r => r.Id == id);
    }

    public IEnumerable<Restaurant> Search(string? area = null, int page = 1, int limit = 10)
    {
        var query = _restaurants.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(area))
        {
            query = query.Where(r => r.Area.Equals(area, StringComparison.OrdinalIgnoreCase));
        }

        if (page < 1)
        {
            page = 1;
        }

        if (limit < 1)
        {
            limit = 10;
        }

        return query
            .OrderBy(r => r.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();
    }
}
