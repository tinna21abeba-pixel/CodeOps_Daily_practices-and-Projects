namespace AddisEats.Api.Validation;

using System.ComponentModel.DataAnnotations;
using System.Globalization;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class EtbAmountAttribute : ValidationAttribute
{
    public EtbAmountAttribute()
        : base("The amount must be greater than zero and have at most two decimal places.")
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        decimal amount;
        if (value is decimal d)
        {
            amount = d;
        }
        else if (value is int i)
        {
            amount = i;
        }
        else if (value is long l)
        {
            amount = l;
        }
        else if (value is double dbl)
        {
            amount = Convert.ToDecimal(dbl);
        }
        else if (decimal.TryParse(value.ToString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
        {
            amount = parsed;
        }
        else
        {
            return false;
        }

        if (amount <= 0m)
        {
            return false;
        }

        return decimal.Round(amount, 2) == amount;
    }
}
