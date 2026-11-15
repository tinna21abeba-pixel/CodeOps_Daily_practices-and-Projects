using AddisEats.Api.Models;
using AddisEats.Api.Data;


namespace AddisEats.Api.Servicess.RestauranService;



public interface IRestuarantService
{  
    Restuarant ?GetById(int id);
    List<Restuarant> GetAll( string ? address, int page, int pageSize);
    


   
}