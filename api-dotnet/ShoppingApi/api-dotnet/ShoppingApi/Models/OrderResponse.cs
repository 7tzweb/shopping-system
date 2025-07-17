namespace ShoppingApi.Models;

public class OrderResponse
{
    public int Id { get; set; } // יכול להיות 0 אם לא נשמר ב-SQL
    public string FullName { get; set; }
    public string Address { get; set; }
    public string Email { get; set; }
    public List<OrderItem> Items { get; set; } = new();
}
