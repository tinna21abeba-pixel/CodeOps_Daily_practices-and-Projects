# Addis Eats API - Day 56 Exercises

## Exercise 1 - Route Constraints (:int)

Added `:int` constraints to every `id` segment:
- `[HttpGet("{id:int}")]`
- `[HttpGet("{id:int}/menu")]`

### Verification
When requesting `GET /api/v1/restaurants/abc`:
- **Without constraint (`{id}`)**: The route matches `"abc"`. During model binding, ASP.NET Core tries to parse `"abc"` into `int id`. Because parsing fails, model binding returns `400 Bad Request`.
- **With constraint (`{id:int}`)**: Routing fails to match the URL to the action template at the route selection phase. Since no candidate endpoint matches, ASP.NET Core returns `404 Not Found`.

**Observed Result:** `GET http://localhost:5095/api/v1/restaurants/abc` returns HTTP status `404`.

---

## Exercise 2 - Route Parameter Name Mismatch

Renamed route parameter to `{restaurantId:int}` while leaving method parameter as `int id`:
`[HttpGet("{restaurantId:int}")] public IActionResult GetById(int id)`

### Observation
A request to `GET /api/v1/restaurants/1` matches the route `{restaurantId:int}`, but model binding cannot find any value mapped to `id`. Consequently, `id` defaults to `0`, resulting in a lookup for restaurant ID 0 and returning `404 Not Found`.

### One-line Explanation
It is not a compile error because route templates are string literals evaluated at runtime by ASP.NET Core routing, not checked at compile time against C# method parameter names.

---

## Exercise 3 - RestaurantQuery Class with [FromQuery]

Created `RestaurantQuery` model with properties:
- `Area` (string?)
- `MaxFeeEtb` (decimal?)
- `Page` (int, default: 1)
- `Limit` (int, default: 10)

Controller action binds `RestaurantQuery` via `[FromQuery]`:
```csharp
[HttpGet]
public IActionResult Search([FromQuery] RestaurantQuery query)
{
    var restaurants = _restaurantService.Search(query);
    var dtos = restaurants.Select(r => r.ToDto());
    return Ok(dtos);
}
```
The query object is passed to `_restaurantService.Search(query)` unchanged.

---

## Exercise 4 - Multiple Areas Filtering

Added `List<string>? Areas` to `RestaurantQuery`.

### Verification
- **Multiple areas query (`?areas=Bole&areas=Piassa`)**: Returns all restaurants whose area is either Bole or Piassa (7 restaurants).
- **No areas provided (`?page=1&limit=10`)**: The filter condition is bypassed, returning all restaurants (10 restaurants) rather than empty results.

---

## Exercise 5 - Ambiguous Routes and Two Fixes

### Ambiguous Route Setup
Defined two conflicting endpoints:
- `[HttpGet("{id}")] public IActionResult GetById(string id)`
- `[HttpGet("{name}")] public IActionResult GetByName(string name)`

### Startup / Request Exception
```text
Microsoft.AspNetCore.Routing.Matching.AmbiguousMatchException: The request matched multiple endpoints. Matches:
AddisEats.Api.Controllers.RestaurantsController.GetById (AddisEats.Api)
AddisEats.Api.Controllers.RestaurantsController.GetByName (AddisEats.Api)
   at Microsoft.AspNetCore.Routing.Matching.DefaultEndpointSelector.ReportAmbiguity(CandidateSet candidateSet)
   at Microsoft.AspNetCore.Routing.Matching.DefaultEndpointSelector.ProcessFinalCandidates(HttpContext httpContext, CandidateSet candidateSet)
   at Microsoft.AspNetCore.Routing.Matching.DfaMatcher.MatchAsync(HttpContext httpContext)
   at Microsoft.AspNetCore.Routing.EndpointRoutingMiddleware.Invoke(HttpContext httpContext)
```
In Swagger/OpenAPI:
```text
Swashbuckle.AspNetCore.SwaggerGen.SwaggerGeneratorException: Conflicting method/path combination "GET api/v1/Restaurants/{id}" for actions - AddisEats.Api.Controllers.RestaurantsController.GetById, AddisEats.Api.Controllers.RestaurantsController.GetByName. Actions require a unique method/path combination for Swagger/OpenAPI 3.0.
```

### Fix 1 - Route Constraint
Disambiguated routes by applying type constraints so the patterns do not overlap:
- `[HttpGet("{id:int}")]` (matches only integer numeric IDs)
- `[HttpGet("{name:alpha}")]` (matches only alphabetic strings)

### Fix 2 - Distinct Literal Path
Separated the routes using unique literal prefix paths:
- `[HttpGet("{id:int}")]` (dispatches ID lookup)
- `[HttpGet("by-name/{name}")]` (dispatches name lookup)

---

## Exercise 6 - ActionResult<RestaurantDto> and Swagger Schema

Changed `GetOne` signature to return `ActionResult<RestaurantDto>`:
```csharp
[HttpGet("{id:int}")]
public ActionResult<RestaurantDto> GetOne(int id)
{
    var restaurant = _restaurantService.GetById(id);
    if (restaurant == null) return NotFound();
    return Ok(restaurant.ToDto());
}
```

### Swagger Schema Before (with `IActionResult`)
```json
"/api/v1/Restaurants/{id}": {
  "get": {
    "responses": {
      "200": {
        "description": "Success"
      }
    }
  }
}
```

### Swagger Schema After (with `ActionResult<RestaurantDto>`)
```json
"/api/v1/Restaurants/{id}": {
  "get": {
    "responses": {
      "200": {
        "description": "OK",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/RestaurantDto"
            }
          }
        }
      }
    }
  }
}
```

---

## Exercise 7 - OrdersController with CreatedAtAction & Location Header

Implemented `OrdersController` with:
- `GET /api/v1/orders/{id:int}`
- `POST /api/v1/orders` returning `201 Created` via `CreatedAtAction`:
```csharp
[HttpPost]
public IActionResult Create([FromBody] CreateOrderRequest request)
{
    int nextId = _orders.Count > 0 ? _orders.Max(o => o.Id) + 1 : 1;
    var order = new Order
    {
        Id = nextId,
        RestaurantId = request.RestaurantId,
        CustomerName = request.CustomerName,
        TotalAmount = request.TotalAmount,
        Status = OrderStatus.Pending,
        SpecialInstructions = request.SpecialInstructions,
        CreatedAt = DateTime.UtcNow
    };
    _orders.Add(order);
    return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
}
```

### Response & Header Confirmation
- **Status Code**: `201 Created`
- **Location Header**: `Location: http://localhost:5095/api/v1/Orders/2`

---

## Exercise 8 - JSON Options Configuration

Configured in `Program.cs`:
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
```

### Response Body Before Configuration
```json
{
  "Id": 1,
  "RestaurantId": 1,
  "CustomerName": "Abebe Kebede",
  "TotalAmount": 450.00,
  "Status": 1,
  "SpecialInstructions": null,
  "CreatedAt": "2026-11-22T20:00:00Z"
}
```

### Response Body After Configuration
```json
{
  "id": 1,
  "restaurantId": 1,
  "customerName": "Abebe Kebede",
  "totalAmount": 450.0,
  "status": "Preparing",
  "createdAt": "2026-11-22T20:00:00Z"
}
```
**Changes Applied:**
1. **camelCase**: Properties formatted as camelCase (`restaurantId`, `customerName`, `totalAmount`).
2. **Omitted Nulls**: `specialInstructions` (which was `null`) is excluded from the JSON payload.
3. **String Enums**: `status` is formatted as `"Preparing"` instead of its integer representation `1`.
