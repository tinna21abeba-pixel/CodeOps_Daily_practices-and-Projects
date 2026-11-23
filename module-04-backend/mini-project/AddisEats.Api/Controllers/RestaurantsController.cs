namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.Models;
using AddisEats.Api.Services;
using AddisEats.Api.Services.MenuService;

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
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public ActionResult<PagedResponse<RestaurantDto>> GetAll([FromQuery] RestaurantQuery query)
    {
        var results = _service.Search(query)
            .Select(r => r.ToDto())
            .ToList();

        return Ok(new PagedResponse<RestaurantDto>(results, query.Page, query.Limit));
    }

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

    [HttpGet("{id:int}/menu")]
    [HttpGet("{id:int}/menu-items")]
    [ProducesResponseType(typeof(List<MenuItemDto>), StatusCodes.Status200OK)]
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
