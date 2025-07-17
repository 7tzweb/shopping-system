using Microsoft.AspNetCore.Mvc;
using ShoppingApi.Data;
using ShoppingApi.Models;
using ShoppingApi.Services;
using Microsoft.EntityFrameworkCore;

namespace ShoppingApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ShoppingContext _db;
        private readonly ElasticOrderService _elastic;

        public OrdersController(ShoppingContext db, ElasticOrderService elastic)
        {
            _db = db;
            _elastic = elastic;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Address) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                request.Items.Count == 0)
            {
                return BadRequest("Missing required fields or empty cart.");
            }

            var order = new Order
            {
                FullName = request.FullName,
                Address = request.Address,
                Email = request.Email,
                Items = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.Id,
                    Name = i.Name,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            };

            // שמירה לבסיס הנתונים
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            // ניסיון אינדוקס ל-Elasticsearch (לא עוצר במקרה של כשל)
            var success = await _elastic.IndexOrderAsync(order);
            if (!success)
            {
                Console.WriteLine("⚠️ Failed to index order in Elasticsearch");
                // לא מחזיר שגיאה ללקוח – כדי ש־React לא יציג Failed to fetch
            }

            return Ok(new { message = "Order saved successfully" });
        }
    }
}
