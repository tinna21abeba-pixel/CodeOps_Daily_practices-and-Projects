namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

/// <summary>
/// Places, queries, and transitions customer food orders.
/// </summary>
[ApiController]
[Tags("Orders")]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Lists all orders currently recorded in the system.
    /// </summary>
    /// <returns>The full collection of orders.</returns>
    /// <response code="200">Returns the list of orders.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Order>), StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
        return Ok(_orderService.GetAll());
    }

    /// <summary>
    /// Retrieves a single order by its numeric identifier.
    /// </summary>
    /// <param name="id">Unique order identifier.</param>
    /// <returns>The matching order details.</returns>
    /// <response code="200">Order found and returned.</response>
    /// <response code="404">No order exists with the specified ID.</response>
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

    /// <summary>
    /// Places a new customer order with server-computed ETB pricing.
    /// </summary>
    /// <param name="request">The order creation payload.</param>
    /// <returns>The newly created order with Location header.</returns>
    /// <response code="201">Order placed successfully.</response>
    /// <response code="400">One or more fields failed validation.</response>
    /// <response code="404">The target restaurant does not exist.</response>
    /// <response code="409">The target restaurant is currently closed or inactive.</response>
    /// <response code="422">An ordered menu item is invalid or the total ETB amount is non-positive.</response>
    [HttpPost]
    [ProducesResponseType(typeof(Order), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Updates the lifecycle status of an existing order.
    /// </summary>
    /// <param name="id">Unique order identifier.</param>
    /// <param name="request">The target order status payload.</param>
    /// <returns>The updated order.</returns>
    /// <response code="200">Order status updated successfully.</response>
    /// <response code="400">The status payload failed validation.</response>
    /// <response code="404">No order exists with the specified ID.</response>
    /// <response code="409">The order has already been delivered and cannot be cancelled.</response>
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(typeof(Order), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Retrieves all orders for administrative review.
    /// </summary>
    /// <param name="authorization">Bearer authorization header containing an admin token.</param>
    /// <returns>All orders when authorized as an administrator.</returns>
    /// <response code="200">Admin authorization succeeded; returns all orders.</response>
    /// <response code="401">Missing Authorization header.</response>
    /// <response code="403">Provided token lacks administrator permissions.</response>
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
