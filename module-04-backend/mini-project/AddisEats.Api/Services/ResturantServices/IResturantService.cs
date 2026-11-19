using AddisEats.Api.Models;

namespace AddisEats.Api.ResturantServices;

public interface IResturantService
{
    Resturant? GetById(int id);
    Resturant? GetRestuarantById(int id) => GetById(id);

    List<Resturant> GetAll(
        string? address,
        int page,
        int pageSize
    );

    List<Resturant> GetAll(
        string? address,
        int? page,
        int? pageSize
    ) => GetAll(address, page ?? 1, pageSize ?? 10);
}

public interface IRestuarantService : IResturantService
{
}