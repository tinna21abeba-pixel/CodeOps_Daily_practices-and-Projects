namespace AddisEats.Api.Services;

using Microsoft.Extensions.Logging;

public class TeleBirrProvider : IPaymentProvider
{
    private readonly ILogger<TeleBirrProvider> _logger;

    public TeleBirrProvider(ILogger<TeleBirrProvider> logger)
    {
        _logger = logger;
    }

    public string ProviderName => "TeleBirr";

    public string ProcessPayment(decimal amount)
    {
        _logger.LogInformation("Processing payment of {Amount} ETB through {ProviderName}", amount, ProviderName);
        return $"ETB {amount} payment processed through TeleBirr.";
    }
}