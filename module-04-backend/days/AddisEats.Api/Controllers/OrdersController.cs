using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private static readonly List<Order> _orders = new()
    {
        new Order
        {
            Id = 1,
            RestaurantId = 1,
            CustomerName = "Abebe Kebede",
            TotalAmount = 450.00m,
            Status = OrderStatus.Preparing,
            SpecialInstructions = null,
            CreatedAt = new DateTime(2026, 11, 22, 20, 0, 0, DateTimeKind.Utc)
        },
        new Order
        {
            Id = 2,
            RestaurantId = 2,
            CustomerName = "Tadesse Belay",
            TotalAmount = 380.00m,
            Status = OrderStatus.Delivered,
            SpecialInstructions = null,
            CreatedAt = new DateTime(2026, 11, 22, 19, 0, 0, DateTimeKind.Utc)
        }
    };

    [HttpGet("{id:int}")]
    public ActionResult<Order> GetById(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateOrderRequest request)
    {
        if (request.TotalAmount <= 0)
        {
            return UnprocessableEntity(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/validation",
                Title = "Invalid order amount",
                Status = StatusCodes.Status422UnprocessableEntity,
                Detail = "Order total amount must be a positive ETB amount."
            });
        }

        int nextId = _orders.Count > 0 ? _orders.Max(o => o.Id) + 1 : 1;
        var order = new Order
        {
            Id = nextId,
            RestaurantId = request.RestaurantId,
            CustomerName = request.CustomerName,
            TotalAmount = request.TotalAmount,
            Status = OrderStatus.Pending,
            SpecialInstructions = request.SpecialInstructions,
            CreatedAt = DateTime.UtcNow
        };

        _orders.Add(order);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPatch("{id:int}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order == null)
        {
            return NotFound();
        }

        if (order.Status == OrderStatus.Delivered && request.Status == OrderStatus.Cancelled)
        {
            return Conflict(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/conflict",
                Title = "Cannot cancel delivered order",
                Status = StatusCodes.Status409Conflict,
                Detail = "This order has already been delivered and can no longer be modified or cancelled."
            });
        }

        order.Status = request.Status;
        return Ok(order);
    }
}
