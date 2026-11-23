namespace AddisEats.Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuService;
using Microsoft.Extensions.Options;

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
        var result = _menuService.GetById(id);
        if (result.IsFailure)
        {
            return ProblemDetailsHelper.CreateProblemResult(HttpContext, result.Error);
        }

        return Ok(result.Value!);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MenuItem), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
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
