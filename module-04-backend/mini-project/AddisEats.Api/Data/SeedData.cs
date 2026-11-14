using System.Data.Common;
using AddisEats.Api.Models;

namespace AddisEats.api.Data;
public class SeedData
{
    public static List<Restuarant> restuarant = new List<Restuarant> 
    {
        new  Restuarant
        {
            Id=1,
            Name="Addis Abeba resturant",

        }
    };

}