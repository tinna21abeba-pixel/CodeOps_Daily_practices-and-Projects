namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.Models;
using AddisEats.Api.Services;
using AddisEats.Api.Services.MenuService;

/// <summary>
/// Discovers Addis Ababa partner restaurants and browses their menus.
/// </summary>
[ApiController]
[Tags("Restaurants")]
[Route("api/v1/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _service;
    private readonly IMenuService _menuService;

    public RestaurantsController(IRestaurantService service, IMenuService menuService)
    {
        _service = service;
        _menuService = menuService;
    }

    /// <summary>
    /// Searches active restaurants with optional area, delivery fee, and pagination filters.
    /// </summary>
    /// <param name="query">Filter and pagination query parameters.</param>
    /// <returns>A paginated list of matching restaurants.</returns>
    /// <response code="200">Returns the matching page of restaurants.</response>
    /// <response code="400">One or more query parameters are invalid or unrecognized.</response>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<RestaurantDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public ActionResult<PagedResponse<RestaurantDto>> GetAll([FromQuery] RestaurantQuery query)
    {
        var results = _service.Search(query)
            .Select(r => r.ToDto())
            .ToList();

        return Ok(new PagedResponse<RestaurantDto>(results, query.Page, query.Limit));
    }

    /// <summary>
    /// Retrieves a single restaurant by its numeric identifier.
    /// </summary>
    /// <param name="id">Unique restaurant identifier.</param>
    /// <returns>The matching restaurant summary.</returns>
    /// <response code="200">Restaurant found and returned.</response>
    /// <response code="404">No restaurant exists with the specified ID.</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var result = _service.GetById(id);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!.ToDto());
    }

    /// <summary>
    /// Retrieves the menu items offered by a specific restaurant.
    /// </summary>
    /// <param name="id">Unique restaurant identifier.</param>
    /// <param name="category">Optional dish category filter (case-insensitive).</param>
    /// <returns>List of menu items belonging to the restaurant.</returns>
    /// <response code="200">Returns the restaurant's menu items.</response>
    /// <response code="400">An unrecognized query parameter was supplied.</response>
    /// <response code="404">No restaurant exists with the specified ID.</response>
    [HttpGet("{id:int}/menu")]
    [HttpGet("{id:int}/menu-items")]
    [ProducesResponseType(typeof(List<MenuItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<List<MenuItemDto>> GetMenu(int id, [FromQuery] string? category)
    {
        var result = _menuService.ForRestaurant(id, category);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        var items = result.Value!
            .Select(m => m.ToDto())
            .ToList();

        return Ok(items);
    }
}
