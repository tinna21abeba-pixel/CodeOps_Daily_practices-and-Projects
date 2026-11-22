namespace AddisEats.Api.Models;

public record RestaurantDto(
    int Id,
    string Name,
    string Area,
    string Address,
    string Phone,
    decimal DeliveryFee
);
