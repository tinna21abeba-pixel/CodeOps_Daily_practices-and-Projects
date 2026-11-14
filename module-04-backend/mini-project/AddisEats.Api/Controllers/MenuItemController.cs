using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using AddisEats.Api.MenuItemServices;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/health")]
public class MenuItemController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;

    public MenuItemController(IMenuItemService menuItemService)
    {
        _menuItemService = menuItemService;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] string ? Category)
    {
        var result = _menuItemService.GetAll(Category);

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var result = _menuItemService.GetById(id);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}