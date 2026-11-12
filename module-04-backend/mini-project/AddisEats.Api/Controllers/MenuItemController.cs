
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using System.Data.Common;

namespace AddisEats.Api.Controllers;


[ApiController]
[Route("api/v1/[controller]")]
public class MenuItemController : ControllerBase
{
    private List<MenuItem> menuItems = new List<MenuItem>
    {
        new MenuItem { Id = 1, Name = "Cheeseburger", Category = "Main Course" },
        new MenuItem { Id = 2, Name = "Doro Wot", Category = "Main Course" },
        new MenuItem { Id = 3, Name = "Shiro", Category = "Main Course" }
    };

    [HttpGet("abe")]
    public IActionResult GetAll()
    {
        return Ok(menuItems);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var menuItem=menuItems.FirstOrDefault(m=>m.Id==id);
        if(menuItem == null)
        {
            return NotFound();
        }
        return Ok(menuItem);
    }
}