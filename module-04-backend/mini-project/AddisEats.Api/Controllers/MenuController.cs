using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.DTOs;
using AddisEats.Api.Services.MenuService;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
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
        int currentPage = page ?? 1;
        int currentPageSize = pageSize ?? _options.DefaultPageSize;
        var items = _menuService.GetAll(category, currentPage, currentPageSize);
        return Ok(new PagedResponse<MenuItem>(items, currentPage, currentPageSize));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<MenuItem> GetById(int id)
    {
        var item = _menuService.GetById(id);

        if (item == null)
        {
            return NotFound(new { message = $"Menu item with id {id} not found." });
        }

        return Ok(item);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<MenuItem> Create([FromBody] CreateMenuItemRequest request)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Request body is required." });
        }

        if (request.Price <= 0m)
        {
            return BadRequest(new { message = "Price must be a positive ETB amount (greater than 0)." });
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Item name is required." });
        }

        var createdItem = _menuService.Add(request);

        return CreatedAtAction(nameof(GetById), new { id = createdItem.Id }, createdItem);
    }
}
