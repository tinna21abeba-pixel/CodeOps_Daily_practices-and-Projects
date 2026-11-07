
Console.Write("Enter Customer name:  ");
string name=  Console.ReadLine() ?? "";

Console.Write("Enter mobile network: ");
string network=  Console.ReadLine() ?? "";

Console.Write("Enter topUp amount (ETB):  ");
string input=  Console.ReadLine() ?? "";

if (!Decimal.TryParse(input,out Decimal amount) || amount <=0 || amount > 5000)
{
    Console.WriteLine("Invalid amount! enter an amount between 0 and 5000 ETB");
};

 decimal bonusRate=network.Trim().ToLower() switch 
 {
   "ethio telecom"=> 0.05m,
   "safaricom" =>0.03,
   _=>0.00m

    
 };