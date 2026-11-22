namespace AddisEats.Api.Models;

public class Restaurant
{
    public int Id { get; init; }
    public string Name { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public decimal DeliveryFeeEtb { get; set; }
    public bool IsActive { get; set; } = true;
    public string OwnerPhone { get; set; } = string.Empty;
    public decimal CommissionRate { get; set; }
    public List<MenuItem> Menu { get; set; } = new();

    public string Address
    {
        get => Area;
        set => Area = value;
    }

    public string Phone
    {
        get => OwnerPhone;
        set => OwnerPhone = value;
    }

    public string OwnerAddress { get; set; } = string.Empty;

    public bool IsAcitve
    {
        get => IsActive;
        set => IsActive = value;
    }

    public decimal DeliveryFee
    {
        get => DeliveryFeeEtb;
        set => DeliveryFeeEtb = value;
    }
}

public class Resturant : Restaurant
{
}

public class Restuarant : Restaurant
{
}
