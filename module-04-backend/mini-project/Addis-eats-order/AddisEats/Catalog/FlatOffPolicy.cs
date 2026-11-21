namespace AddisEats.Catalog;

public class FlatOffPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount) => Math.Max(0m, amount - 50m);
}
