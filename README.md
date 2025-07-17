Shopping System – React + ASP.NET Core + SQL Server + Elasticsearch
Complete two-screen demo application for a shopping / order-entry flow, supplied as a monorepo:

Folder	Tech stack	Purpose
shopping-app/	React 18 + TypeScript + Redux Toolkit	Client – category / product selection, cart, order summary
api-dotnet/	ASP.NET Core 9 + EF Core	Server – REST API, SQL Server persistence, indexing to Elasticsearch

1 Prerequisites
Component	Version / notes
.NET SDK	9.0 preview x64 (or 8.0 – update TargetFramework if needed)
Node.js / npm	LTS v18 + (Create React App scaffold, Vite dev server)
SQL Server	LocalDB, Developer, or container (default localhost,1433)
Elasticsearch	8.x – run locally on a separate port (default http://localhost:9200)
Git	2.40 +

Quick Docker spin-up (optional)

bash
Copy
Edit
# Elasticsearch – single-node
docker run -d --name es -p 9200:9200 -e "discovery.type=single-node" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" docker.elastic.co/elasticsearch/elasticsearch:8.12.0

# SQL Server 2022
docker run -d --name sql -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Your_password123" \
  -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
2 Local setup
2.1 Clone & install
bash
Copy
Edit
git clone https://github.com/<your-user>/shopping-system.git
cd shopping-system
Client
bash
Copy
Edit
cd shopping-app
npm install            # installs React, Redux Toolkit, Vite, Bootstrap, etc.
npm run dev            # http://localhost:5173
Server
bash
Copy
Edit
cd ../api-dotnet
dotnet restore
dotnet ef database update   # applies initial schema to SQL Server
dotnet run                  # Swagger UI at https://localhost:5001/swagger
Bootstrap 5 is installed via npm and imported in shopping-app/src/index.css; no CDN required.

2.2 Configuration (api-dotnet/appsettings.json)
jsonc
Copy
Edit
{
  "ConnectionStrings": {
    "Sql": "Server=localhost,1433;Database=ShoppingDB;User Id=sa;Password=Your_password123;"
  },
  "Elastic": {
    "Uri": "http://localhost:9200",
    "Index": "orders"
  },
  "AllowedHosts": "*"
}
Edit values to match your environment; the Elastic section is read by ElasticOrderService.

3 Project structure
csharp
Copy
Edit
shopping-system
├─ shopping-app/
│  ├─ src/
│  │  ├─ app/                       # Redux store configuration
│  │  ├─ features/                  # Feature slices (cart, products, categories)
│  │  ├─ pages/OrdersSearch.tsx     # (future) order search screen
│  │  ├─ types/                     # Shared TypeScript models
│  │  └─ index.tsx / App.tsx        # Root React tree
│  └─ public/                       # Static assets
│
└─ api-dotnet/
   ├─ Controllers/OrdersController.cs   # POST /api/orders, GET /api/orders
   ├─ Data/ShoppingContext.cs           # EF Core DbContext – Orders & OrderItems
   ├─ Models/                           # POCOs + DTOs (Order, OrderItem, Request/Response)
   ├─ Services/ElasticOrderService.cs   # HTTP client → Elasticsearch index
   └─ Program.cs                        # .NET entry point, DI, routing, Swagger, CORS
Temporary build artifacts (bin/, obj/, node_modules/, etc.) are excluded via .gitignore.

4 Application flow
mermaid
Copy
Edit
sequenceDiagram
  autonumber
  participant User
  participant Browser
  participant API as .NET API
  participant SQL as SQL Server
  participant ES as Elasticsearch

  User->>Browser: Select category, add products
  Browser->>Browser: Redux state updates (cart)
  User->>Browser: "Proceed to checkout"
  Browser->>API: POST /api/orders {order + items}
  API->>SQL: INSERT Orders + OrderItems
  API->>ES: Index order document
  API-->>Browser: 201 Created + orderId
  Browser-->>User: Success message
Categories & products load on first render.

Cart is managed in Redux; UI updates instantly.

On submit order, the API:

Validates required fields.

Saves relational data in SQL Server.

Indexes a denormalised document in Elasticsearch.

Client shows confirmation and clears the cart.

5 Useful scripts
Directory	Command	Purpose
shopping-app	npm run dev	Vite dev server with hot-reload (port 5173)
npm run build	Production bundle
api-dotnet	dotnet run	Launch API; Swagger at /swagger
dotnet test	Placeholder for unit tests
dotnet ef migrations add <name>	Create DB migration

6 Troubleshooting
Symptom	Likely cause	Resolution
curl http://localhost:9200 fails	Elasticsearch not running / wrong URI	Start ES container / update Elastic:Uri
SQL connection error (error: 40)	SQL container down / bad creds	Start container, verify SA_PASSWORD
POST /api/orders returns 500	ES mapping mismatch / invalid JSON	Check ElasticOrderService logs, fix mapping

7 Roadmap
Order search UI – query /api/orders and display results.

CI/CD via GitHub Actions: build, tests, deploy to Azure or AWS.

Docker Compose for single-command onboarding.

JWT authentication and rate limiting on the API.