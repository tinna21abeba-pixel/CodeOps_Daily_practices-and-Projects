using  AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Mappers;

public static class RestuarantMapper
{
    public static decimal Add(decimal x, decimal y)
    {
        return x +y;
    }
    public static RestuarantDTO ToDTO(this Resturant restuarant) 
    {
        return new RestuarantDTO (
            restuarant.Id,
            restuarant.Name,
            restuarant.Address,
            resturaant.Phone,
            restuarant.IsAcitve


        );
    }
    
};

RestuarantDTO x=restuarant.ToDTO();
