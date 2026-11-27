namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.Services;

[ApiController]
[Tags("Restaurants")]
[Route("api/v1/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;

    public RestaurantsController(IRestaurantService restaurantService)
    {
        _restaurantService = restaurantService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<RestaurantDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult Search([FromQuery] RestaurantQuery query)
    {
        var restaurants = _restaurantService.Search(query);
        var dtos = restaurants.Select(r => r.ToDto());
        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var restaurant = _restaurantService.GetById(id);
        if (restaurant == null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/restaurant-not-found",
                Title = "RESTAURANT_NOT_FOUND",
                Status = StatusCodes.Status404NotFound,
                Detail = "The requested restaurant could not be found."
            });
        }

        return Ok(restaurant.ToDto());
    }

    [HttpGet("{id:int}/menu")]
    [ProducesResponseType(typeof(List<MenuItem>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public IActionResult GetMenu(int id)
    {
        var restaurant = _restaurantService.GetById(id);
        if (restaurant == null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/restaurant-not-found",
                Title = "RESTAURANT_NOT_FOUND",
                Status = StatusCodes.Status404NotFound,
                Detail = "The requested restaurant could not be found."
            });
        }

        return Ok(restaurant.Menu);
    }
}
