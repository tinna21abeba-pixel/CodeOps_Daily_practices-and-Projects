using AddisEats.Api.Models;

namespace AddisEats.Api.Services;

public interface IRestaurantService
{
    Restaurant? GetById(int id);
    IEnumerable<Restaurant> Search(RestaurantQuery query);
    IEnumerable<Restaurant> Search(string? area = null, int page = 1, int limit = 10);
}
