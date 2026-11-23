using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public interface IRestaurantService
{
    IReadOnlyList<Restaurant> Search(RestaurantQuery query);
    IReadOnlyList<Restaurant> Search(string? area, int page, int limit);
    Restaurant? GetById(int id);
    int CountAll(string? area);
}
