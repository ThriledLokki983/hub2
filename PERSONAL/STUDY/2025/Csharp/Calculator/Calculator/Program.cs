namespace Calculator;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Enter your first number:");
        // Get user input and stores it
        int firstInputValue = int.Parse(Console.ReadLine());
        Console.WriteLine("You entered: " + firstInputValue);
        
        Console.WriteLine("Enter your second number");
        int secondInputValue = int.Parse(Console.ReadLine());
        Console.WriteLine("You entered: " + secondInputValue);

        if (int.IsPositive(firstInputValue) && int.IsPositive(secondInputValue))
        {
            var finalNumber = firstInputValue +  secondInputValue;
            Console.WriteLine($"The final number is: {finalNumber}");
        }
        else
        {
            Console.WriteLine("You entered an invalid number");
        }
        
        
        Console.ReadKey();
    }
}