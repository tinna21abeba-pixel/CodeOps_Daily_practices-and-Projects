namespace AddisEats.Api.Models;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

public class RestaurantQuery
{
    private const int MaxLimit = 50;
    private int _limit = 20;

    public string? Area { get; set; }
    public List<string>? Areas { get; set; }

    [EtbAmount(ErrorMessage = "Maximum delivery fee must be a positive ETB amount with at most two decimal places.")]
    public decimal? MaxFeeEtb { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than zero.")]
    public int Page { get; set; } = 1;

    [Range(1, MaxLimit, ErrorMessage = "Limit must be between 1 and 50.")]
    public int Limit
    {
        get => _limit;
        set => _limit = value > MaxLimit ? MaxLimit : (value < 1 ? 1 : value);
    }
}
