

using AddisEats.Api.Models;


namespace AddisEats.Api.MenuItemServices;

public class MenuItemService: IMenuItemService
{
    private readonly List<MenuItem> _menuItems= new()
    {
        new MenuItem {Id=1, NamedArgumentsEncoder="cascer salad", Category="food"},
        new MenuItem {Id=1, NamedArgumentsEncoder="cascer salad", Category="food"},
        new MenuItem {Id=1, NamedArgumentsEncoder="cascer salad", Category="food"}
        
    };
    public List<MenuItem> GetAll()
    {
        return _menuItems;
    }
    public MenuItem? GetById(int id)
    {
        return _menuItems.FirstOrDefault(m => m.Id==id);
    }
}

