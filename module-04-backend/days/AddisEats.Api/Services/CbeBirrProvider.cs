namespace AddisEats.Api.Services;

using Microsoft.Extensions.Logging;

public class CbeBirrProvider : IPaymentProvider
{
    private readonly ILogger<CbeBirrProvider> _logger;

    public CbeBirrProvider(ILogger<CbeBirrProvider> logger)
    {
        _logger = logger;
    }

    public string ProviderName => "CbeBirr";

    public string ProcessPayment(decimal amount)
    {
        _logger.LogInformation("Processing payment of {Amount} ETB through {ProviderName}", amount, ProviderName);
        return $"ETB {amount} payment processed through CbeBirr.";
    }
}
