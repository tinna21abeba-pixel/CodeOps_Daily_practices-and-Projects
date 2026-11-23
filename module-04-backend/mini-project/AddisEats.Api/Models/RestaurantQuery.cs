namespace AddisEats.Api.Models;

public class RestaurantQuery
{
    private const int MaxLimit = 50;
    private int _limit = 20;

    public string? Area { get; set; }
    public List<string>? Areas { get; set; }
    public decimal? MaxFeeEtb { get; set; }
    public int Page { get; set; } = 1;
    public int Limit
    {
        get => _limit;
        set => _limit = value > MaxLimit ? MaxLimit : (value < 1 ? 1 : value);
    }
}
