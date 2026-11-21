namespace AddisEats.Api.Services;

public class CbeBirrProvider : IPaymentProvider
{
    public string ProviderName => "CbeBirr";

    public string ProcessPayment(decimal amount)
    {
        return $"ETB {amount} payment processed through CbeBirr.";
    }
}
