namespace AddisEats.Api.Services.MenuService;

using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;

public interface IMenuService
{
    List<MenuItem> GetAll(string? category = null, int? page = null, int? pageSize = null);
    Result<MenuItem> GetById(int id);
    Result<MenuItem> Add(CreateMenuItemRequest request);
    Result<MenuItem> Add(MenuItem item);
    Result<List<MenuItem>> ForRestaurant(int restaurantId, string? category = null);
    Result<bool> Delete(int id);
}
