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

---

# Addis Eats API - Day 57 Exercises

## Exercise 1 - Complete Route Table

| Method | Path | Purpose | Success Code | Failure Codes |
|---|---|---|---|---|
| GET | `/api/v1/restaurants` | List restaurants with optional filtering and pagination | 200 OK | 400 Bad Request |
| GET | `/api/v1/restaurants/{id}` | Retrieve details of a specific restaurant by integer ID | 200 OK | 404 Not Found |
| GET | `/api/v1/restaurants/{id}/menu` | Retrieve menu items belonging to a specific restaurant | 200 OK | 404 Not Found |
| GET | `/api/v1/orders/{id}` | Retrieve details and status of an existing order | 200 OK | 404 Not Found |
| POST | `/api/v1/orders` | Create and place a new customer order | 201 Created | 400 Bad Request, 422 Unprocessable Entity |
| PATCH | `/api/v1/orders/{id}/status` | Update or transition lifecycle status of an order | 200 OK | 404 Not Found, 409 Conflict |
| GET | `/api/v1/delivery/options` | Retrieve configured delivery fee options and thresholds | 200 OK | None |
| GET | `/api/v1/health` | Health check endpoint returning service instance timestamps | 200 OK | None |
| GET | `/api/v1/payment` | Simulate payment transaction processing with active provider | 200 OK | 400 Bad Request, 402 Payment Required |

---

## Exercise 2 - Path Segment Classification (Identifier vs Filter)

### Path Segment Breakdown
- `/api`: API namespace prefix
- `/v1`: API version prefix
- `/restaurants`: Collection resource noun
- `/restaurants/{id}`:
  - `restaurants`: Collection noun
  - `{id}`: **Identifier** (uniquely addresses a single restaurant entity)
- `/restaurants/{id}/menu`:
  - `restaurants`: Collection noun
  - `{id}`: **Identifier**
  - `menu`: Sub-resource collection noun
- `/orders`: Collection resource noun
- `/orders/{id}`:
  - `orders`: Collection noun
  - `{id}`: **Identifier** (uniquely addresses a single order entity)
- `/orders/{id}/status`:
  - `orders`: Collection noun
  - `{id}`: **Identifier**
  - `status`: Sub-resource state noun
- `/delivery/options`:
  - `delivery`: Namespace resource noun
  - `options`: Sub-resource configuration noun
- `/health`: Diagnostic utility resource noun
- `/payment`: Resource noun

### Relocation and Recorded Changes
- **Previous Route**: `GET /api/v1/restaurants/by-name/{name}`
- **Issue**: The segment `{name}` is a **Filter** rather than an entity identifier. In REST design, identifiers uniquely locate a resource and belong in the path, whereas filters subset a collection and belong in the query string.
- **Change Implemented**: Removed the static path segment `/by-name/{name}` and relocated name matching to a query parameter on the root collection: `GET /api/v1/restaurants?name={name}`. Updated `RestaurantQuery` model with property `Name` and configured `RestaurantService.Search` to filter by name.

---

## Exercise 3 - Path Verbs and Part 2 Rewrites

### 1. Order Cancellation Operation
- **Approach 1 (Model the state as a sub-resource - Preferred)**:
  `PATCH /api/v1/orders/{id}/status`
  Payload: `{ "status": "Cancelled" }`
- **Approach 2 (Model the event as a resource)**:
  `POST /api/v1/orders/{id}/cancellations`
  Payload: `{ "reason": "Customer cancellation" }`
- **Approach 3 (Named verb scoped to the resource - Last Resort)**:
  `POST /api/v1/orders/{id}/cancel`
- **Chosen Approach**: `PATCH /api/v1/orders/{id}/status`
- **Reason**: State transitions represent partial updates to an existing resource lifecycle, making HTTP PATCH on a status sub-resource the cleanest RESTful abstraction without leaking verbs into the URI.

### 2. Payment Processing Operation
- **Approach 1 (Model the payment as a subordinate resource - Preferred)**:
  `POST /api/v1/orders/{id}/payments`
  Payload: `{ "amount": 450.00, "provider": "TeleBirr" }`
- **Approach 2 (Model payment as an independent top-level resource)**:
  `POST /api/v1/payments`
  Payload: `{ "orderId": 1, "amount": 450.00 }`
- **Approach 3 (Named verb scoped to the order)**:
  `POST /api/v1/orders/{id}/pay`
- **Chosen Approach**: `POST /api/v1/orders/{id}/payments`
- **Reason**: Orders own their payments, and nesting the creation under the order keeps paths noun-based while establishing an auditable transaction history.

---

## Exercise 4 - Error Catalogue

| Code | Status | When | Message |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | A required request field is missing, malformed, or fails type constraint | "One or more fields in your request are invalid. Please check your submission and try again." |
| `UNKNOWN_QUERY_PARAMETER` | 400 | The request contains a query parameter not defined on the endpoint | "One or more unrecognized query parameters were provided. Please verify spelling." |
| `UNAUTHORIZED` | 401 | Missing authentication header, malformed token, or expired session | "You must be signed in to perform this request." |
| `PAYMENT_DECLINED` | 402 | Payment provider (TeleBirr or CBE Birr) declined the charge | "Your payment was declined by the provider. Please verify your balance and retry." |
| `PERMISSION_DENIED` | 403 | Authenticated user role is forbidden from accessing or altering this resource | "You do not have permission to perform this action." |
| `RESTAURANT_NOT_FOUND` | 404 | The requested restaurant ID does not exist in the database | "The requested restaurant could not be found." |
| `ORDER_NOT_FOUND` | 404 | The requested order ID does not exist in the database | "The requested order could not be found." |
| `ORDER_ALREADY_DELIVERED` | 409 | Attempting to cancel or update an order that has already reached delivered status | "This order has already been delivered and can no longer be modified or cancelled." |
| `RESTAURANT_CLOSED` | 409 | Attempting to place an order outside the restaurant operating schedule | "This restaurant is currently closed. Please place your order during operating hours." |
| `AMOUNT_INVALID` | 422 | Monetary ETB total is zero, negative, or semantically unacceptable | "The specified ETB monetary amount is invalid. Total must be greater than zero." |

---

## Exercise 5 - Status Code Justifications

### 1. A search returning no rows
- **Status Code**: `200 OK`
- **Justification**: An empty collection is a successful search execution that yielded zero matches; returning 404 would inaccurately signify that the search endpoint itself does not exist.

### 2. Cancelling an order already delivered
- **Status Code**: `409 Conflict`
- **Justification**: The request conflicts with the current lifecycle state of the target order resource, as an order that has already been delivered cannot transition back to cancelled.

### 3. A request with a negative ETB total
- **Status Code**: `422 Unprocessable Entity`
- **Justification**: The request body is structurally well-formed JSON but violates domain business logic requiring positive ETB currency values.

### 4. A valid token belonging to a courier attempting to edit a menu
- **Status Code**: `403 Forbidden`
- **Justification**: The caller's identity was successfully authenticated, but the courier role is expressly denied authorization to modify restaurant menu resources.

---

## Exercise 6 - Badly Designed API Refactoring (Twelve Routes)

| # | Original Bad Route | Rewritten RESTful Route | Naming Rule Broken |
|---|---|---|---|
| 1 | `GET /getAllRestaurants` | `GET /api/v1/restaurants` | Nouns, never verbs: used action verb `getAll` instead of relying on the HTTP GET method. |
| 2 | `GET /getRestaurantById?id=14` | `GET /api/v1/restaurants/14` | Identifiers in the path: resource identifier was placed in query string, and used verb `getRestaurantById`. |
| 3 | `POST /createRestaurant` | `POST /api/v1/restaurants` | Nouns, never verbs: HTTP POST already defines creation; verb `create` is redundant in path. |
| 4 | `POST /updateRestaurantDetails?id=14` | `PATCH /api/v1/restaurants/14` | Method semantics and identifiers: used POST instead of PATCH, verb in path, and identifier in query. |
| 5 | `GET /restaurant` | `GET /api/v1/restaurants` | Plural collections: collection endpoints must use plural nouns (`restaurants`). |
| 6 | `POST /restaurants/14/menuItems/add` | `POST /api/v1/restaurants/14/menu-items` | Lowercase, hyphenated and nouns: used camelCase `menuItems` and action verb segment `add`. |
| 7 | `GET /orders/91.json` | `GET /api/v1/orders/91` | No file extensions: content negotiation handles payload formats; file extension `.json` in path is prohibited. |
| 8 | `GET /restaurants/` | `GET /api/v1/restaurants` | No trailing slash: canonical resource endpoints must not end with a trailing forward slash. |
| 9 | `GET /restaurants/area/Bole` | `GET /api/v1/restaurants?area=Bole` | Filters in the query: subset filtering criteria belongs in query strings rather than static path segments. |
| 10 | `GET /restaurants/14/menu/7/reviews/3` | `GET /api/v1/reviews/3` | Nesting depth: path exceeds two levels; reviews are independent entities accessible at root with filter (`?menuItemId=7`). |
| 11 | `POST /cancelOrder?id=91` | `PATCH /api/v1/orders/91/status` | Non-CRUD state modeling: used RPC action verb in path; order cancellation is a lifecycle state transition. |
| 12 | `POST /deleteMenuItem?id=5` | `DELETE /api/v1/menu-items/5` | Method semantics and identifiers: used POST instead of DELETE, verb in path, and identifier in query string. |

---

## Exercise 7 - Beyond REST: Architecture Comparison

### Scenario 1: A Public Mobile API
- **Technology Choice**: **REST**
- **Justification**: REST provides a uniform interface with native HTTP caching and universal client support across all mobile platforms without requiring custom query libraries. Its standard status codes and bounded endpoints minimize mobile battery and data usage while keeping public third-party integration simple and reliable.

### Scenario 2: An Internal Service-to-Service Call
- **Technology Choice**: **gRPC**
- **Justification**: gRPC utilizes HTTP/2 multiplexing and compact binary Protocol Buffers serialization to deliver low latency and high network throughput between internal backend services. Contract-first `.proto` service specifications generate strongly typed client and server code, catching interface incompatibilities at compile time rather than runtime.

### Scenario 3: A Dashboard Needing Six Resources on One Screen
- **Technology Choice**: **GraphQL**
- **Justification**: GraphQL allows the frontend client to query and aggregate data from six separate backend resources into a single HTTP request round-trip. This completely eliminates over-fetching and under-fetching by allowing the dashboard to declare the exact fields required for its composite display.

---

## Exercise 8 - Unknown Query Parameters Policy & Implementation

### Policy Decision
- **Chosen Policy**: **Reject** unknown query parameters with `400 Bad Request`.
- **Rationale**: Rejecting unknown query parameters catches client typos immediately (for example, sending `?areas=Bole` or `?lim=10` instead of `?area=Bole` or `?limit=10`). Silently ignoring unexpected parameters masks client bugs and leads callers to falsely assume filtering or pagination constraints were applied.

### Implementation Details
Implemented `RejectUnknownQueryParamsFilter` registered globally in `Program.cs`:
1. Dynamically inspects action parameter definitions and complex query model properties (such as `RestaurantQuery`).
2. Collects all recognized parameter keys.
3. If any key in `Request.Query` does not match the allowed list, immediately terminates the pipeline and returns `400 Bad Request` with an RFC 7807 `ProblemDetails` response:
```json
{
  "type": "https://addiseats.et/errors/validation",
  "title": "Unknown query parameter",
  "status": 400,
  "detail": "Unknown query parameter: 'unknownParam'."
}
```
4. Clamps `RestaurantQuery.Limit` to a maximum threshold of 50 to prevent unbounded queries.


