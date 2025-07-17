using ShoppingApi.Models;

namespace ShoppingApi.Data
{
    public static class DbSeeder
    {
        public static void Seed(IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ShoppingContext>();

            if (context.Categories.Any()) return;

            var categories = new List<Category>
            {
                new Category { Name = "מוצרי חלב" },
                new Category { Name = "מאפים ולחמים" },
                new Category { Name = "ירקות" },
                new Category { Name = "פירות" },
                new Category { Name = "בשרים ודגים" },
                new Category { Name = "שתייה" },
                new Category { Name = "ניקיון וטואלטיקה" }
            };

            context.Categories.AddRange(categories);
            context.SaveChanges();

            var products = new List<Product>
            {
                new Product { Name = "חלב 3%", CategoryId = categories[0].Id, Price = 6.2m },
                new Product { Name = "גבינת קוטג'", CategoryId = categories[0].Id, Price = 5.9m },
                new Product { Name = "יוגורט טבעי", CategoryId = categories[0].Id, Price = 3.5m },
                new Product { Name = "שמנת מתוקה", CategoryId = categories[0].Id, Price = 6.8m },
                new Product { Name = "חמאה", CategoryId = categories[0].Id, Price = 4.8m },

                new Product { Name = "לחם פרוס", CategoryId = categories[1].Id, Price = 7.2m },
                new Product { Name = "חלה", CategoryId = categories[1].Id, Price = 8.5m },
                new Product { Name = "בגט", CategoryId = categories[1].Id, Price = 5.0m },
                new Product { Name = "עוגת שמרים", CategoryId = categories[1].Id, Price = 10.0m },
                new Product { Name = "קרואסון", CategoryId = categories[1].Id, Price = 4.5m },

                new Product { Name = "עגבנייה", CategoryId = categories[2].Id, Price = 2.5m },
                new Product { Name = "מלפפון", CategoryId = categories[2].Id, Price = 2.2m },
                new Product { Name = "גזר", CategoryId = categories[2].Id, Price = 2.7m },
                new Product { Name = "בצל", CategoryId = categories[2].Id, Price = 1.9m },
                new Product { Name = "שום", CategoryId = categories[2].Id, Price = 3.0m },

                new Product { Name = "תפוח", CategoryId = categories[3].Id, Price = 4.0m },
                new Product { Name = "בננה", CategoryId = categories[3].Id, Price = 3.8m },
                new Product { Name = "ענבים", CategoryId = categories[3].Id, Price = 5.0m },
                new Product { Name = "תות שדה", CategoryId = categories[3].Id, Price = 7.5m },
                new Product { Name = "קלמנטינה", CategoryId = categories[3].Id, Price = 3.3m },

                new Product { Name = "עוף שלם", CategoryId = categories[4].Id, Price = 24.0m },
                new Product { Name = "שניצל עוף", CategoryId = categories[4].Id, Price = 29.0m },
                new Product { Name = "דג סלמון", CategoryId = categories[4].Id, Price = 45.0m },
                new Product { Name = "קבב בקר", CategoryId = categories[4].Id, Price = 38.0m },

                new Product { Name = "מים מינרלים", CategoryId = categories[5].Id, Price = 6.0m },
                new Product { Name = "קולה", CategoryId = categories[5].Id, Price = 7.0m },
                new Product { Name = "מיץ תפוזים", CategoryId = categories[5].Id, Price = 6.5m },
                new Product { Name = "תה קר", CategoryId = categories[5].Id, Price = 5.9m },

                new Product { Name = "אבקת כביסה", CategoryId = categories[6].Id, Price = 18.5m },
                new Product { Name = "נוזל רצפות", CategoryId = categories[6].Id, Price = 9.9m },
                new Product { Name = "שקיות אשפה", CategoryId = categories[6].Id, Price = 7.5m },
                new Product { Name = "נייר טואלט", CategoryId = categories[6].Id, Price = 14.0m }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
