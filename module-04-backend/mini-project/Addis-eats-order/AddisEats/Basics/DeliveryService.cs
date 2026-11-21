namespace AddisEats.Basics;

public static class DeliveryService
{
    
    public static decimal DeliveryFee(string area, bool isVip = false) =>
        isVip
            ? 0m
            : area.Trim().ToLowerInvariant() switch
            {
                "bole"      => 50m,
                "kazanchis" => 60m,
                "piassa"    => 70m,
                "cmc"       => 80m,
                _           => 90m
            };
}
