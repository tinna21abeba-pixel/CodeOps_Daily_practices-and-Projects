using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Mappers;

public static class ResturantMapper
{
    public static ResturantDTO ToDTO(this Resturant resturant)
    {
        return new ResturantDTO(
            resturant.Id,
            resturant.Name,
            resturant.Address,
            resturant.Phone,
            resturant.IsAcitve
        );
    }

    public static ResturantDTO ToDTOs(this Resturant resturant)
    {
        return resturant.ToDTO();
    }
}