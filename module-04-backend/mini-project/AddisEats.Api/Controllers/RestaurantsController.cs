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
    public ActionResult<PagedResponse<RestaurantDto>> GetAll([FromQuery] RestaurantQuery query)
    {
        var results = _service.Search(query)
            .Select(r => r.ToDto())
            .ToList();

        return Ok(new PagedResponse<RestaurantDto>(results, query.Page, query.Limit));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<RestaurantDto> GetOne(int id)
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
    public ActionResult<List<MenuItemDto>> GetMenu(int id, [FromQuery] string? category)
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
