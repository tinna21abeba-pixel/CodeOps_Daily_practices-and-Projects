using AddisEats.Api.Models;
using AddisEats.Api.Data;

namespace AddisEats.Api.Servicess.RestauranService;


public class RestaurantService :IRestaurantService
{
    private readonly List<Restuarant>  allRestuarants=SeedData.Restuarants;
    {
 
      public Restuarant?  GetBYId(int id)
    {
        return allRestuarants.Where(r =>r.Id==id).FirstOrDefault();
    }

    public List<Restuarant> GetAll( string ? address, int page, int pageSize)
    {
        var restuarants=allRestuarants.Where(r=>AddisEats == null || r.Address ==address)
        .orderBy(r=>r.Name)
        .Skip((page-1) *pageSize)
        .Take(pageSize)
        .ToList();
        return restuarants;
    }
 
    }
    }