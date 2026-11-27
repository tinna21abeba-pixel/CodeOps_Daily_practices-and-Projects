namespace AddisEats.Api.Models;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

public enum OrderStatus
{
    Pending,
    Preparing,
    Delivering,
    Delivered,
    Cancelled
}

public class OrderItem
{
    public int MenuItemId { get; set; }
    public string MenuItemName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class OrderItemRequest
{
    /// <summary>
    /// Identifier of the menu item to order.
    /// </summary>
    /// <example>101</example>
    [Required(ErrorMessage = "Menu item ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Menu item ID must be a positive integer.")]
    public int MenuItemId { get; set; }

    /// <summary>
    /// Quantity of this menu item (1 to 100).
    /// </summary>
    /// <example>2</example>
    [Required(ErrorMessage = "Quantity is required.")]
    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100 items.")]
    public int Quantity { get; set; } = 1;
}

public class Order
{
    public int Id { get; set; }
    public int RestaurantId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? DeliveryAddress { get; set; }
    public bool IsDelivery { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal DeliveryFee { get; set; }
    public decimal? TipEtb { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? SpecialInstructions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateOrderRequest : IValidatableObject
{
    /// <summary>
    /// Identifier of the restaurant receiving the order.
    /// </summary>
    /// <example>1</example>
    [Required(ErrorMessage = "Restaurant ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Restaurant ID must be greater than zero.")]
    public int RestaurantId { get; set; }

    /// <summary>
    /// Full name of the customer placing the order.
    /// </summary>
    /// <example>Abebe Kebede</example>
    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, ErrorMessage = "Customer name cannot exceed 100 characters.")]
    [MinLength(2, ErrorMessage = "Customer name must be at least 2 characters long.")]
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Customer mobile phone number in Ethiopian format (09..., 07..., +2519..., or +2517...).
    /// </summary>
    /// <example>+251911234567</example>
    [Required(ErrorMessage = "Customer mobile phone number is required.")]
    [EthiopianMobile(ErrorMessage = "Customer phone must be a valid Ethiopian mobile number (09..., 07..., or +251...).")]
    public string CustomerPhone { get; set; } = string.Empty;

    /// <summary>
    /// Whether the order requires courier delivery (true) or pickup (false).
    /// </summary>
    /// <example>true</example>
    public bool IsDelivery { get; set; } = true;

    /// <summary>
    /// Street delivery address; required when IsDelivery is true.
    /// </summary>
    /// <example>Cameroon St, Bole, Addis Ababa</example>
    [StringLength(200, ErrorMessage = "Delivery address cannot exceed 200 characters.")]
    public string? DeliveryAddress { get; set; }

    /// <summary>
    /// Optional preparation or delivery instructions.
    /// </summary>
    /// <example>Please call upon arrival at the main gate</example>
    [StringLength(500, ErrorMessage = "Special instructions cannot exceed 500 characters.")]
    public string? SpecialInstructions { get; set; }

    /// <summary>
    /// Optional courier tip in ETB (positive, at most two decimal places).
    /// </summary>
    /// <example>50.00</example>
    [EtbAmount(ErrorMessage = "Tip amount must be positive with at most two decimal places.")]
    public decimal? TipEtb { get; set; }

    /// <summary>
    /// Non-empty list of menu items and quantities to order.
    /// </summary>
    [Required(ErrorMessage = "Order items list is required.")]
    [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
    public List<OrderItemRequest> Items { get; set; } = new();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (IsDelivery && string.IsNullOrWhiteSpace(DeliveryAddress))
        {
            yield return new ValidationResult(
                "Delivery address is required when delivery is requested.",
                new[] { nameof(DeliveryAddress) });
        }
    }
}

public class UpdateOrderStatusRequest
{
    [Required(ErrorMessage = "Order status is required.")]
    public OrderStatus Status { get; set; }
}
