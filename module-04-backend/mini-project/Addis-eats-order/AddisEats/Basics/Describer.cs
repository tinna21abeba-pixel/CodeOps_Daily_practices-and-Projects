namespace AddisEats.Basics;

public static class Describer
{
    public static void Describe(int value)     => Console.WriteLine($"Describe(int) chosen: {value}");
    public static void Describe(string value)  => Console.WriteLine($"Describe(string) chosen: {value}");
    public static void Describe(decimal value) => Console.WriteLine($"Describe(decimal) chosen: {value}");

}
