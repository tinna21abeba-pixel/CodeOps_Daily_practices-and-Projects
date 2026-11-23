namespace AddisEats.Api.Validation;

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class EthiopianMobileAttribute : ValidationAttribute
{
    private static readonly Regex MobileRegex = new(
        @"^(?:09\d{8}|07\d{8}|\+2519\d{8}|\+2517\d{8})$",
        RegexOptions.Compiled);

    public EthiopianMobileAttribute()
        : base("The field must be a valid Ethiopian mobile phone number starting with 09, 07, +2519, or +2517.")
    {
    }

    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true;
        }

        if (value is not string phone)
        {
            return false;
        }

        var trimmed = phone.Trim();
        return MobileRegex.IsMatch(trimmed);
    }
}
