namespace AddisEats.Catalog;

public class BigSpenderPolicy : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount >= 1000m ? amount * 0.80m : amount;
}
