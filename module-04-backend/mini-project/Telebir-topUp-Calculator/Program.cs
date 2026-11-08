using Spectre.Console;


Console.Write("enter your name: ");
string name = Console.ReadLine() ?? "";

Console.Write("enter your prefered network: ");
string network = Console.ReadLine() ?? "";

Console.Write("enter the amount (ETB): ");
string amount = Console.ReadLine() ?? "";

if (!Decimal.TryParse(amount, out Decimal input) || input <= 0 || input > 5000)
{
  Console.WriteLine("enter a valid number between 0 and 5000");
  return;
}

decimal bonusRate = network.Trim().ToLower() switch
{
  "ethio telecom" => 0.03m,
  "safaricom" => 0.05m,
  _ => 0.00m
};

decimal bonus = input * bonusRate;

decimal extraBonus = input >= 1000 ? 20m : 0m;
decimal totalAmount = input + bonus + extraBonus;
AnsiConsole.Write(
    new Rule("[bold cyan]ETHIO TOP-UP SERVICES[/]")
        .RuleStyle(Color.Cyan)
);
Console.WriteLine($"{"Customer",-12} {name}");
Console.WriteLine($"{"network",-12} {network}");
Console.WriteLine($"{"Bonus",-12} {bonus,12:N2} ETB");
Console.WriteLine($"{"amount",-12} {input,12:N2} ETB");
Console.WriteLine($"{"finalCrredit",-12} {totalAmount,12:N2} ETB");

AnsiConsole.MarkupLine(
    "\n[italic cyan]Thank you for using Ethio Top-Up![/]"
);

AnsiConsole.MarkupLine(
    "[italic green]Have a great day![/]"
);


