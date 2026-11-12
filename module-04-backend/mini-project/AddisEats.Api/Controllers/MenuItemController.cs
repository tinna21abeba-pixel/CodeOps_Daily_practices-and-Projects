
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.Models;
using System.Data.Common;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MenuItemController : ControllerBase
{
    List<MenuItem> menuItems= new List<MenuItem>

    {
        new MenuItem{Id=1, Name="cheesburger", Category="MAin courrse"},
        new MenuItem{Id=2, Name="cheesburger", Category="MAin courrse"},
        new MenuItem{Id=3, Name="cheesburger", Category="MAin courrse"},
    };
    [HttpGet("/abe")]
    public IActionResult GetAll()
    {
        return Ok(menuItems);
    }
    
    
}