namespace ShoppingApi.Models
{
    public class OrderRequest
    {
        public string FullName { get; set; } = "";
        public string Address { get; set; } = "";
        public string Email { get; set; } = "";
        public List<CartItem> Items { get; set; } = new();
    }

    public class CartItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
