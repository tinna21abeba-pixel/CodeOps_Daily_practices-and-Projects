using AddisEats.Api.Models;
using AddisEats.Api.Services;

namespace AddisEats.Api.ResturantServices;

public interface IResturantService : IRestaurantService
{
    Restaurant? GetRestuarantById(int id) => GetById(id);

    List<Restaurant> GetAll(string? address, int? limit = 10, int? page = 1)
        => Search(address, page ?? 1, limit ?? 10).ToList();
}

public interface IRestuarantService : IResturantService
{
}
