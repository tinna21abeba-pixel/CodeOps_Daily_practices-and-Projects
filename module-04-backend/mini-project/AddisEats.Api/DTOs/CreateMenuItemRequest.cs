namespace AddisEats.Api.DTOs;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

/// <summary>
/// Request payload to create a new menu item.
/// </summary>
public class CreateMenuItemRequest
{
    /// <summary>
    /// Optional explicit identifier for the menu item.
    /// </summary>
    /// <example>107</example>
    public int? Id { get; set; }

    /// <summary>
    /// Dish or drink name (2 to 100 characters).
    /// </summary>
    /// <example>Special Kitfo</example>
    [Required(ErrorMessage = "Item name is required.")]
    [StringLength(100, ErrorMessage = "Item name cannot exceed 100 characters.")]
    [MinLength(2, ErrorMessage = "Item name must be at least 2 characters long.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Menu category (up to 50 characters).
    /// </summary>
    /// <example>Traditional</example>
    [Required(ErrorMessage = "Category is required.")]
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Base unit price in Ethiopian Birr (ETB), positive with up to 2 decimal places.
    /// </summary>
    /// <example>380.00</example>
    [Required(ErrorMessage = "Price is required.")]
    [EtbAmount(ErrorMessage = "Price must be a positive ETB amount with at most two decimal places.")]
    public decimal Price { get; set; }

    /// <summary>
    /// Optional VAT-inclusive price in ETB; computed as Price * 1.15 when omitted.
    /// </summary>
    /// <example>437.00</example>
    public decimal? PriceWithVat { get; set; }
}
