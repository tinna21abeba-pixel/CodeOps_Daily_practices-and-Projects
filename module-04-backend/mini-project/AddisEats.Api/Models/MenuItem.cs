namespace AddisEats.Api.Models;

/// <summary>
/// Menu item entity with base and VAT-inclusive ETB pricing.
/// </summary>
public class MenuItem
{
    /// <summary>
    /// Unique identifier of the menu item.
    /// </summary>
    /// <example>101</example>
    public int Id { get; set; }

    /// <summary>
    /// Identifier of the restaurant offering this menu item.
    /// </summary>
    /// <example>1</example>
    public int RestaurantId { get; set; }

    /// <summary>
    /// Dish or beverage name.
    /// </summary>
    /// <example>Doro Wat</example>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Menu category name.
    /// </summary>
    /// <example>Traditional</example>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Base unit price in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>450.00</example>
    public decimal Price { get; set; }

    /// <summary>
    /// Unit price including 15% Ethiopian VAT in ETB.
    /// </summary>
    /// <example>517.50</example>
    public decimal PriceWithVat { get; set; }
}
