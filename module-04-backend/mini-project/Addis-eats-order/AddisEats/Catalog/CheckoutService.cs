namespace AddisEats.Catalog;

public static class CheckoutService
{
    public static decimal Checkout(decimal amount, IDiscountPolicy policy) => policy.Apply(amount);
}
