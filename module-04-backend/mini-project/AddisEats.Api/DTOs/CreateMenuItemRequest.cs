namespace AddisEats.Api.DTOs;

public class CreateMenuItemRequest
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? PriceWithVat { get; set; }
}
