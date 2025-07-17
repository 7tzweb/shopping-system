using System;
using System.Collections.Generic;

namespace ShoppingApi.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public string Address { get; set; } = "";
        public string Email { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public int OrderId { get; set; }
        public Order? Order { get; set; }
    }
}
