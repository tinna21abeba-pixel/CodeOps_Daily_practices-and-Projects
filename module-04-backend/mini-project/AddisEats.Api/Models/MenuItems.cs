namespace AddisEats.Api.Models;

public class MenuItem
{
    public int Id { get; set; }
    public String Name { get; set; }
    public String Category{ get; set; }

    public decimal PRice { get; set; }

    public decimal PriceWithVat{ get; set; }
    
}