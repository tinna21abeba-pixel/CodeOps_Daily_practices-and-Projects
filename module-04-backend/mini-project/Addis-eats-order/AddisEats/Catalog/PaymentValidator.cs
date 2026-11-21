namespace AddisEats.Catalog;

public static class PaymentValidator
{
    public static void Validate(decimal etbAmount)
    {
        if (etbAmount <= 0)
            throw new ArgumentException("Amount must be greater than 0 ETB.", nameof(etbAmount));
        Console.WriteLine($"  Amount {etbAmount} ETB is valid.");
    }

    public static void RunDemo(decimal amount)
    {
        Console.WriteLine($"Trying amount {amount}:");
        try
        {
            Validate(amount);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"  caught: {ex.Message}");
        }
        finally
        {
            Console.WriteLine("  finally: runs whether or not it threw.");
        }
    }
}
