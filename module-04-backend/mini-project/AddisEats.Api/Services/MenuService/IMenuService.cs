using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Services.MenuService;

public interface IMenuService
{
    List<MenuItem> GetAll(string? category = null, int? page = null, int? pageSize = null);
    MenuItem? GetById(int id);
    MenuItem Add(CreateMenuItemRequest request);
    MenuItem Add(MenuItem item);
    List<MenuItem> ForRestaurant(int restaurantId, string? category = null);
}
