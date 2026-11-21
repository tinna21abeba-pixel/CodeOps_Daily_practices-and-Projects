namespace AddisEats.Api.Services;

public interface IPaymentProvider
{
    string ProviderName { get; }

    string ProcessPayment(decimal amount);
}