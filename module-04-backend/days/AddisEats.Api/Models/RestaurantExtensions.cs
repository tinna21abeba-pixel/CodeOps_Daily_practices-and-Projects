namespace AddisEats.Api.Models;

public static class RestaurantExtensions
{
    public static RestaurantDto ToDto(this Restaurant restaurant)
    {
        return new RestaurantDto(
            restaurant.Id,
            restaurant.Name,
            restaurant.Area,
            restaurant.Address,
            restaurant.Phone,
            restaurant.DeliveryFee
        );
    }
}
