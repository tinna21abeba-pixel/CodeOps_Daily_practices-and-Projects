using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.Services;
using AddisEats.Api.Services.MenuService;

namespace AddisEats.Api.Controllers;

[ApiController]
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

    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<RestaurantDto>), StatusCodes.Status200OK)]
    public IActionResult GetAll([FromQuery] string? area, [FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var results = _service.Search(area, page, limit)
            .Select(r => r.ToDto())
            .ToList();

        if (HttpContext.Request.Query.TryGetValue("envelope", out var env) && env == "false")
        {
            return Ok(results);
        }

        return Ok(new { data = results, page, pageSize = limit });
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOne(int id)
    {
        var found = _service.GetById(id);
        if (found is null)
        {
            return NotFound();
        }

        return Ok(found.ToDto());
    }

    [HttpGet("{id:int}/menu")]
    [ProducesResponseType(typeof(List<MenuItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetMenu(int id, [FromQuery] string? category)
    {
        if (_service.GetById(id) is null)
        {
            return NotFound();
        }

        var items = _menuService.ForRestaurant(id, category)
            .Select(m => m.ToDto())
            .ToList();

        return Ok(items);
    }
}
