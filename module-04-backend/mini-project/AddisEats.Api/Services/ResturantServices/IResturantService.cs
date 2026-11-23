namespace AddisEats.Api.ResturantServices;

using AddisEats.Api.Common;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

public interface IResturantService : IRestaurantService
{
    Result<Restaurant> GetRestuarantById(int id) => GetById(id);

    List<Restaurant> GetAll(string? address, int? limit = 10, int? page = 1)
        => Search(address, page ?? 1, limit ?? 10).ToList();
}

public interface IRestuarantService : IResturantService
{
}
