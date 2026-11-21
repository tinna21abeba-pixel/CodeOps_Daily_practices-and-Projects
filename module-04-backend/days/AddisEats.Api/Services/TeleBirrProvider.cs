namespace AddisEats.Api.Services;

public class TeleBirrProvider : IPaymentProvider
{
    public string ProviderName => "TeleBirr";

    public string ProcessPayment(decimal amount)
    {
        return $"ETB {amount} payment processed through TeleBirr.";
    }
}