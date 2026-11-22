namespace AddisEats.Api.DTOs;

public record MenuItemDto(
    int Id,
    string Name,
    string Category,
    decimal Price
);
