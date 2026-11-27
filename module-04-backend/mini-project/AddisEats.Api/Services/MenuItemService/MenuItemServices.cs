using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuService;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.MenuItemServices;

public class MenuItemService : MenuService, IMenuItemService
{
    public MenuItemService(IOptions<MenuOptions> options, ILogger<MenuItemService> logger)
        : base(options, logger)
    {
    }
}
