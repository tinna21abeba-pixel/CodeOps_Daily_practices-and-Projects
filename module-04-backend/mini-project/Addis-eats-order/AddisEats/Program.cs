using AddisEats.Basics;
using AddisEats.Catalog;

void Header(string t) => Console.WriteLine($"\n===== {t} =====");

Header("1. DeliveryFee");
Console.WriteLine(DeliveryService.DeliveryFee("Bole", true));
Console.WriteLine(DeliveryService.DeliveryFee(area: "Kazanchis", isVip: false));
Console.WriteLine(DeliveryService.DeliveryFee("Piassa"));

Header("2. Overloads");
Describer.Describe(5);
Describer.Describe("injera");
Describer.Describe(99.5m);

Header("3. Restaurant");
var r = new Restaurant { Id = 1, Name = "Yod Abyssinia", Area = "Bole" };
Console.WriteLine(r.DisplayName);
r.Name = "Fasika";
Console.WriteLine(r.DisplayName);
Console.WriteLine($"Id is still {r.Id}");

Header("4. Record vs class");
var c1 = new Customer("Abebe", "0911000000");
var c2 = new Customer("Abebe", "0911000000");
Console.WriteLine($"record equal: {c1 == c2}");
var k1 = new CustomerClass("Abebe", "0911000000");
var k2 = new CustomerClass("Abebe", "0911000000");
Console.WriteLine($"class equal:  {k1 == k2}");
Console.WriteLine("Difference: records compare by value, classes compare by reference.");

Header("5. LINQ");
var orders = SampleData.CreateOrders();
Console.WriteLine("Bole > 500: " + OrderQueries.BoleOver500(orders).Count + " orders");
Console.WriteLine("Names: " + string.Join(", ", OrderQueries.CustomerNamesSorted(orders)));
Console.WriteLine($"Kazanchis revenue: {OrderQueries.KazanchisRevenue(orders)} ETB");
Console.WriteLine("Page 3 (ids, newest first): " +
    string.Join(", ", OrderQueries.Page(orders, 3).Select(o => o.Id)));

Header("6. IDiscountPolicy");
Console.WriteLine(CheckoutService.Checkout(1000m, new PercentOffPolicy()));
Console.WriteLine(CheckoutService.Checkout(1000m, new FlatOffPolicy()));
Console.WriteLine(CheckoutService.Checkout(1000m, new BigSpenderPolicy()));

Header("7. try/catch/finally");
PaymentValidator.RunDemo(250m);
PaymentValidator.RunDemo(-10m);
