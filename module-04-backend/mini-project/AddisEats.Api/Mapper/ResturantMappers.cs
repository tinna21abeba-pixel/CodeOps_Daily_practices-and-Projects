using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Mappers;

public static class RestaurantMapping
{
    public static RestaurantDto ToDto(this Restaurant r)
        => new RestaurantDto(r.Id, r.Name, r.Area, r.DeliveryFeeEtb);

    public static MenuItemDto ToDto(this MenuItem m)
        => new MenuItemDto(m.Id, m.Name, m.Category, m.Price);
}

public static class ResturantMapper
{
    public static ResturantDTO ToDTO(this Restaurant resturant)
    {
        return new ResturantDTO(
            resturant.Id,
            resturant.Name,
            resturant.Address,
            resturant.Phone,
            resturant.IsAcitve
        );
    }

    public static ResturantDTO ToDTOs(this Restaurant resturant)
    {
        return resturant.ToDTO();
    }
}
