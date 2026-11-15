using AddiseEats.Api.DTOs;
using AddiseEats.Api.Mappers;
using AddiseEats.Api.Services.ResturantServices;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class Restuarantontroller : ControllerBase
{
    private readonly IResturanService _resturanService;
    public Restuarantontroller(IResturanService resturanService)
    {
        _resturanService = resturanService;
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