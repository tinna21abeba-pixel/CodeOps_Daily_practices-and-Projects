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
        }
    };

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Order> GetById(int id)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<Order> Create([FromBody] CreateOrderRequest request)
    {
        if (request is null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        if (request.TotalAmount <= 0)
        {
            return BadRequest(new { message = "TotalAmount must be greater than zero." });
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
    [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public ActionResult<Order> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = _orders.FirstOrDefault(o => o.Id == id);
        if (order is null)
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
