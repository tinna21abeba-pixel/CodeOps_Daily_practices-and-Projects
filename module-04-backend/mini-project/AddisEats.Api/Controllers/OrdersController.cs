namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
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
    [ProducesResponseType(typeof(IEnumerable<Order>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_orderService.GetAll());
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<Order> GetById(int id)
    {
        var result = _orderService.GetById(id);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public IActionResult Create([FromBody] CreateOrderRequest request)
    {
        var result = _orderService.Place(request);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        var order = result.Value!;
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = _orderService.UpdateStatus(id, request.Status);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!);
    }

    [HttpGet("admin")]
    [ProducesResponseType(typeof(IEnumerable<Order>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
    public IActionResult GetAdminOrders([FromHeader(Name = "Authorization")] string? authorization)
    {
        if (string.IsNullOrWhiteSpace(authorization))
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, Error.Unauthorized());
        }

        if (!authorization.Contains("AdminToken", StringComparison.OrdinalIgnoreCase))
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, Error.PermissionDenied());
        }

        return Ok(_orderService.GetAll());
    }
}
