namespace AddisEats.Api.DTOs;

/// <summary>
/// Public summary of a partner restaurant in Addis Ababa.
/// </summary>
public record RestaurantDto
{
    /// <summary>
    /// Unique identifier of the restaurant.
    /// </summary>
    /// <example>1</example>
    public int Id { get; init; }

    /// <summary>
    /// Restaurant display name.
    /// </summary>
    /// <example>Yod Abyssinia</example>
    public string Name { get; init; }

    /// <summary>
    /// Addis Ababa neighborhood or sub-city where the restaurant is located.
    /// </summary>
    /// <example>Bole</example>
    public string Area { get; init; }

    /// <summary>
    /// Standard courier delivery fee in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>50.00</example>
    public decimal DeliveryFeeEtb { get; init; }

    public RestaurantDto(int id, string name, string area, decimal deliveryFeeEtb)
    {
        Id = id;
        Name = name;
        Area = area;
        DeliveryFeeEtb = deliveryFeeEtb;
    }
}
