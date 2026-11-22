
using Microsoft.AspNetCore.Mvc;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.ResturantServices;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/restaurants")]
public class ResturantController : ControllerBase
{
    private readonly IResturantService _resturanService;
    public ResturantController(IResturantService resturanService)
    {
        _resturanService = resturanService;
    }

    [HttpGet]
    public IActionResult GetAllRestuarant([FromQuery] string? area, [FromQuery] int? limit = 10, [FromQuery] int? page = 1)
    {
        var restuarants = _resturanService.GetAll(area, limit, page);
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

        return Ok(restuarant.ToDTOs());
    }
}