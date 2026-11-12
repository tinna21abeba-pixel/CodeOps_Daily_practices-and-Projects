using AddisEats.Api.Models;

namespace AddisEats.Api.MenuItemServices;

public interface IMenuItemService
{
    List<MenuItem> GetAll();

    MenuItem? GetById(int id);
}