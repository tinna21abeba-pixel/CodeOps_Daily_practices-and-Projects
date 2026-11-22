# Addis Eats API

A running ASP.NET Core Web API over the Addis Eats menu and restaurant services.

## Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Running the API
From this directory:
```bash
dotnet run
```
By default, the application runs and serves Swagger documentation at:
- `http://localhost:5062/swagger` (or port specified in `Properties/launchSettings.json`)

---

## API Endpoints

### Menu Endpoints (`/api/v1/menu`)

#### 1. `GET /api/v1/menu`
Retrieves all menu items with optional category filtering and pagination.

- **Query Parameters**:
  - `category` (optional, string): Filters items by category (e.g., `Food`, `Drinks`).
  - `page` (optional, integer): Page number (1-based).
  - `pageSize` (optional, integer): Items per page (defaults to `MenuOptions:DefaultPageSize` in `appsettings.json`, default: 10).
- **Status Codes**:
  - `200 OK`: Successfully returned list of menu items.

---

#### 2. `GET /api/v1/menu/{id}`
Retrieves a specific menu item by its integer ID.

- **Path Parameters**:
  - `id` (integer, required): Unique identifier of the menu item.
- **Status Codes**:
  - `200 OK`: Menu item found and returned.
  - `404 Not Found`: No menu item with the specified ID exists.

---

#### 3. `POST /api/v1/menu`
Creates a new menu item.

- **Request Body** (`application/json`):
  ```json
  {
    "name": "Shiro Tegabino",
    "category": "Food",
    "price": 180.00
  }
  ```
- **Validation Rules**:
  - `price` must be a positive ETB decimal (`price > 0`). Non-positive prices (<= 0) return `400 Bad Request`.
  - `name` cannot be empty.
  - `priceWithVat` is automatically computed at 15% VAT if not explicitly provided.
  - No ETB value is stored as a double; all monetary amounts use `decimal`.
- **Status Codes**:
  - `201 Created`: Item created successfully. Returns the created item and a `Location` header pointing to `/api/v1/menu/{id}`.
  - `400 Bad Request`: When price is non-positive (<= 0 ETB), name is missing, or payload is invalid.

---

### Restaurant Endpoints (`/api/v1/Resturant`)

#### 1. `GET /api/v1/Resturant`
Retrieves restaurant listings with optional address filter and pagination.
- **Status Codes**:
  - `200 OK`: Returns list of restaurants (as DTOs excluding sensitive owner details).

#### 2. `GET /api/v1/Resturant/{id}`
Retrieves a restaurant by ID.
- **Status Codes**:
  - `200 OK`: Restaurant found.
  - `404 Not Found`: Restaurant not found.

---

## Architecture & Design Patterns
- **Interface Segregation & Dependency Injection**: `MenuService` implements `IMenuService` and is registered as scoped (`builder.Services.AddScoped<IMenuService, MenuService>()`). No controller calls `new` on any service.
- **Options Pattern**: Default page size is configured in `appsettings.json` under `"MenuOptions"`, bound to `MenuOptions`, and injected via `IOptions<MenuOptions>`.
- **Accurate Currency Storage**: All monetary ETB values are strictly typed as `decimal` throughout models, DTOs, and services.
