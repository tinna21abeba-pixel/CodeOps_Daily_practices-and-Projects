
Console.Write("Enter Customer name:  ");
string name = Console.ReadLine() ?? "";

Console.Write("Enter mobile network: ");
string network = Console.ReadLine() ?? "";

Console.Write("Enter topUp amount (ETB):  ");
string input = Console.ReadLine() ?? "";

if (!Decimal.TryParse(input, out Decimal amount) || amount <= 0 || amount > 5000)
{
    Console.WriteLine("Invalid amount! enter an amount between 0 and 5000 ETB");
    return;
};


decimal bonusRate = network.Trim().ToLower() switch
{
    "ethio telecom" => 0.05m,
    "safaricom" => 0.03m,
    _ => 0.00m


};

Decimal bonus= amount * bonusRate;
Decimal extraCredit=amount >=1000 ?20m :0m;
decimal finalCredit=amount + bonus + extraCredit;

Console.WriteLine("\n========== TOP-UP RECEIPT ==========");

Console.WriteLine($"{"Customer",12}: {name}");
Console.WriteLine($"{"Network",-20}: {network}");
Console.WriteLine($"{"Amount",-20}: {amount,12:N2} ETB");
Console.WriteLine($"{"Bonus",-20}: {bonus,12:N2} ETB");
Console.WriteLine($"{"Extra Credit",-20}: {extraCredit,12:N2} ETB");

Console.WriteLine("------------------------------------");

Console.WriteLine($"{"Final Credit",-20}: {finalCredit,12:N2} ETB");

Console.WriteLine("====================================");

