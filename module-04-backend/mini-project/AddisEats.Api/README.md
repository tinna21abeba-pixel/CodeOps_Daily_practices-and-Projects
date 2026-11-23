# Addis Eats API

ASP.NET Core Web API for Addis Eats restaurant, menu, and order operations.

## Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Running the API
From this directory:
```bash
dotnet run
```
By default, the application runs and serves Swagger documentation at:
- `http://localhost:5062/swagger`

---

## Complete Route Table

| Verb | Path | Constraints | Query Parameters | Success Code | Failure Codes | Purpose |
|---|---|---|---|---|---|---|
| GET | `/api/v1/restaurants` | None | `area` (string?), `areas` (List<string>?), `maxFeeEtb` (decimal?), `page` (int, default: 1), `limit` (int, default: 20) | 200 OK | 400 Bad Request | List restaurants in envelope format with multi-value filtering and pagination |
| GET | `/api/v1/restaurants/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve details of a single restaurant by integer ID |
| GET | `/api/v1/restaurants/{id:int}/menu` | `id:int` | `category` (string?) | 200 OK | 404 Not Found | Retrieve menu items for a specific restaurant |
| GET | `/api/v1/orders/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve order details and current status |
| POST | `/api/v1/orders` | None | None | 201 Created | 400 Bad Request | Place a new customer order returning Location header from CreatedAtAction |
| PATCH | `/api/v1/orders/{id:int}/status` | `id:int` | None | 200 OK | 404 Not Found, 409 Conflict | Update order lifecycle status (returns 409 if order was already delivered) |
| GET | `/api/v1/menu` | None | `category` (string?), `page` (int?), `pageSize` (int?) | 200 OK | None | List global menu items in standard envelope |
| GET | `/api/v1/menu/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve a specific menu item by integer ID |
| POST | `/api/v1/menu` | None | None | 201 Created | 400 Bad Request | Create a new menu item returning Location header |

---

## Architectural & Design Implementations

### Route Constraints
Every identifier route segment is constrained with `:int`:
- `GET /api/v1/restaurants/{id:int}`
- `GET /api/v1/restaurants/{id:int}/menu`
- `GET /api/v1/orders/{id:int}`
- `PATCH /api/v1/orders/{id:int}/status`
- `GET /api/v1/menu/{id:int}`

Non-integer values (such as `/api/v1/restaurants/abc`) fail route matching at route selection time and return `404 Not Found`.

### Bound Query Object & Multi-Value Filtering
`RestaurantQuery` is bound using `[FromQuery]` on `GET /api/v1/restaurants`:
- `Area` (`string?`) - Optional single area filter
- `Areas` (`List<string>?`) - Optional multi-value area filter (e.g., `?areas=Bole&areas=Piassa`)
- `MaxFeeEtb` (`decimal?`) - Nullable filter so missing parameter does not default to 0
- `Page` (`int`, default: 1)
- `Limit` (`int`, default: 20)

### Consistent Collection Envelope
All collection endpoints return the standard `PagedResponse<T>` envelope:
```json
{
  "data": [ ... ],
  "page": 1,
  "pageSize": 20
}
```

### Orders Controller & Location Header
`OrdersController` handles order reads and writes:
- `POST /api/v1/orders` creates an order and returns `201 Created` with a resolving `Location` header via `CreatedAtAction(nameof(GetById), new { id = order.Id }, order)`.
- `PATCH /api/v1/orders/{id:int}/status` updates order status and guards against invalid transitions (e.g., cancelling an already delivered order returns `409 Conflict`).

### JSON Formatting
Configured in `Program.cs`:
- Property naming policy: camelCase
- Null value handling: omitted nulls (`JsonIgnoreCondition.WhenWritingNull`)
- Enum conversion: string enums (`JsonStringEnumConverter`)
