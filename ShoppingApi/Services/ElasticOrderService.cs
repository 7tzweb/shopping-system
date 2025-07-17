using System.Text;
using System.Text.Json;
using ShoppingApi.Models;

namespace ShoppingApi.Services
{
    public class ElasticOrderService
    {
        private readonly HttpClient _httpClient;
        private readonly string _elasticUrl;

        public ElasticOrderService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _elasticUrl = configuration["ElasticSearch:Url"] ?? "http://localhost:9200";
        }

        public async Task<bool> IndexOrderAsync(Order order)
        {
            try
            {
                var json = JsonSerializer.Serialize(order);
                Console.WriteLine("📤 JSON sent to Elasticsearch:");
                Console.WriteLine(json);

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{_elasticUrl}/orders/_doc", content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"⚠️ Elasticsearch error: {response.StatusCode} - {responseContent}");
                    return false;
                }

                Console.WriteLine("✅ Order saved to Elasticsearch.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Exception while sending to Elasticsearch: " + ex.Message);
                return false;
            }
        }
    }
}
