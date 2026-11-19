using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public class SeedData
{
    public static List<Resturant> Resturants = new List<Resturant>
    {
        new Resturant { Id = 1, Name = "Addis Ababa Restaurant", Address = "Bole", Phone = "555-1234", IsActive = true, OwnerAddress = "456 Elm St" },
        new Resturant { Id = 2, Name = "Blue Nile Restaurant", Address = "Ayat", Phone = "555-5678", IsActive = false, OwnerAddress = "789 Pine St" },
        new Resturant { Id = 3, Name = "Lucy Restaurant", Address = "Mexico", Phone = "555-9012", IsActive = true, OwnerAddress = "321 Cedar St" },
        new Resturant { Id = 4, Name = "Ethio Restaurant", Address = "Megenagna", Phone = "555-3456", IsActive = true, OwnerAddress = "654 Spruce St" },
        new Resturant { Id = 5, Name = "Tena Yistilign Restaurant", Address = "Bole", Phone = "555-7890", IsActive = true, OwnerAddress = "987 Birch St" },
        new Resturant { Id = 6, Name = "Kategna Restaurant", Address = "Megenagna", Phone = "555-2345", IsActive = true, OwnerAddress = "123 Main St" },
        new Resturant { Id = 7, Name = "Sishu Restaurant", Address = "Bole", Phone = "555-6789", IsActive = false, OwnerAddress = "246 Aspen St" },
        new Resturant { Id = 8, Name = "Abay Restaurant", Address = "Megenagna", Phone = "555-0123", IsActive = true, OwnerAddress = "357 Cherry St" },
        new Resturant { Id = 9, Name = "Fendika Restaurant", Address = "Mexico", Phone = "555-4567", IsActive = false, OwnerAddress = "468 Walnut St" },
        new Resturant { Id = 10, Name = "Doro Wat Restaurant", Address = "Megenagna", Phone = "555-8901", IsActive = true, OwnerAddress = "579 Chestnut St" },
        new Resturant { Id = 11, Name = "Injera Restaurant", Address = "Mexico", Phone = "555-2345", IsActive = true, OwnerAddress = "680 Poplar St" },
        new Resturant { Id = 12, Name = "Bunna Restaurant", Address = "Ayat", Phone = "555-6789", IsActive = true, OwnerAddress = "791 Fir St" }
    };

    public static List<Resturant> restaurants => Resturants;
}