using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantsController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpGet]
    public IActionResult Search([FromQuery] string? area, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var restaurants = _restaurantService.Search(area, page, limit);
        var dtos = restaurants.Select(r => r.ToDto());
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var restaurant = _restaurantService.GetById(id);
        if (restaurant == null)
        {
            return NotFound();
        }

        return Ok(restaurant.ToDto());
    }

    [HttpGet("{id:int}/menu")]
    public IActionResult GetMenu(int id)
    {
        var restaurant = _restaurantService.GetById(id);
        if (restaurant == null)
        {
            return NotFound();
        }

        return Ok(restaurant.Menu);
    }
}
