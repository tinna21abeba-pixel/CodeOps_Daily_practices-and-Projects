namespace AddisEats.Api.DTOs;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

public class CreateMenuItemRequest
{
    public int? Id { get; set; }

    [Required(ErrorMessage = "Item name is required.")]
    [StringLength(100, ErrorMessage = "Item name cannot exceed 100 characters.")]
    [MinLength(2, ErrorMessage = "Item name must be at least 2 characters long.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters.")]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required.")]
    [EtbAmount(ErrorMessage = "Price must be a positive ETB amount with at most two decimal places.")]
    public decimal Price { get; set; }

    public decimal? PriceWithVat { get; set; }
}
