using AddisEats.Api.Models;
using AddisEats.Api.Data;

namespace AddisEats.Api.ResturantServices;

public class ResturantService : IResturantService, IRestuarantService
{
    private readonly List<Resturant> allResturants = SeedData.Resturants;

    public Resturant? GetById(int id)
    {
        return allResturants.FirstOrDefault(r => r.Id == id);
    }

    public Resturant? GetRestuarantById(int id)
    {
        return GetById(id);
    }

    public List<Resturant> GetAll(
        string? address,
        int page,
        int pageSize)
    {
        var restuarants = allResturants
            .Where(r => address == null || r.Address.Equals(address, StringComparison.OrdinalIgnoreCase))
            .OrderBy(r => r.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return restuarants;
    }

    public List<Resturant> GetAll(
        string? address,
        int? page,
        int? pageSize)
    {
        return GetAll(address, page ?? 1, pageSize ?? 10);
    }
}

public class RestuarantService : ResturantService
{
}