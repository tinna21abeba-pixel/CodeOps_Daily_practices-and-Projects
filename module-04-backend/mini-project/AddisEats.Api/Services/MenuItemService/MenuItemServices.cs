using AddisEats.Api.Models;

namespace AddisEats.Api.MenuItemServices;

public class MenuItemService : IMenuItemService
{
    private readonly List<MenuItem> _menuItems = new()
    {
        new MenuItem
        {
            Id = 1,
            Name = "Caesar Salad",
            Category = "Food",
            Price = 250,
            PriceWithVat = 287.5m
        },

        new MenuItem
        {
            Id = 2,
            Name = "Doro Wot",
            Category = "Food",
            Price = 400,
            PriceWithVat = 460m
        },

        new MenuItem
        {
            Id = 3,
            Name = "Coffee",
            Category = "Drinks",
            Price = 100,
            PriceWithVat = 115m
        }
    };

    public List<MenuItem> GetAll( string ? category)
    {
        var items=_menuItems
        .Where(x=> category ==null || x.Category == category).ToList();
        return(items);
    }

    public MenuItem? GetById(int id)
    {
        return _menuItems.FirstOrDefault(m => m.Id == id);
    }
}
