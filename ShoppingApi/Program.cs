using Microsoft.EntityFrameworkCore;
using ShoppingApi.Data;
using ShoppingApi.Models;
using ShoppingApi.Services;
using Elasticsearch.Net;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ✅ EF Core
builder.Services.AddDbContext<ShoppingContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
DbSeeder.Seed(app); // אופציונלי

// ✅ Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

// ✅ API – קבלת קטגוריות
app.MapGet("/api/categories", async (ShoppingContext db) =>
{
    return await db.Categories.ToListAsync();
});

// ✅ API – קבלת מוצרים לפי קטגוריה
app.MapGet("/api/products", async (int categoryId, ShoppingContext db) =>
{
    return await db.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
});

// ✅ API – יצירת הזמנה עם החזרת תוכן (לא 204!)
app.MapPost("/api/orders", async (OrderRequest request, ShoppingContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Address) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        request.Items.Count == 0)
    {
        return Results.BadRequest("Missing required fields or empty cart.");
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
        }).ToList(),
        CreatedAt = DateTime.UtcNow
    };

    db.Orders.Add(order);
    await db.SaveChangesAsync();

    // ✅ ניסיון לא מסוכן ל-Elasticsearch – רץ ברקע
    _ = Task.Run(async () =>
    {
        try
        {
            var settings = new ConnectionConfiguration(new Uri("http://localhost:9200"))
                .RequestTimeout(TimeSpan.FromSeconds(10));
            var elastic = new ElasticLowLevelClient(settings);

            var ping = await elastic.PingAsync<StringResponse>();
            if (!ping.Success)
            {
                Console.WriteLine("⚠️ Elasticsearch is unavailable – skipping index.");
                return;
            }

            // 🔥 שליחה "שטוחה" ל־Elasticsearch בלי ריקורסיה
            var elasticOrder = new
            {
                order.Id,
                order.FullName,
                order.Address,
                order.Email,
                order.CreatedAt,
                Items = order.Items.Select(i => new
                {
                    i.ProductId,
                    i.Name,
                    i.Price,
                    i.Quantity
                }).ToList()
            };

            var indexResponse = await elastic.IndexAsync<BytesResponse>(
                "orders", order.Id.ToString(), PostData.Serializable(elasticOrder));

            if (!indexResponse.Success)
            {
                Console.WriteLine("⚠️ Elasticsearch indexing failed:");
                Console.WriteLine(indexResponse.DebugInformation);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Exception while sending to Elasticsearch (non-blocking): " + ex.Message);
        }
    });

    return Results.Ok(new
    {
        message = "Order saved successfully",
        orderId = order.Id
    });
});

// ✅ API – שליפת הזמנות מ־Elasticsearch
app.MapGet("/api/orders", async () =>
{
    try
    {
        var settings = new ConnectionConfiguration(new Uri("http://localhost:9200"))
            .RequestTimeout(TimeSpan.FromSeconds(10));
        var elastic = new ElasticLowLevelClient(settings);

        var response = await elastic.SearchAsync<StringResponse>("orders", PostData.Serializable(new
        {
            size = 100,
            sort = new[] { new { Id = new { order = "desc" } } }
        }));

        if (!response.Success)
        {
            Console.WriteLine("⚠️ Elastic fetch failed: " + response.DebugInformation);
            return Results.Ok(new List<OrderResponse>());
        }

        using var doc = JsonDocument.Parse(response.Body);
        var orders = doc.RootElement.GetProperty("hits").GetProperty("hits")
            .EnumerateArray()
            .Select(hit => JsonSerializer.Deserialize<OrderResponse>(hit.GetProperty("_source").GetRawText()))
            .ToList();

        return Results.Ok(orders);
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ Exception while fetching orders: " + ex.Message);
        return Results.Ok(new List<OrderResponse>());
    }
});

app.Run();
