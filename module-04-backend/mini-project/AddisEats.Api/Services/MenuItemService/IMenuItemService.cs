using AddisEats.Api.Models;

namespace AddisEats.Api.MenuItemServices;

public interface IMenuItemService
{
    List<MenuItem> GetAll( string ? category);

    MenuItem? GetById(int id);
}