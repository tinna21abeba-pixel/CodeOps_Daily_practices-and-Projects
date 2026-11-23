namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

[ApiController]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_orderService.GetAll());
    }

    [HttpGet("{id:int}")]
    public ActionResult<Order> GetById(int id)
    {
        var order = _orderService.GetById(id);
        if (order == null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/not-found",
                Title = "Order Not Found",
                Status = StatusCodes.Status404NotFound,
                Detail = $"The requested order with ID {id} could not be found."
            });
        }

        return Ok(order);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateOrderRequest request)
    {
        var result = _orderService.Place(request);
        if (result.IsFailure)
        {
            var problemDetails = new ProblemDetails
            {
                Type = $"https://addiseats.et/errors/{result.Error.Code.ToLowerInvariant().Replace('_', '-')}",
                Title = result.Error.Code,
                Status = result.Error.StatusCode,
                Detail = result.Error.Message
            };

            return StatusCode(result.Error.StatusCode, problemDetails);
        }

        var order = result.Value!;
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPatch("{id:int}/status")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = _orderService.UpdateStatus(id, request.Status);
        if (result.IsFailure)
        {
            var problemDetails = new ProblemDetails
            {
                Type = $"https://addiseats.et/errors/{result.Error.Code.ToLowerInvariant().Replace('_', '-')}",
                Title = result.Error.Code,
                Status = result.Error.StatusCode,
                Detail = result.Error.Message
            };

            return StatusCode(result.Error.StatusCode, problemDetails);
        }

        return Ok(result.Value);
    }

    [HttpGet("admin")]
    public IActionResult GetAdminOrders([FromHeader(Name = "Authorization")] string? authorization)
    {
        if (string.IsNullOrWhiteSpace(authorization))
        {
            return StatusCode(StatusCodes.Status401Unauthorized, new ProblemDetails
            {
                Type = "https://addiseats.et/errors/unauthorized",
                Title = "UNAUTHORIZED",
                Status = StatusCodes.Status401Unauthorized,
                Detail = "You must be signed in to perform this request."
            });
        }

        if (!authorization.Contains("AdminToken", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails
            {
                Type = "https://addiseats.et/errors/forbidden",
                Title = "PERMISSION_DENIED",
                Status = StatusCodes.Status403Forbidden,
                Detail = "You do not have permission to perform this action."
            });
        }

        return Ok(_orderService.GetAll());
    }
}
