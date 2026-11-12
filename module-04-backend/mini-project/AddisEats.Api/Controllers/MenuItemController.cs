
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using System.Data.Common;
using AddisEats.Api.Services.MenuItemServices;

namespace AddisEats.Api.Controllers;


[ApiController]
[Route("api/v1/[controller]")]
public class MenuItemController : ControllerBase
{

 private readonly IMenuItemService _menuItemService;
  public MenuItemController(IMenuItemService menuItemService)
    {
        _menuItemService= menuItemService;
    }
    [HttpGet("addisEats")]
    public IActionResult GetAll()
    {
        var result= _menuItemService.GetAll();
        return Ok(result);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var result= _menuItemService.GetById(); 
        if(result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }
}