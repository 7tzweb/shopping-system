# 🛒 Shopping System  
React 18 · ASP.NET Core 9 · SQL Server · Elasticsearch  

Demo app with two screens: **categories → cart → checkout**, delivered as a single repository.  

---

## ⚡ Quick Start (local)

    git clone https://github.com/<your-user>/shopping-system.git
    cd shopping-system

### 1 Infrastructure (Docker ≈ 1 min)

    # Elasticsearch 8 – single node
    docker run -d --name es -p 9200:9200 \
      -e "discovery.type=single-node" \
      -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
      docker.elastic.co/elasticsearch/elasticsearch:8.12.0

    # SQL Server 2022
    docker run -d --name sql -p 1433:1433 \
      -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Your_password123" \
      mcr.microsoft.com/mssql/server:2022-latest

### 2 Server (.NET 9)

    cd api-dotnet
    dotnet restore
    dotnet ef database update
    dotnet run                    # → https://localhost:5001/swagger

*(השאירו חלון זה פתוח)*  

### 3 Client (React 18)

    cd ../shopping-app
    npm install
    npm run dev                   # → http://localhost:5173

פתחו **<http://localhost:5173>** → בחרו קטגוריה, הוסיפו מוצרים ואשרו הזמנה.  
תיעוד API זמין ב-`/swagger`.

---

## 🔧 Prerequisites

| Tool / Service | Min Version | Notes |
|----------------|------------|-------|
| **.NET SDK**   | 9 preview (8 works if retargeted) |
| **Node LTS**   | 18+ |
| **SQL Server** | LocalDB / Developer / Docker |
| **Elasticsearch** | 8.x |
| **Git**        | 2.40+ |

### `api-dotnet/appsettings.json`

```jsonc
{
  "ConnectionStrings": {
    "Sql": "Server=localhost,1433;Database=ShoppingDB;User Id=sa;Password=Your_password123;"
  },
  "Elastic": {
    "Uri": "http://localhost:9200",
    "Index": "orders"
  }
}
```

# 📦 Key Dependencies
Server

Microsoft.EntityFrameworkCore.SqlServer

Swashbuckle.AspNetCore

Elasticsearch.Net + Elastic.Transport

Client

react, react-dom

react-router-dom

@reduxjs/toolkit, react-redux

axios

bootstrap 5

vite

TypeScript types

Bootstrap מיובא ב-shopping-app/src/index.css; אין צורך ב-CDN.

# 🗂️ Folder Structure
```
🔧 צד שרת – .NET 9 (ShoppingApi)
📁 ShoppingApi/ – תיקיית הבסיס של השרת
├── Program.cs – קובץ הראשי שמאתחל את האפליקציה, מוסיף שירותים (EF Core, CORS, Elasticsearch, Swagger) ומגדיר את הנתיבים (API).
├── ShoppingApi.csproj – קובץ ההגדרות של הפרויקט: כולל גרסה (net9.0) ותלויות (NuGet Packages).
├── 📁 Controllers/
│   └── OrdersController.cs – קונטרולר API שמטפל בבקשת POST להזמנה: שומר ל-SQL ול־Elasticsearch.
├── 📁 Models/
│   ├── Order.cs – מייצג הזמנה כולל פרטים אישיים ורשימת פריטים. נשמר ב-SQL.
│   ├── OrderItem.cs – מייצג מוצר בתוך הזמנה.
│   ├── OrderRequest.cs – DTO מהלקוח: מכיל שם, כתובת, אימייל, ורשימת מוצרים.
│   └── OrderResponse.cs – DTO שנשלח ללקוח מהשרת כשמחפשים ב-Elasticsearch.
├── 📁 Data/
│   ├── ShoppingContext.cs – EF Core DbContext: מנהל את הטבלאות (Orders, OrderItems, וכו’).
│   └── DbSeeder.cs – אופציונלי: זורע מידע דמה במסד הנתונים בעת עליית האפליקציה.
├── 📁 Services/
│   └── ElasticOrderService.cs – אחראי לשליחת הזמנה ל־Elasticsearch דרך HTTP POST.
├── 📁 Properties/
│   └── launchSettings.json – הגדרות הרצה מקומית (פורט, סביבה, כתובת בסיסית).

💻 צד לקוח – React (shopping-app)
📁 shopping-app/
├── App.tsx – קובץ ראשי שמכיל את המבנה הכללי של האפליקציה, רנדרינג של המסכים.
├── 📁 components/
│   ├── CategorySelector.tsx – קומפוננטת בחירת קטגוריה.
│   ├── ProductList.tsx – מציג את רשימת המוצרים לפי קטגוריה.
│   ├── Cart.tsx – מציג את העגלה והפריטים שנבחרו.
│   └── OrderSummary.tsx – מסך סיכום הזמנה: קבלת פרטי משתמש ושליחת ההזמנה לשרת.
├── 📁 redux/
│   ├── store.ts – הגדרת Redux store.
│   ├── cartSlice.ts – מנגנון Redux לניהול עגלה (הוספה, הסרה, כמות).
│   └── productSlice.ts – ניהול מוצרים שהגיעו מהשרת.
├── 📁 api/
│   └── api.ts – פונקציות לפנייה ל־API (GET מוצרים, POST הזמנה).
├── index.tsx – נקודת הכניסה לאפליקציה (ReactDOM.render).
├── package.json – תלותים של React והגדרות build.
```
🔄 Application Flow
```
Browser  → POST /api/orders
           → API → SQL  : INSERT Order + Items
                 → ES   : Index order
           ← 201 Created
```
קטגוריות ומוצרים נטענים מה-API.

סל הקניות מנוהל ב-Redux.

ההזמנה נשמרת ב-SQL ומאונדקסת ב-ES.

הודעת הצלחה וסל ריק.

# 🛠️ Common Scripts
Path	Command	Purpose
shopping-app	npm run dev	Vite + HMR
npm run build	Production bundle
api-dotnet	dotnet run	Launch API
dotnet ef migrations add <name>	New migration
Root	git pull / push	Sync repository

# 🩹 Troubleshooting
Issue	Cause	Fix
SQL error 40	Container not running / wrong password	docker ps, update SA_PASSWORD
Cannot connect :9200	ES not running	start container / update Elastic:Uri
500 POST /api/orders	Mapping mismatch	check API logs / Kibana
CORS error	Origin not allowed	ensure http://localhost:5173 allowed

