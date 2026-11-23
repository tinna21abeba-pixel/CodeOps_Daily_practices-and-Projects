namespace AddisEats.Api.Services;

using AddisEats.Api.Common;
using AddisEats.Api.Models;

public class OrderService : IOrderService
{
    private static readonly List<Order> _orders = new()
    {
        new Order
        {
            Id = 1,
            RestaurantId = 1,
            CustomerName = "Abebe Kebede",
            CustomerPhone = "+251911234567",
            DeliveryAddress = "Bole Road, House 102",
            IsDelivery = true,
            DeliveryFee = 50.00m,
            TotalAmount = 500.00m,
            Status = OrderStatus.Preparing,
            SpecialInstructions = null,
            CreatedAt = new DateTime(2026, 11, 22, 20, 0, 0, DateTimeKind.Utc),
            Items = new List<OrderItem>
            {
                new OrderItem { MenuItemId = 101, MenuItemName = "Doro Wat", UnitPrice = 450.00m, Quantity = 1 }
            }
        },
        new Order
        {
            Id = 2,
            RestaurantId = 2,
            CustomerName = "Tadesse Belay",
            CustomerPhone = "+251911234568",
            DeliveryAddress = "Kazanchis, House 204",
            IsDelivery = true,
            DeliveryFee = 60.00m,
            TotalAmount = 240.00m,
            Status = OrderStatus.Delivered,
            SpecialInstructions = null,
            CreatedAt = new DateTime(2026, 11, 22, 19, 0, 0, DateTimeKind.Utc),
            Items = new List<OrderItem>
            {
                new OrderItem { MenuItemId = 201, MenuItemName = "Shiro Tegabino", UnitPrice = 180.00m, Quantity = 1 }
            }
        }
    };

    private readonly IRestaurantService _restaurantService;

    public OrderService(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    public Result<Order> GetById(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order == null)
        {
            return Result<Order>.Failure(Error.OrderNotFound(id));
        }

        return Result<Order>.Success(order);
    }

    public IEnumerable<Order> GetAll()
    {
        return _orders;
    }

    public Result<Order> Place(CreateOrderRequest request)
    {
        var restaurantResult = _restaurantService.GetById(request.RestaurantId);
        if (restaurantResult.IsFailure)
        {
            return Result<Order>.Failure(restaurantResult.Error);
        }

        var restaurant = restaurantResult.Value!;

        if (!restaurant.IsActive || restaurant.Menu == null || restaurant.Menu.Count == 0)
        {
            return Result<Order>.Failure(Error.RestaurantClosed(restaurant.Name));
        }

        if (request.Items == null || request.Items.Count == 0)
        {
            return Result<Order>.Failure(Error.AmountInvalid("Order must contain at least one item."));
        }

        decimal itemsTotal = 0m;
        var orderItems = new List<OrderItem>();

        foreach (var itemReq in request.Items)
        {
            var menuItem = restaurant.Menu.FirstOrDefault(m => m.Id == itemReq.MenuItemId);
            if (menuItem == null)
            {
                return Result<Order>.Failure(Error.AmountInvalid($"Menu item with ID {itemReq.MenuItemId} does not belong to restaurant '{restaurant.Name}'."));
            }

            if (itemReq.Quantity <= 0)
            {
                return Result<Order>.Failure(Error.AmountInvalid("Item quantity must be greater than zero."));
            }

            itemsTotal += menuItem.Price * itemReq.Quantity;
            orderItems.Add(new OrderItem
            {
                MenuItemId = menuItem.Id,
                MenuItemName = menuItem.Name,
                UnitPrice = menuItem.Price,
                Quantity = itemReq.Quantity
            });
        }

        if (itemsTotal <= 0m)
        {
            return Result<Order>.Failure(Error.AmountInvalid("Calculated food total must be greater than zero ETB."));
        }

        decimal deliveryFee = request.IsDelivery ? restaurant.DeliveryFeeEtb : 0m;
        decimal tip = request.TipEtb ?? 0m;
        decimal totalEtb = itemsTotal + deliveryFee + tip;

        int nextId = _orders.Count > 0 ? _orders.Max(o => o.Id) + 1 : 1;
        var order = new Order
        {
            Id = nextId,
            RestaurantId = request.RestaurantId,
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            DeliveryAddress = request.DeliveryAddress,
            IsDelivery = request.IsDelivery,
            DeliveryFee = deliveryFee,
            TipEtb = request.TipEtb,
            Items = orderItems,
            TotalAmount = totalEtb,
            Status = OrderStatus.Pending,
            SpecialInstructions = request.SpecialInstructions,
            CreatedAt = DateTime.UtcNow
        };

        _orders.Add(order);
        return Result<Order>.Success(order);
    }

    public Result<Order> UpdateStatus(int id, OrderStatus status)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order == null)
        {
            return Result<Order>.Failure(Error.OrderNotFound(id));
        }

        if (order.Status == OrderStatus.Delivered && status == OrderStatus.Cancelled)
        {
            return Result<Order>.Failure(Error.OrderAlreadyDelivered(id));
        }

        order.Status = status;
        return Result<Order>.Success(order);
    }
}
