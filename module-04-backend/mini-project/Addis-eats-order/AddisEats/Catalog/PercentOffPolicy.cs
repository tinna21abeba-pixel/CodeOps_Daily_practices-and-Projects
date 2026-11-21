namespace AddisEats.Catalog;

public class PercentOffPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount * 0.90m;
}
