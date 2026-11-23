using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

public static class SeedData
{
    public static List<Restaurant> Restaurants => new()
    {
        new()
        {
            Id = 1,
            Name = "Yod Abyssinia",
            Area = "Bole",
            DeliveryFeeEtb = 50m,
            OwnerPhone = "0911234567",
            CommissionRate = 0.15m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 101, RestaurantId = 1, Name = "Doro Wat", Category = "Traditional", Price = 450m, PriceWithVat = 517.5m },
                new() { Id = 102, RestaurantId = 1, Name = "Special Kitfo", Category = "Traditional", Price = 380m, PriceWithVat = 437m },
                new() { Id = 103, RestaurantId = 1, Name = "Gomen be Sega", Category = "Traditional", Price = 290m, PriceWithVat = 333.5m },
                new() { Id = 104, RestaurantId = 1, Name = "Derek Tibs", Category = "Meat", Price = 340m, PriceWithVat = 391m },
                new() { Id = 105, RestaurantId = 1, Name = "Tej Honey Wine", Category = "Drinks", Price = 120m, PriceWithVat = 138m },
                new() { Id = 106, RestaurantId = 1, Name = "Bayeaynetu", Category = "Vegetarian", Price = 220m, PriceWithVat = 253m }
            }
        },
        new()
        {
            Id = 2,
            Name = "Kategna",
            Area = "Kazanchis",
            DeliveryFeeEtb = 60m,
            OwnerPhone = "0911234568",
            CommissionRate = 0.12m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 201, RestaurantId = 2, Name = "Shiro Tegabino", Category = "Vegetarian", Price = 180m, PriceWithVat = 207m },
                new() { Id = 202, RestaurantId = 2, Name = "Bozena Shiro", Category = "Traditional", Price = 240m, PriceWithVat = 276m },
                new() { Id = 203, RestaurantId = 2, Name = "Zilzil Tibs", Category = "Meat", Price = 360m, PriceWithVat = 414m },
                new() { Id = 204, RestaurantId = 2, Name = "Kategna Special Kitfo", Category = "Traditional", Price = 420m, PriceWithVat = 483m },
                new() { Id = 205, RestaurantId = 2, Name = "Fasting Firfir", Category = "Vegetarian", Price = 160m, PriceWithVat = 184m },
                new() { Id = 206, RestaurantId = 2, Name = "Habesha Beer", Category = "Drinks", Price = 90m, PriceWithVat = 103.5m }
            }
        },
        new()
        {
            Id = 3,
            Name = "Sishu",
            Area = "Bole",
            DeliveryFeeEtb = 50m,
            OwnerPhone = "0911234569",
            CommissionRate = 0.15m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 301, RestaurantId = 3, Name = "Classic Sishu Burger", Category = "Food", Price = 350m, PriceWithVat = 402.5m },
                new() { Id = 302, RestaurantId = 3, Name = "Cheese Burger", Category = "Food", Price = 390m, PriceWithVat = 448.5m },
                new() { Id = 303, RestaurantId = 3, Name = "Spicy Chicken Burger", Category = "Food", Price = 320m, PriceWithVat = 368m },
                new() { Id = 304, RestaurantId = 3, Name = "French Fries", Category = "Sides", Price = 120m, PriceWithVat = 138m },
                new() { Id = 305, RestaurantId = 3, Name = "Chocolate Milkshake", Category = "Drinks", Price = 150m, PriceWithVat = 172.5m },
                new() { Id = 306, RestaurantId = 3, Name = "Iced Tea", Category = "Drinks", Price = 80m, PriceWithVat = 92m }
            }
        },
        new()
        {
            Id = 4,
            Name = "Castelli",
            Area = "Piassa",
            DeliveryFeeEtb = 70m,
            OwnerPhone = "0911234570",
            CommissionRate = 0.18m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 401, RestaurantId = 4, Name = "Homemade Lasagna", Category = "Food", Price = 460m, PriceWithVat = 529m },
                new() { Id = 402, RestaurantId = 4, Name = "Spaghetti Bolognese", Category = "Food", Price = 380m, PriceWithVat = 437m },
                new() { Id = 403, RestaurantId = 4, Name = "Ravioli Ricotta", Category = "Food", Price = 420m, PriceWithVat = 483m },
                new() { Id = 404, RestaurantId = 4, Name = "Minestrone Soup", Category = "Food", Price = 210m, PriceWithVat = 241.5m },
                new() { Id = 405, RestaurantId = 4, Name = "Tiramisu", Category = "Dessert", Price = 200m, PriceWithVat = 230m },
                new() { Id = 406, RestaurantId = 4, Name = "Italian Espresso", Category = "Drinks", Price = 60m, PriceWithVat = 69m }
            }
        },
        new()
        {
            Id = 5,
            Name = "Taitu Hotel",
            Area = "Piassa",
            DeliveryFeeEtb = 65m,
            OwnerPhone = "0911234571",
            CommissionRate = 0.10m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 501, RestaurantId = 5, Name = "Vegan Buffet Plate", Category = "Vegetarian", Price = 260m, PriceWithVat = 299m },
                new() { Id = 502, RestaurantId = 5, Name = "Shiro with Salad", Category = "Vegetarian", Price = 190m, PriceWithVat = 218.5m },
                new() { Id = 503, RestaurantId = 5, Name = "Miser Wot", Category = "Vegetarian", Price = 170m, PriceWithVat = 195.5m },
                new() { Id = 504, RestaurantId = 5, Name = "Kik Alicha", Category = "Vegetarian", Price = 160m, PriceWithVat = 184m },
                new() { Id = 505, RestaurantId = 5, Name = "Traditional Coffee Pot", Category = "Drinks", Price = 100m, PriceWithVat = 115m },
                new() { Id = 506, RestaurantId = 5, Name = "Fresh Ginger Tea", Category = "Drinks", Price = 70m, PriceWithVat = 80.5m }
            }
        },
        new()
        {
            Id = 6,
            Name = "Enat Shiro",
            Area = "Piassa",
            DeliveryFeeEtb = 45m,
            OwnerPhone = "0911234572",
            CommissionRate = 0.12m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 601, RestaurantId = 6, Name = "Special Claypot Shiro", Category = "Vegetarian", Price = 170m, PriceWithVat = 195.5m },
                new() { Id = 602, RestaurantId = 6, Name = "Bozena Shiro Special", Category = "Traditional", Price = 250m, PriceWithVat = 287.5m },
                new() { Id = 603, RestaurantId = 6, Name = "Shiro with Boiled Egg", Category = "Vegetarian", Price = 190m, PriceWithVat = 218.5m },
                new() { Id = 604, RestaurantId = 6, Name = "Timatim Salata", Category = "Sides", Price = 80m, PriceWithVat = 92m },
                new() { Id = 605, RestaurantId = 6, Name = "Extra Injera", Category = "Sides", Price = 35m, PriceWithVat = 40.25m },
                new() { Id = 606, RestaurantId = 6, Name = "Mineral Water", Category = "Drinks", Price = 50m, PriceWithVat = 57.5m }
            }
        },
        new()
        {
            Id = 7,
            Name = "2000 Habesha",
            Area = "Kazanchis",
            DeliveryFeeEtb = 55m,
            OwnerPhone = "0911234573",
            CommissionRate = 0.15m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 701, RestaurantId = 7, Name = "Habesha Cultural Combo", Category = "Traditional", Price = 490m, PriceWithVat = 563.5m },
                new() { Id = 702, RestaurantId = 7, Name = "Awaze Tibs", Category = "Meat", Price = 350m, PriceWithVat = 402.5m },
                new() { Id = 703, RestaurantId = 7, Name = "Kitfo Dulet", Category = "Traditional", Price = 380m, PriceWithVat = 437m },
                new() { Id = 704, RestaurantId = 7, Name = "Agelgel Feast", Category = "Traditional", Price = 520m, PriceWithVat = 598m },
                new() { Id = 705, RestaurantId = 7, Name = "St. George Beer", Category = "Drinks", Price = 85m, PriceWithVat = 97.75m },
                new() { Id = 706, RestaurantId = 7, Name = "Traditional Tej", Category = "Drinks", Price = 130m, PriceWithVat = 149.5m }
            }
        },
        new()
        {
            Id = 8,
            Name = "Fendika",
            Area = "Kazanchis",
            DeliveryFeeEtb = 50m,
            OwnerPhone = "0911234574",
            CommissionRate = 0.10m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 801, RestaurantId = 8, Name = "Fendika Special Tibs", Category = "Meat", Price = 310m, PriceWithVat = 356.5m },
                new() { Id = 802, RestaurantId = 8, Name = "Roasted Kolo Snack", Category = "Snacks", Price = 60m, PriceWithVat = 69m },
                new() { Id = 803, RestaurantId = 8, Name = "Chechebsa with Honey", Category = "Breakfast", Price = 170m, PriceWithVat = 195.5m },
                new() { Id = 804, RestaurantId = 8, Name = "Fasting Firfir with Salad", Category = "Vegetarian", Price = 150m, PriceWithVat = 172.5m },
                new() { Id = 805, RestaurantId = 8, Name = "Pure Honey Tej", Category = "Drinks", Price = 110m, PriceWithVat = 126.5m },
                new() { Id = 806, RestaurantId = 8, Name = "Walya Beer", Category = "Drinks", Price = 85m, PriceWithVat = 97.75m }
            }
        },
        new()
        {
            Id = 9,
            Name = "Bole Doro & Tibs",
            Area = "Bole",
            DeliveryFeeEtb = 55m,
            OwnerPhone = "0911234575",
            CommissionRate = 0.14m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 901, RestaurantId = 9, Name = "Full Doro Wat Portion", Category = "Traditional", Price = 480m, PriceWithVat = 552m },
                new() { Id = 902, RestaurantId = 9, Name = "Shekla Tibs", Category = "Meat", Price = 360m, PriceWithVat = 414m },
                new() { Id = 903, RestaurantId = 9, Name = "Goden Tibs", Category = "Meat", Price = 410m, PriceWithVat = 471.5m },
                new() { Id = 904, RestaurantId = 9, Name = "Shiro Tegabino", Category = "Vegetarian", Price = 180m, PriceWithVat = 207m },
                new() { Id = 905, RestaurantId = 9, Name = "Coca Cola 300ml", Category = "Drinks", Price = 45m, PriceWithVat = 51.75m },
                new() { Id = 906, RestaurantId = 9, Name = "Fanta Orange", Category = "Drinks", Price = 45m, PriceWithVat = 51.75m }
            }
        },
        new()
        {
            Id = 10,
            Name = "Lucy Restaurant",
            Area = "Bole",
            DeliveryFeeEtb = 60m,
            OwnerPhone = "0911234576",
            CommissionRate = 0.15m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 1001, RestaurantId = 10, Name = "Lucy Gourmet Kitfo", Category = "Traditional", Price = 440m, PriceWithVat = 506m },
                new() { Id = 1002, RestaurantId = 10, Name = "Grilled Nile Perch Fish", Category = "Fish", Price = 390m, PriceWithVat = 448.5m },
                new() { Id = 1003, RestaurantId = 10, Name = "Fish Dullet", Category = "Fish", Price = 280m, PriceWithVat = 322m },
                new() { Id = 1004, RestaurantId = 10, Name = "Spicy Beef Tibs", Category = "Meat", Price = 340m, PriceWithVat = 391m },
                new() { Id = 1005, RestaurantId = 10, Name = "Garden Avocado Salad", Category = "Salads", Price = 160m, PriceWithVat = 184m },
                new() { Id = 1006, RestaurantId = 10, Name = "Fresh Mango Juice", Category = "Drinks", Price = 110m, PriceWithVat = 126.5m }
            }
        },
        new()
        {
            Id = 11,
            Name = "Kokeb Restaurant",
            Area = "Megenagna",
            DeliveryFeeEtb = 65m,
            OwnerPhone = "0911234577",
            CommissionRate = 0.12m,
            IsActive = true,
            Menu = new List<MenuItem>
            {
                new() { Id = 1101, RestaurantId = 11, Name = "Kokeb Special Tibs", Category = "Meat", Price = 330m, PriceWithVat = 379.5m },
                new() { Id = 1102, RestaurantId = 11, Name = "Quanta Firfir", Category = "Traditional", Price = 270m, PriceWithVat = 310.5m },
                new() { Id = 1103, RestaurantId = 11, Name = "Special Bozena Shiro", Category = "Traditional", Price = 230m, PriceWithVat = 264.5m },
                new() { Id = 1104, RestaurantId = 11, Name = "Kikil Soup", Category = "Soups", Price = 200m, PriceWithVat = 230m },
                new() { Id = 1105, RestaurantId = 11, Name = "Sprite Can", Category = "Drinks", Price = 50m, PriceWithVat = 57.5m },
                new() { Id = 1106, RestaurantId = 11, Name = "Fresh Lemon Tea", Category = "Drinks", Price = 40m, PriceWithVat = 46m }
            }
        },
        new()
        {
            Id = 12,
            Name = "Effoi Pizza Sarbet",
            Area = "Sarbet",
            DeliveryFeeEtb = 70m,
            OwnerPhone = "0911234578",
            CommissionRate = 0.14m,
            IsActive = false,
            Menu = new List<MenuItem>()
        }
    };

    public static List<Restaurant> Resturants => Restaurants;
    public static List<Restaurant> restaurants => Restaurants;
}
