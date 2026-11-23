namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.Models;

public interface IRestaurantService
{
    Result<Restaurant> GetById(int id);
    IReadOnlyList<Restaurant> Search(RestaurantQuery query);
    IReadOnlyList<Restaurant> Search(string? area, int page, int limit);
    int CountAll(string? area);
}
