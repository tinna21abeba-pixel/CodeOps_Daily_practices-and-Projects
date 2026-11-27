namespace AddisEats.Api.Models;

using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

/// <summary>
/// Query filter and pagination parameters for listing Addis Ababa restaurants.
/// </summary>
public class RestaurantQuery
{
    private const int MaxLimit = 50;
    private int _limit = 20;

    /// <summary>
    /// Single Addis Ababa neighborhood filter (case-insensitive).
    /// </summary>
    /// <example>Bole</example>
    public string? Area { get; set; }

    /// <summary>
    /// Multiple Addis Ababa neighborhood filters (case-insensitive).
    /// </summary>
    /// <example>["Bole", "Kazanchis"]</example>
    public List<string>? Areas { get; set; }

    /// <summary>
    /// Maximum acceptable delivery fee in Ethiopian Birr (ETB).
    /// </summary>
    /// <example>60.00</example>
    [EtbAmount(ErrorMessage = "Maximum delivery fee must be a positive ETB amount with at most two decimal places.")]
    public decimal? MaxFeeEtb { get; set; }

    /// <summary>
    /// 1-based page number to retrieve.
    /// </summary>
    /// <example>1</example>
    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than zero.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Maximum number of restaurants per page (1 to 50).
    /// </summary>
    /// <example>10</example>
    [Range(1, MaxLimit, ErrorMessage = "Limit must be between 1 and 50.")]
    public int Limit
    {
        get => _limit;
        set => _limit = value > MaxLimit ? MaxLimit : (value < 1 ? 1 : value);
    }
}
