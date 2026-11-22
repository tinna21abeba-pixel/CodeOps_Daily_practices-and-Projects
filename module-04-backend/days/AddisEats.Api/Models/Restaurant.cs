namespace AddisEats.Api.Models;

public class Restaurant
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public decimal DeliveryFee { get; set; }
    public string OwnerPhone { get; set; } = string.Empty;
    public decimal CommissionRate { get; set; }
    public List<MenuItem> Menu { get; set; } = new();
}
