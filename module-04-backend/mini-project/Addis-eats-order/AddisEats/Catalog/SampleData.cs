namespace AddisEats.Catalog;

public static class SampleData
{
    private static readonly string[] Areas = { "Bole", "Kazanchis", "Piassa" };
    private static readonly string[] Names = { "Abebe", "Selam", "Dawit", "Meron", "Yonas", "Hana", "Biruk" };

    public static List<Order> CreateOrders()
    {
        var orders = new List<Order>();
        for (int i = 1; i <= 45; i++)
        {
            orders.Add(new Order(
                Id: i,
                CustomerName: Names[i % Names.Length],
                Area: Areas[i % Areas.Length],
                Total: 100 + i * 25m,
                PlacedAt: new DateTime(2026, 11, 1).AddHours(i * 6)));
        }
        return orders;
    }
}
