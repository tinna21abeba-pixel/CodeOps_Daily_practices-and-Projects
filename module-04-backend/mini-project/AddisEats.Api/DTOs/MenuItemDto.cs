namespace AddisEats.Api.DTOs;

/// <summary>
/// Public representation of a restaurant menu item.
/// </summary>
public record MenuItemDto
{
    /// <summary>
    /// Unique identifier of the menu item.
    /// </summary>
    /// <example>101</example>
    public int Id { get; init; }

    /// <summary>
    /// Dish or beverage name.
    /// </summary>
    /// <example>Doro Wat</example>
    public string Name { get; init; }

    /// <summary>
    /// Menu category such as Traditional, Vegetarian, Meat, or Drinks.
    /// </summary>
    /// <example>Traditional</example>
    public string Category { get; init; }

    /// <summary>
    /// Unit price in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>450.00</example>
    public decimal Price { get; init; }

    public MenuItemDto(int id, string name, string category, decimal price)
    {
        Id = id;
        Name = name;
        Category = category;
        Price = price;
    }
}
