namespace AddisEats.Api.DTOs;

public record RestaurantDto(
    int Id,
    string Name,
    string Area,
    decimal DeliveryFeeEtb
);
