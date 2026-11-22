using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public static class SeedData
{
    public static readonly List<Restaurant> Restaurants = new()
    {
        new Restaurant
        {
            Id = 1,
            Name = "Bole Doro & Kitfo",
            Area = "Bole",
            Address = "Cameroon St, Bole",
            Phone = "+251911234567",
            DeliveryFee = 80.00m,
            OwnerPhone = "+251911000001",
            CommissionRate = 0.15m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 101, Name = "Doro Wat", Category = "Traditional", Price = 450.00m },
                new MenuItem { Id = 102, Name = "Special Kitfo", Category = "Traditional", Price = 380.00m }
            }
        },
        new Restaurant
        {
            Id = 2,
            Name = "Kategna Restaurant",
            Area = "Bole",
            Address = "Airport Rd, Bole",
            Phone = "+251911234568",
            DeliveryFee = 90.00m,
            OwnerPhone = "+251911000002",
            CommissionRate = 0.12m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 201, Name = "Shiro Tegabino", Category = "Vegetarian", Price = 180.00m },
                new MenuItem { Id = 202, Name = "Beyeaynetu", Category = "Vegetarian", Price = 220.00m }
            }
        },
        new Restaurant
        {
            Id = 3,
            Name = "Lucy Lounge & Restaurant",
            Area = "Bole",
            Address = "Atlas Hotel St, Bole",
            Phone = "+251911234569",
            DeliveryFee = 85.00m,
            OwnerPhone = "+251911000003",
            CommissionRate = 0.15m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 301, Name = "Beef Tibs", Category = "Meat", Price = 320.00m }
            }
        },
        new Restaurant
        {
            Id = 4,
            Name = "Castelli Italian & Ethiopian",
            Area = "Bole",
            Address = "Rwanda St, Bole",
            Phone = "+251911234570",
            DeliveryFee = 100.00m,
            OwnerPhone = "+251911000004",
            CommissionRate = 0.18m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 401, Name = "Lasagna Bolognese", Category = "Italian", Price = 390.00m },
                new MenuItem { Id = 402, Name = "Pasta with Shiro", Category = "Fusion", Price = 210.00m }
            }
        },
        new Restaurant
        {
            Id = 5,
            Name = "Yod Abyssinia Cultural Restaurant",
            Area = "Kazanchis",
            Address = "Kirkos, Kazanchis",
            Phone = "+251911234571",
            DeliveryFee = 75.00m,
            OwnerPhone = "+251911000005",
            CommissionRate = 0.14m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 501, Name = "Gomen be Sega", Category = "Traditional", Price = 280.00m },
                new MenuItem { Id = 502, Name = "Tej Honey Wine", Category = "Drinks", Price = 120.00m }
            }
        },
        new Restaurant
        {
            Id = 6,
            Name = "2000 Habesha Cultural Restaurant",
            Area = "Kazanchis",
            Address = "Near ECA, Kazanchis",
            Phone = "+251911234572",
            DeliveryFee = 70.00m,
            OwnerPhone = "+251911000006",
            CommissionRate = 0.15m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 601, Name = "Zilzil Tibs", Category = "Meat", Price = 360.00m },
                new MenuItem { Id = 602, Name = "Injera with Kik Alicha", Category = "Vegetarian", Price = 170.00m }
            }
        },
        new Restaurant
        {
            Id = 7,
            Name = "Fendika Azmari Bet",
            Area = "Kazanchis",
            Address = "Zewditu St, Kazanchis",
            Phone = "+251911234573",
            DeliveryFee = 65.00m,
            OwnerPhone = "+251911000007",
            CommissionRate = 0.10m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 701, Name = "Derek Tibs", Category = "Meat", Price = 300.00m }
            }
        },
        new Restaurant
        {
            Id = 8,
            Name = "Taitu Hotel Restaurant",
            Area = "Piassa",
            Address = "Churchill Ave, Piassa",
            Phone = "+251911234574",
            DeliveryFee = 110.00m,
            OwnerPhone = "+251911000008",
            CommissionRate = 0.16m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 801, Name = "Fasting Buffet", Category = "Vegetarian", Price = 250.00m }
            }
        },
        new Restaurant
        {
            Id = 9,
            Name = "Enat Shiro House",
            Area = "Piassa",
            Address = "Cunningham St, Piassa",
            Phone = "+251911234575",
            DeliveryFee = 95.00m,
            OwnerPhone = "+251911000009",
            CommissionRate = 0.12m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 901, Name = "Bozena Shiro", Category = "Traditional", Price = 240.00m },
                new MenuItem { Id = 902, Name = "Tagabino Shiro", Category = "Vegetarian", Price = 160.00m }
            }
        },
        new Restaurant
        {
            Id = 10,
            Name = "Tomoca Coffee & Kitchen",
            Area = "Piassa",
            Address = "Wavel St, Piassa",
            Phone = "+251911234576",
            DeliveryFee = 85.00m,
            OwnerPhone = "+251911000010",
            CommissionRate = 0.10m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 1001, Name = "Macchiato", Category = "Drinks", Price = 45.00m },
                new MenuItem { Id = 1002, Name = "Chechebsa", Category = "Breakfast", Price = 150.00m }
            }
        },
        new Restaurant
        {
            Id = 11,
            Name = "Sishu Burgers",
            Area = "Sarbet",
            Address = "Near Old Airport, Sarbet",
            Phone = "+251911234577",
            DeliveryFee = 120.00m,
            OwnerPhone = "+251911000011",
            CommissionRate = 0.15m,
            Menu = new List<MenuItem>
            {
                new MenuItem { Id = 1101, Name = "Classic Beef Burger", Category = "Burger", Price = 340.00m },
                new MenuItem { Id = 1102, Name = "Seasoned Wedges", Category = "Sides", Price = 110.00m }
            }
        },
        new Restaurant
        {
            Id = 12,
            Name = "Effoi Pizza Sarbet",
            Area = "Sarbet",
            Address = "Tor Hailoch Rd, Sarbet",
            Phone = "+251911234578",
            DeliveryFee = 115.00m,
            OwnerPhone = "+251911000012",
            CommissionRate = 0.15m,
            Menu = new List<MenuItem>()
        }
    };
}
