namespace TestApp;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
        // declare a variable
        string myFriendsName;
        myFriendsName = "Gideon";
        
        // Use the variable
        Console.WriteLine(myFriendsName);

        myFriendsName = "Emmanuel";

        Console.WriteLine(myFriendsName);
        Console.ReadKey();
    }
}