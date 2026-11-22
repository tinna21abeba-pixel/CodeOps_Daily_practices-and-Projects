namespace AddisEats.Api.Models;

public class RestaurantQuery
{
    public string? Area { get; set; }
    public List<string>? Areas { get; set; }
    public decimal? MaxFeeEtb { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
}
