namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuService;
using Microsoft.Extensions.Options;

/// <summary>
/// Manages standalone Addis Eats menu items.
/// </summary>
[ApiController]
[Tags("Menu")]
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

    /// <summary>
    /// Lists menu items with optional category filtering and pagination.
    /// </summary>
    /// <param name="category">Optional menu category filter (case-insensitive).</param>
    /// <param name="page">Optional 1-based page number.</param>
    /// <param name="pageSize">Optional page size (clamped between 1 and 50).</param>
    /// <returns>A paginated collection of menu items.</returns>
    /// <response code="200">Returns the matching page of menu items.</response>
    /// <response code="400">An invalid query value or unrecognized query parameter was supplied.</response>
    [HttpGet]
    
    [ProducesResponseType(typeof(PagedResponse<MenuItem>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
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

    /// <summary>
    /// Retrieves a single menu item by its numeric identifier.
    /// </summary>
    /// <param name="id">Unique menu item identifier.</param>
    /// <returns>The matching menu item.</returns>
    /// <response code="200">Menu item found and returned.</response>
    /// <response code="404">No menu item exists with the specified ID.</response>
    [HttpGet("{id:int}")]
   
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<MenuItem> GetById(int id)
    {
        var result = _menuService.GetById(id);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!);
    }

    /// <summary>
    /// Creates a new menu item in the catalogue.
    /// </summary>
    /// <param name="request">The menu item creation payload.</param>
    /// <returns>The newly created menu item with Location header.</returns>
    /// <response code="201">Menu item created successfully.</response>
    /// <response code="400">One or more fields failed validation.</response>
    /// <response code="422">The menu item price is not a positive ETB amount.</response>
    [HttpPost]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status422UnprocessableEntity)]
    public ActionResult<MenuItem> Create([FromBody] CreateMenuItemRequest request)
    {
        var result = _menuService.Add(request);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value!);
    }

    /// <summary>
    /// Deletes an existing menu item by its numeric identifier.
    /// </summary>
    /// <param name="id">Unique menu item identifier.</param>
    /// <returns>No content when deletion succeeds.</returns>
    /// <response code="204">Menu item deleted successfully.</response>
    /// <response code="404">No menu item exists with the specified ID.</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public IActionResult Delete(int id)
    {
        var result = _menuService.Delete(id);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return NoContent();
    }
}
