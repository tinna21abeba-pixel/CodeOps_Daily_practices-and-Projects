using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.DTOs;
using AddisEats.Api.Services.MenuService;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/menu-items")]
[Route("api/v1/menu")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;
    private readonly MenuOptions _options;

    public MenuController(IMenuService menuService, IOptions<MenuOptions> options)
    {
        _menuService = menuService;
        _options = options.Value;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<MenuItem>), StatusCodes.Status200OK)]
    public ActionResult<PagedResponse<MenuItem>> GetAll(
        [FromQuery] string? category,
        [FromQuery] int? page = null,
        [FromQuery] int? pageSize = null)
    {
        const int maxPageSize = 50;
        int currentPage = page.HasValue && page.Value > 0 ? page.Value : 1;
        int currentPageSize = pageSize.HasValue
            ? (pageSize.Value > maxPageSize ? maxPageSize : (pageSize.Value < 1 ? 1 : pageSize.Value))
            : _options.DefaultPageSize;

        var items = _menuService.GetAll(category, currentPage, currentPageSize);
        return Ok(new PagedResponse<MenuItem>(items, currentPage, currentPageSize));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<MenuItem> GetById(int id)
    {
        var item = _menuService.GetById(id);

        if (item == null)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/not-found",
                Title = "Menu item not found",
                Status = StatusCodes.Status404NotFound,
                Detail = $"Menu item with id {id} not found."
            });
        }

        return Ok(item);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public ActionResult<MenuItem> Create([FromBody] CreateMenuItemRequest request)
    {
        if (request == null)
        {
            return BadRequest(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/validation",
                Title = "Request body required",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Request body is required."
            });
        }

        if (request.Price <= 0m)
        {
            return UnprocessableEntity(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/unprocessable",
                Title = "Invalid price",
                Status = StatusCodes.Status422UnprocessableEntity,
                Detail = "Price must be a positive ETB amount greater than zero."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/validation",
                Title = "Item name required",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Item name is required."
            });
        }

        var createdItem = _menuService.Add(request);

        return CreatedAtAction(nameof(GetById), new { id = createdItem.Id }, createdItem);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public IActionResult Delete(int id)
    {
        var deleted = _menuService.Delete(id);
        if (!deleted)
        {
            return NotFound(new ProblemDetails
            {
                Type = "https://addiseats.et/errors/not-found",
                Title = "Menu item not found",
                Status = StatusCodes.Status404NotFound,
                Detail = $"Menu item with id {id} not found."
            });
        }

        return NoContent();
    }
}
