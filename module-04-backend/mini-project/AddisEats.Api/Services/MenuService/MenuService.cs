namespace AddisEats.Api.Services.MenuService;

using AddisEats.Api.Common;
using AddisEats.Api.Data;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;
using Microsoft.Extensions.Options;

public class MenuService : IMenuService, AddisEats.Api.MenuItemServices.IMenuItemService
{
    private readonly MenuOptions _options;

    private static readonly List<MenuItem> _menuItems = new()
    {
        new MenuItem
        {
            Id = 1,
            RestaurantId = 1,
            Name = "Caesar Salad",
            Category = "Food",
            Price = 250m,
            PriceWithVat = 287.5m
        },
        new MenuItem
        {
            Id = 2,
            RestaurantId = 1,
            Name = "Doro Wot",
            Category = "Food",
            Price = 400m,
            PriceWithVat = 460m
        },
        new MenuItem
        {
            Id = 3,
            RestaurantId = 1,
            Name = "Coffee",
            Category = "Drinks",
            Price = 100m,
            PriceWithVat = 115m
        }
    };

    public MenuService(IOptions<MenuOptions> options)
    {
        _options = options.Value;
    }

    public List<MenuItem> GetAll(string? category = null, int? page = null, int? pageSize = null)
    {
        lock (_menuItems)
        {
            var query = _menuItems.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(x => x.Category.Equals(category.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            if (page.HasValue && page.Value > 0)
            {
                int size = (pageSize.HasValue && pageSize.Value > 0) ? pageSize.Value : _options.DefaultPageSize;
                query = query.Skip((page.Value - 1) * size).Take(size);
            }
            else if (pageSize.HasValue && pageSize.Value > 0)
            {
                query = query.Take(pageSize.Value);
            }

            return query.ToList();
        }
    }

    public Result<MenuItem> GetById(int id)
    {
        lock (_menuItems)
        {
            var item = _menuItems.FirstOrDefault(m => m.Id == id);
            if (item == null)
            {
                return Result<MenuItem>.Failure(Error.MenuItemNotFound(id));
            }

            return Result<MenuItem>.Success(item);
        }
    }

    public Result<List<MenuItem>> ForRestaurant(int restaurantId, string? category = null)
    {
        var restaurant = SeedData.Restaurants.FirstOrDefault(r => r.Id == restaurantId);
        if (restaurant == null)
        {
            return Result<List<MenuItem>>.Failure(Error.RestaurantNotFound(restaurantId));
        }

        var items = restaurant.Menu.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(category))
        {
            items = items.Where(m => m.Category.Equals(category.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        return Result<List<MenuItem>>.Success(items.ToList());
    }

    public Result<MenuItem> Add(CreateMenuItemRequest request)
    {
        if (request.Price <= 0m)
        {
            return Result<MenuItem>.Failure(Error.AmountInvalid("Price must be a positive ETB amount greater than zero."));
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Result<MenuItem>.Failure(Error.ValidationFailed("Item name is required."));
        }

        lock (_menuItems)
        {
            int nextId = _menuItems.Count > 0 ? _menuItems.Max(m => m.Id) + 1 : 1;
            decimal priceWithVat = request.PriceWithVat.HasValue && request.PriceWithVat.Value > 0m
                ? request.PriceWithVat.Value
                : Math.Round(request.Price * 1.15m, 2);

            var item = new MenuItem
            {
                Id = nextId,
                Name = request.Name.Trim(),
                Category = request.Category.Trim(),
                Price = request.Price,
                PriceWithVat = priceWithVat
            };

            _menuItems.Add(item);
            return Result<MenuItem>.Success(item);
        }
    }

    public Result<MenuItem> Add(MenuItem item)
    {
        if (item.Price <= 0m)
        {
            return Result<MenuItem>.Failure(Error.AmountInvalid("Price must be a positive ETB amount greater than zero."));
        }

        lock (_menuItems)
        {
            if (item.Id <= 0)
            {
                item.Id = _menuItems.Count > 0 ? _menuItems.Max(m => m.Id) + 1 : 1;
            }

            if (item.PriceWithVat <= 0m && item.Price > 0m)
            {
                item.PriceWithVat = Math.Round(item.Price * 1.15m, 2);
            }

            _menuItems.Add(item);
            return Result<MenuItem>.Success(item);
        }
    }

    public Result<bool> Delete(int id)
    {
        lock (_menuItems)
        {
            var item = _menuItems.FirstOrDefault(m => m.Id == id);
            if (item == null)
            {
                return Result<bool>.Failure(Error.MenuItemNotFound(id));
            }

            _menuItems.Remove(item);
            return Result<bool>.Success(true);
        }
    }
}
