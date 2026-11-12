using AddisEats.Api.Models;
 namespace AddisEats.Api.MenuItemServices;

 public interface IMenuItemService
{
    List<menuItem> GetAll();
    MenuItemServices ? GetById (int id);
}