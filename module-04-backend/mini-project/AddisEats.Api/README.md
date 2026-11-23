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

## Route Table

| Verb | Path | Constraints | Query Parameters | Success Code | Failure Codes | Purpose / Reason |
|---|---|---|---|---|---|---|
| GET | `/api/v1/restaurants` | None | `area` (string?), `areas` (List<string>?), `maxFeeEtb` (decimal?), `page` (int, default: 1), `limit` (int, default: 20) | 200 OK | 400 Bad Request | List restaurants in envelope format with multi-value filtering and capped pagination |
| GET | `/api/v1/restaurants/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve details of a single restaurant by integer ID |
| GET | `/api/v1/restaurants/{id:int}/menu-items` | `id:int` | `category` (string?) | 200 OK | 404 Not Found | List menu items belonging to a specific restaurant (max two levels of nesting) |
| GET | `/api/v1/orders/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve order details and current status |
| POST | `/api/v1/orders` | None | None | 201 Created | 400 Bad Request, 422 Unprocessable Entity | Place a new customer order returning Location header resolving to GET /api/v1/orders/{id} |
| PATCH | `/api/v1/orders/{id:int}/status` | `id:int` | None | 200 OK | 404 Not Found, 409 Conflict | Update order lifecycle status sub-resource without embedding action verbs in URI |
| GET | `/api/v1/menu-items` | None | `category` (string?), `page` (int?), `pageSize` (int?) | 200 OK | None | List global menu items in standard envelope with capped pagination |
| GET | `/api/v1/menu-items/{id:int}` | `id:int` | None | 200 OK | 404 Not Found | Retrieve a specific menu item by integer ID |
| POST | `/api/v1/menu-items` | None | None | 201 Created | 400 Bad Request, 422 Unprocessable Entity | Create a new menu item returning Location header |
| DELETE | `/api/v1/menu-items/{id:int}` | `id:int` | None | 204 No Content | 404 Not Found | Remove a menu item with an empty body response |

---

## Error Catalogue

| Code | Status | When | Message |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | A required request payload or field is missing or malformed | "One or more validation errors occurred. Please check your submission." |
| `UNKNOWN_QUERY_PARAMETER` | 400 | A query string contains an unsupported or misspelled key | "One or more unrecognized query parameters were provided. Please verify spelling." |
| `UNAUTHORIZED` | 401 | Missing authentication credentials or expired bearer token | "You must be signed in to perform this request." |
| `PAYMENT_DECLINED` | 402 | Payment transaction refused by mobile payment provider | "Your payment was declined by the provider. Please verify your balance and retry." |
| `PERMISSION_DENIED` | 403 | Authenticated user lacks authorization to perform the requested operation | "You do not have permission to perform this action." |
| `RESTAURANT_NOT_FOUND` | 404 | The requested restaurant ID does not exist in the system | "The requested restaurant could not be found." |
| `ORDER_NOT_FOUND` | 404 | The requested order ID does not exist in the system | "The requested order could not be found." |
| `MENU_ITEM_NOT_FOUND` | 404 | The requested menu item ID does not exist in the system | "The requested menu item could not be found." |
| `ORDER_ALREADY_DELIVERED` | 409 | Attempting to cancel or modify an order that has already been delivered | "This order has already been delivered and can no longer be modified or cancelled." |
| `RESTAURANT_CLOSED` | 409 | Attempting to place an order outside restaurant operating hours | "This restaurant is currently closed. Please place your order during operating hours." |
| `AMOUNT_INVALID` | 422 | Monetary ETB total is zero, negative, or violates domain rules | "The specified ETB monetary amount is invalid. Total must be greater than zero." |

---

## Architectural & RESTful Design Guarantees

### Resource Naming & Nesting
- Every path is a plural, lowercase, hyphenated noun (`/restaurants`, `/orders`, `/menu-items`).
- Identifiers reside exclusively in path segments (`{id:int}`) and filters reside in query strings (`?area=`, `?areas=`, `?maxFeeEtb=`, `?category=`, `?page=`, `?limit=`).
- Nesting stops at two levels (`/restaurants/{id}/menu-items` and `/orders/{id}/status`). No three-level paths exist.

### Method & Status Code Semantics
- Success status codes are used distinctly:
  - `200 OK`: Successful reads (`GET`) and partial status updates (`PATCH`) returning data.
  - `201 Created`: Resource creation (`POST`) returning entity and resolving `Location` header.
  - `204 No Content`: Successful deletion (`DELETE`) returning a completely empty body.
- Empty collection queries return `200 OK` with an empty collection list rather than `404 Not Found`.

### Error Handling & ProblemDetails Uniformity
- Strict 4xx/5xx boundary: caller mistakes return 4xx (`400`, `404`, `409`, `422`) and never `500 Internal Server Error`.
- All error responses conform to RFC 7807 `ProblemDetails` schema containing `type`, `title`, `status`, and `detail`.

### Capped Pagination
- Unbounded queries are prevented by enforcing a maximum `Limit` and `PageSize` of 50.
- All collection responses use the identical envelope structure:
```json
{
  "data": [ ... ],
  "page": 1,
  "pageSize": 20
}
```
