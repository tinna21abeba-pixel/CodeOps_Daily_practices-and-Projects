
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.ResturantServices;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Route("api/v1/Restuarant")]
[Route("api/v1/Restuarantontroller")]
public class ResturantController : ControllerBase
{
    private readonly IResturantService _resturanService;
    public ResturantController(IResturantService resturanService)
    {
        _resturanService = resturanService;
    }

    [HttpGet]
    public IActionResult GetAllRestuarant([FromQuery] string? adress, [FromQuery] string? address = null, [FromQuery] int? pageSize = 10, [FromQuery] int? page = 1)
    {
        var restuarants = _resturanService.GetAll(address ?? adress, page, pageSize);
        var restuarantDTOs = restuarants.Select(r => r.ToDTOs()).ToList();

        return Ok(restuarantDTOs);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetRestuarantById(int id)
    {
        var restuarant = _resturanService.GetRestuarantById(id);

        if (restuarant == null)
        {
            return NotFound();
        }

        return Ok(restuarant);
    }
}