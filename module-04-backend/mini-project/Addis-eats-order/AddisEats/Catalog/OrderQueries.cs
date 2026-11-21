namespace AddisEats.Catalog;

public static class OrderQueries
{
    public static List<Order> BoleOver500(List<Order> orders) =>
        orders.Where(o => o.Area == "Bole" && o.Total > 500m).ToList();

    public static List<string> CustomerNamesSorted(List<Order> orders) =>
        orders.Select(o => o.CustomerName).Distinct().OrderBy(n => n).ToList();

    public static decimal KazanchisRevenue(List<Order> orders) =>
        orders.Where(o => o.Area == "Kazanchis").Sum(o => o.Total);

    public static List<Order> Page(List<Order> orders, int page, int pageSize = 10) =>
        orders.OrderByDescending(o => o.PlacedAt)
              .Skip((page - 1) * pageSize)
              .Take(pageSize)
              .ToList();
}
