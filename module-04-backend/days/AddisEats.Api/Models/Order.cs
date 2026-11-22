namespace AddisEats.Api.Models;

public enum OrderStatus
{
    Pending,
    Preparing,
    Delivering,
    Delivered,
    Cancelled
}

public class Order
{
    public int Id { get; set; }
    public int RestaurantId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? SpecialInstructions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateOrderRequest
{
    public int RestaurantId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string? SpecialInstructions { get; set; }
}
