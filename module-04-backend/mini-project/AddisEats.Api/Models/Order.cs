namespace AddisEats.Api.Models;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

/// <summary>
/// Lifecycle status of a customer order.
/// </summary>
public enum OrderStatus
{
    Pending,
    Preparing,
    Delivering,
    Delivered,
    Cancelled
}

/// <summary>
/// Priced line item recorded inside a placed order.
/// </summary>
public class OrderItem
{
    /// <summary>
    /// Identifier of the ordered menu item.
    /// </summary>
    /// <example>101</example>
    public int MenuItemId { get; set; }

    /// <summary>
    /// Name of the ordered dish or drink.
    /// </summary>
    /// <example>Doro Wat</example>
    public string MenuItemName { get; set; } = string.Empty;

    /// <summary>
    /// Server-authoritative unit price in ETB at order placement time.
    /// </summary>
    /// <example>450.00</example>
    public decimal UnitPrice { get; set; }

    /// <summary>
    /// Number of portions ordered.
    /// </summary>
    /// <example>1</example>
    public int Quantity { get; set; }
}

/// <summary>
/// Requested menu item and quantity inside a new order payload.
/// </summary>
public class OrderItemRequest
{
    /// <summary>
    /// Identifier of the menu item to order.
    /// </summary>
    /// <example>101</example>
    [Required(ErrorMessage = "Menu item ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Menu item ID must be greater than zero.")]
    public int MenuItemId { get; set; }

    /// <summary>
    /// Quantity to order (1 to 100).
    /// </summary>
    /// <example>2</example>
    [Required(ErrorMessage = "Quantity is required.")]
    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100 items.")]
    public int Quantity { get; set; } = 1;
}

/// <summary>
/// Customer order resource with server-computed ETB pricing.
/// </summary>
public class Order
{
    /// <summary>
    /// Unique identifier of the order.
    /// </summary>
    /// <example>1</example>
    public int Id { get; set; }

    /// <summary>
    /// Identifier of the fulfilling restaurant.
    /// </summary>
    /// <example>1</example>
    public int RestaurantId { get; set; }

    /// <summary>
    /// Full name of the customer who placed the order.
    /// </summary>
    /// <example>Abebe Kebede</example>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Customer mobile phone number in Ethiopian format.
    /// </summary>
    /// <example>+251911234567</example>
    public string CustomerPhone { get; set; } = string.Empty;

    /// <summary>
    /// Addis Ababa street address for courier delivery, when applicable.
    /// </summary>
    /// <example>Cameroon St, Bole, Addis Ababa</example>
    public string? DeliveryAddress { get; set; }

    /// <summary>
    /// True for courier delivery; false for customer pickup.
    /// </summary>
    /// <example>true</example>
    public bool IsDelivery { get; set; }

    /// <summary>
    /// Line items included in the order.
    /// </summary>
    public List<OrderItem> Items { get; set; } = new();

    /// <summary>
    /// Server-calculated courier delivery fee in ETB.
    /// </summary>
    /// <example>50.00</example>
    public decimal DeliveryFee { get; set; }

    /// <summary>
    /// Optional courier tip in ETB.
    /// </summary>
    /// <example>50.00</example>
    public decimal? TipEtb { get; set; }

    /// <summary>
    /// Authoritative server-calculated grand total in ETB.
    /// </summary>
    /// <example>550.00</example>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Current lifecycle status of the order.
    /// </summary>
    /// <example>Pending</example>
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    /// <summary>
    /// Optional preparation or delivery note from the customer.
    /// </summary>
    /// <example>Please call upon arrival at Bole Medhanialem gate</example>
    public string? SpecialInstructions { get; set; }

    /// <summary>
    /// UTC timestamp when the order was created.
    /// </summary>
    /// <example>2026-11-27T09:30:00Z</example>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Request payload to place a new order with server-authoritative pricing.
/// </summary>
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
    /// Street delivery address in Addis Ababa; required when IsDelivery is true.
    /// </summary>
    /// <example>Cameroon St, Bole, Addis Ababa</example>
    [StringLength(200, ErrorMessage = "Delivery address cannot exceed 200 characters.")]
    public string? DeliveryAddress { get; set; }

    /// <summary>
    /// Optional preparation or gate delivery instructions.
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

/// <summary>
/// Request payload to transition an order's lifecycle status.
/// </summary>
public class UpdateOrderStatusRequest
{
    /// <summary>
    /// Target order status value.
    /// </summary>
    /// <example>Preparing</example>
    [Required(ErrorMessage = "Order status is required.")]
    public OrderStatus Status { get; set; }
}
