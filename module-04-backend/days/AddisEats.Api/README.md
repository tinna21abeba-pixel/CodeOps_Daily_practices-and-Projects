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




---

# Addis Eats API - Day 58 Exercises

## Exercise 1 - DataAnnotations on CreateOrderRequest

Annotated `CreateOrderRequest` with `[Required]`, `[Range]`, `[StringLength]`, and `[MinLength]`, specifying custom error messages for each validation rule:

```csharp
public class CreateOrderRequest : IValidatableObject
{
    [Required(ErrorMessage = "Restaurant ID is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Restaurant ID must be greater than zero.")]
    public int RestaurantId { get; set; }

    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, ErrorMessage = "Customer name cannot exceed 100 characters.")]
    [MinLength(2, ErrorMessage = "Customer name must be at least 2 characters long.")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Customer mobile phone number is required.")]
    [EthiopianMobile(ErrorMessage = "Customer phone must be a valid Ethiopian mobile number (09..., 07..., or +251...).")]
    public string CustomerPhone { get; set; } = string.Empty;

    public bool IsDelivery { get; set; } = true;

    [StringLength(200, ErrorMessage = "Delivery address cannot exceed 200 characters.")]
    public string? DeliveryAddress { get; set; }

    [StringLength(500, ErrorMessage = "Special instructions cannot exceed 500 characters.")]
    public string? SpecialInstructions { get; set; }

    [EtbAmount(ErrorMessage = "Tip amount must be positive with at most two decimal places.")]
    public decimal? TipEtb { get; set; }

    [Required(ErrorMessage = "Order items list is required.")]
    [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
    public List<OrderItemRequest> Items { get; set; } = new();
}
```

---

## Exercise 2 - EthiopianMobileAttribute

Created `EthiopianMobileAttribute` accepting prefixes `09`, `07`, `+2519`, and `+2517` with exactly 8 subsequent digits (total 9 digits after country code / 10 digits for domestic):
Regex: `^(?:09\d{8}|07\d{8}|\+2519\d{8}|\+2517\d{8})$`

### Test Numbers & Verification Results

| # | Phone Number | Form / Category | Expected | Actual Result | Status |
|---|---|---|---|---|---|
| 1 | `0911234567` | Valid 09 prefix (Ethio Telecom, 10 digits) | Valid | Accepted | Passed |
| 2 | `0712345678` | Valid 07 prefix (Safaricom, 10 digits) | Valid | Accepted | Passed |
| 3 | `+251911234567` | Valid +2519 format (Ethio Telecom) | Valid | Accepted | Passed |
| 4 | `+251712345678` | Valid +2517 format (Safaricom) | Valid | Accepted | Passed |
| 5 | `0811234567` | Invalid prefix 08 | Invalid | Rejected | Passed |
| 6 | `091123456` | Invalid length (9 digits, missing 1) | Invalid | Rejected | Passed |
| 7 | `+2519112345678` | Invalid length (10 digits after +251, too long) | Invalid | Rejected | Passed |
| 8 | `+252911234567` | Invalid country code (+252 Somalia, not +251) | Invalid | Rejected | Passed |

---

## Exercise 3 - EtbAmountAttribute

Created `EtbAmountAttribute` rejecting zero, negative numbers, and numbers with more than two decimal places.

### Verification Results

| Value Tested | Condition Checked | Expected | Actual Result |
|---|---|---|---|
| `480.505` | Decimal scale (3 decimal places) | Rejected | Rejected |
| `480.50` | Valid currency amount (2 decimal places) | Accepted | Accepted |
| `0.00` | Zero amount boundary | Rejected | Rejected |
| `-15.00` | Negative amount | Rejected | Rejected |

---

## Exercise 4 - Cross-Field Validation with IValidatableObject

Implemented `IValidatableObject` on `CreateOrderRequest` to enforce that `DeliveryAddress` is required when `IsDelivery` is `true`:

```csharp
public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
{
    if (IsDelivery && string.IsNullOrWhiteSpace(DeliveryAddress))
    {
        yield return new ValidationResult(
            "Delivery address is required when delivery is requested.",
            new[] { nameof(DeliveryAddress) });
    }
}
```

### One-line Explanation
Property attributes only validate a single property in isolation without contextual access to inspect or correlate other sibling properties on the object instance.

---

## Exercise 5 - Result<T>, Error, and IOrderService

Implemented `Error` and `Result<T>` domain types and refactored `IOrderService.Place` to return `Result<Order>`.

### Three Catalogue Error Codes Returned from IOrderService.Place:
1. `RESTAURANT_NOT_FOUND` (HTTP 404): Returned when the requested `restaurantId` does not exist in the catalogue.
2. `RESTAURANT_CLOSED` (HTTP 409): Returned when attempting to order from a restaurant that has no available menu items (e.g., Restaurant ID 12 "Effoi Pizza Sarbet").
3. `AMOUNT_INVALID` (HTTP 422): Returned when an ordered item does not belong to the restaurant, has non-positive quantity, or produces a non-positive total.

---

## Exercise 6 - Server-Side Order Pricing (Day 63 Foundation)

Removed `totalEtb` from `CreateOrderRequest` entirely so the client cannot submit or tamper with order pricing. The server calculates `TotalAmount` strictly from authoritative menu prices and configured delivery fees:
```csharp
decimal itemsTotal = 0m;
foreach (var itemReq in request.Items)
{
    var menuItem = restaurant.Menu.FirstOrDefault(m => m.Id == itemReq.MenuItemId);
    itemsTotal += menuItem.Price * itemReq.Quantity;
}
decimal deliveryFee = request.IsDelivery ? restaurant.DeliveryFee : 0m;
decimal tip = request.TipEtb ?? 0m;
decimal totalEtb = itemsTotal + deliveryFee + tip;
```

### Attempting to Order for 1 ETB
A client sends a payload containing an injected `"totalEtb": 1` field:
```json
POST /api/v1/orders
Content-Type: application/json

{
  "restaurantId": 1,
  "customerName": "Abebe Kebede",
  "customerPhone": "+251911234567",
  "deliveryAddress": "Cameroon St, Bole",
  "isDelivery": true,
  "items": [
    {
      "menuItemId": 101,
      "quantity": 1
    }
  ],
  "totalEtb": 1
}
```

### Recorded Observation
The server's JSON model binder binds the request to `CreateOrderRequest`, where `totalEtb` has been removed. The injected `"totalEtb": 1` property is completely ignored. The server fetches MenuItem `101` ("Doro Wat" at 450.00 ETB), adds Restaurant 1's delivery fee of 80.00 ETB, and sets `TotalAmount = 530.00 ETB`.

The server responds with `201 Created`:
```json
{
  "id": 3,
  "restaurantId": 1,
  "customerName": "Abebe Kebede",
  "customerPhone": "+251911234567",
  "deliveryAddress": "Cameroon St, Bole",
  "isDelivery": true,
  "items": [
    {
      "menuItemId": 101,
      "menuItemName": "Doro Wat",
      "unitPrice": 450.0,
      "quantity": 1
    }
  ],
  "deliveryFee": 80.0,
  "totalAmount": 530.0,
  "status": "Pending",
  "createdAt": "2026-11-23T15:10:00Z"
}
```
**Conclusion**: Price tampering has zero effect; price calculation is completely server-authoritative.

---

## Exercise 7 - Exception Middleware

Implemented `ExceptionMiddleware` registered first in `Program.cs` before any other middleware components.

### Deliberate Throw Verification
Endpoint: `GET /api/v1/health/error`
Triggers: `throw new InvalidOperationException("Deliberate unhandled exception for middleware verification.");`

### Response
- **Status Code**: `500 Internal Server Error`
- **Content-Type**: `application/problem+json`
- **Response Body**:
```json
{
  "type": "https://addiseats.et/errors/internal-server-error",
  "title": "An unexpected error occurred",
  "status": 500,
  "detail": "An unexpected error occurred on the server. Please contact support with the trace identifier.",
  "instance": "/api/v1/health/error",
  "traceId": "00-2d85b190c7457a8e8f8103cba7e7da2f-10c0bfd6c2999e2c-00"
}
```
**Confirmation**: Produces HTTP 500 with a unique `traceId` and zero internal stack trace leaked to the caller.

---

## Exercise 8 - Catalogue Codes Recorded from Real Requests

### 1. `VALIDATION_FAILED` (400 Bad Request)
**Request:**
```http
POST /api/v1/orders
Content-Type: application/json

{
  "restaurantId": 0,
  "customerName": "A",
  "customerPhone": "12345",
  "items": []
}
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/validation-failed",
  "title": "VALIDATION_FAILED",
  "status": 400,
  "detail": "One or more fields in your request are invalid. Please check your submission and try again.",
  "errors": {
    "RestaurantId": [
      "Restaurant ID must be greater than zero."
    ],
    "CustomerName": [
      "Customer name must be at least 2 characters long."
    ],
    "CustomerPhone": [
      "Customer phone must be a valid Ethiopian mobile number (09..., 07..., or +251...)."
    ],
    "Items": [
      "Order must contain at least one item."
    ]
  }
}
```

### 2. `UNKNOWN_QUERY_PARAMETER` (400 Bad Request)
**Request:**
```http
GET /api/v1/restaurants?unexpectedParam=test
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/unknown-query-parameter",
  "title": "UNKNOWN_QUERY_PARAMETER",
  "status": 400,
  "detail": "One or more unrecognized query parameters were provided. Please verify spelling. Unknown: 'unexpectedParam'."
}
```

### 3. `UNAUTHORIZED` (401 Unauthorized)
**Request:**
```http
GET /api/v1/orders/admin
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/unauthorized",
  "title": "UNAUTHORIZED",
  "status": 401,
  "detail": "You must be signed in to perform this request."
}
```

### 4. `PAYMENT_DECLINED` (402 Payment Required)
**Request:**
```http
GET /api/v1/payment?amount=999999
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/payment-declined",
  "title": "PAYMENT_DECLINED",
  "status": 402,
  "detail": "Your payment was declined by the provider. Please verify your balance and retry."
}
```

### 5. `PERMISSION_DENIED` (403 Forbidden)
**Request:**
```http
GET /api/v1/orders/admin
Authorization: Bearer CourierToken123
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/forbidden",
  "title": "PERMISSION_DENIED",
  "status": 403,
  "detail": "You do not have permission to perform this action."
}
```

### 6. `RESTAURANT_NOT_FOUND` (404 Not Found)
**Request:**
```http
GET /api/v1/restaurants/999
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/restaurant-not-found",
  "title": "RESTAURANT_NOT_FOUND",
  "status": 404,
  "detail": "The requested restaurant could not be found."
}
```

### 7. `ORDER_NOT_FOUND` (404 Not Found)
**Request:**
```http
GET /api/v1/orders/999
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/not-found",
  "title": "ORDER_NOT_FOUND",
  "status": 404,
  "detail": "The requested order with ID 999 could not be found."
}
```

### 8. `ORDER_ALREADY_DELIVERED` (409 Conflict)
**Request:**
```http
PATCH /api/v1/orders/2/status
Content-Type: application/json

{
  "status": "Cancelled"
}
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/order-already-delivered",
  "title": "ORDER_ALREADY_DELIVERED",
  "status": 409,
  "detail": "Order 2 has already been delivered and can no longer be modified or cancelled."
}
```

### Supplementary Catalogue Codes:

#### 9. `RESTAURANT_CLOSED` (409 Conflict)
**Request:**
```http
POST /api/v1/orders
Content-Type: application/json

{
  "restaurantId": 12,
  "customerName": "Abebe Kebede",
  "customerPhone": "+251911234567",
  "deliveryAddress": "Sarbet",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 1
    }
  ]
}
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/restaurant-closed",
  "title": "RESTAURANT_CLOSED",
  "status": 409,
  "detail": "Restaurant 'Effoi Pizza Sarbet' is currently closed. Please place your order during operating hours."
}
```

#### 10. `AMOUNT_INVALID` (422 Unprocessable Entity)
**Request:**
```http
POST /api/v1/orders
Content-Type: application/json

{
  "restaurantId": 1,
  "customerName": "Abebe Kebede",
  "customerPhone": "+251911234567",
  "deliveryAddress": "Cameroon St, Bole",
  "items": [
    {
      "menuItemId": 999,
      "quantity": 1
    }
  ]
}
```
**Response Body:**
```json
{
  "type": "https://addiseats.et/errors/amount-invalid",
  "title": "AMOUNT_INVALID",
  "status": 422,
  "detail": "Menu item with ID 999 does not belong to restaurant 'Bole Doro & Kitfo'."
}
```

---

## Git Commit Mapping (One Commit Each)

```bash
# Exercise 1: Annotate CreateOrderRequest
git add AddisEats.Api/Models/Order.cs
git commit -m "feat: annotate CreateOrderRequest with Required, Range, StringLength and MinLength"

# Exercise 2: EthiopianMobileAttribute
git add AddisEats.Api/Validation/EthiopianMobileAttribute.cs
git commit -m "feat: implement EthiopianMobileAttribute accepting 09, 07 and both +251 forms"

# Exercise 3: EtbAmountAttribute
git add AddisEats.Api/Validation/EtbAmountAttribute.cs
git commit -m "feat: implement EtbAmountAttribute rejecting zero, negatives, and >2 decimal places"

# Exercise 4: IValidatableObject cross-field validation
git add AddisEats.Api/Models/Order.cs
git commit -m "feat: enforce cross-field rule with IValidatableObject on CreateOrderRequest"

# Exercise 5: Result<T>, Error, and IOrderService.Place
git add AddisEats.Api/Common/Error.cs AddisEats.Api/Common/Result.cs AddisEats.Api/Services/IOrderService.cs AddisEats.Api/Services/OrderService.cs
git commit -m "feat: add Result<T> and Error types and return catalogue codes from IOrderService.Place"

# Exercise 6: Server-side order total computation
git add AddisEats.Api/Models/Order.cs AddisEats.Api/Services/OrderService.cs AddisEats.Api/Controllers/OrdersController.cs
git commit -m "feat: compute order total on server from menu prices and remove totalEtb from request"

# Exercise 7: Exception middleware
git add AddisEats.Api/Middleware/ExceptionMiddleware.cs AddisEats.Api/Controllers/HealthController.cs AddisEats.Api/Program.cs
git commit -m "feat: add ExceptionMiddleware producing 500 with traceId and no stack trace"

# Exercise 8: Catalogue responses in README
git add AddisEats.Api/README.md AddisEats.Api/Filters/RejectUnknownQueryParamsFilter.cs AddisEats.Api/Controllers/PaymentController.cs AddisEats.Api/Controllers/RestaurantsController.cs
git commit -m "docs: produce all catalogue codes from real requests and record responses in README"
```


---

# Addis Eats API - Day 59 Exercises

## Exercise 1 - CorrelationIdMiddleware

Implemented `Middleware/CorrelationIdMiddleware.cs`:
- Reads `X-Correlation-Id` from incoming request headers; if missing or whitespace, generates a new 32-character hex GUID (`Guid.NewGuid().ToString("N")`).
- Sets `context.TraceIdentifier = correlationId`.
- Writes `X-Correlation-Id` back onto `context.Response.Headers`.
- Wraps downstream execution in `_logger.BeginScope(...)` with `CorrelationId`.

### Verification
- **With incoming header (`X-Correlation-Id: req-addis-42`)**:
  - `GET /api/v1/restaurants?area=Bole` returned HTTP `200` with response header `X-Correlation-Id: req-addis-42`.
- **Without incoming header**:
  - `GET /api/v1/health/error` generated and returned response header `X-Correlation-Id: a9b6fab2ff4d48469555d26209b58702` alongside the `500` error payload.

---

## Exercise 2 - RequestTimingMiddleware

Implemented `Middleware/RequestTimingMiddleware.cs`:
- Measures downstream request duration using `Stopwatch.StartNew()` inside a `try / finally` block.
- Logs HTTP method, request path, response status code, elapsed milliseconds, and `context.TraceIdentifier` (`CorrelationId`).
- Uses `LogLevel.Warning` when `elapsedMs > 1000`, and `LogLevel.Information` otherwise.

### Verification
- Fast request (`GET /api/v1/restaurants` -> 105 ms) logged at `info`:
```text
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      HTTP GET /api/v1/restaurants responded 200 in 105 ms [CorrelationId: req-addis-42]
```
- Slow request (`GET /api/v1/health/concurrency?tag=terminal-1&delayMs=1500` -> 1527 ms) logged at `warn`:
```text
warn: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      HTTP GET /api/v1/health/concurrency responded 200 in 1527 ms [CorrelationId: 11f7e66bd6734e48ae40adb3a8b9bb17]
```

---

## Exercise 3 - Pipeline Registration & Correlation ID Inside Timing Log

Registered `CorrelationIdMiddleware` first and `RequestTimingMiddleware` immediately second in `Program.cs` (before `ExceptionMiddleware` and all downstream middleware):
1. `CorrelationIdMiddleware` populates `context.TraceIdentifier` before any downstream component executes.
2. `RequestTimingMiddleware` wraps `ExceptionMiddleware`, so even unhandled exceptions that result in a `500` status code have their final status, timing, and correlation ID accurately logged.

### Confirmation
Log line with custom correlation ID `req-addis-42`:
```text
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      HTTP GET /api/v1/restaurants responded 200 in 105 ms [CorrelationId: req-addis-42]
```
Log line on unhandled exception (`500`) with generated correlation ID:
```text
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      HTTP GET /api/v1/health/error responded 500 in 66 ms [CorrelationId: a9b6fab2ff4d48469555d26209b58702]
```

---

## Exercise 4 - ApiKeyMiddleware on `/admin` Branch via `Map`

Implemented `Middleware/ApiKeyMiddleware.cs` and branched `/admin` in `Program.cs` using `app.Map("/admin", ...)`:
- Checks for `X-Api-Key` header; if missing or whitespace, immediately short-circuits with `401 Unauthorized` and an `application/problem+json` body.
- Applied exclusively inside `app.Map("/admin", ...)` so standard API routes (`/api/v1/restaurants`, `/api/v1/health`, etc.) are unaffected.

### Verification
- **`GET /admin` without `X-Api-Key`:**
  - Status: `401`
  - Body: `{"type":"https://addiseats.et/errors/unauthorized","title":"UNAUTHORIZED","status":401,"detail":"Missing required 'X-Api-Key' header."}`
- **`GET /admin` with `X-Api-Key: addis-secret-key`:**
  - Status: `200`
  - Body: `{"message":"Admin endpoint reached.","correlationId":"0018f0b9fdf2433cab964b113230238a"}`

---

## Exercise 5 - Scoped Service in Convention Middleware Constructor vs `InvokeAsync`

Created `IScopedRequestTracker` / `ScopedRequestTracker` (registered via `AddScoped`), `RequestTrackerMiddleware`, and `GET /api/v1/health/concurrency?tag=...&delayMs=...`.

### Part 1: Injected into Convention Middleware Constructor (Buggy)
1. **In `Development` (`ValidateScopes = true`)**: The app fails immediately at startup because convention middleware is constructed once from the root DI container:
```text
System.InvalidOperationException: Cannot resolve scoped service 'AddisEats.Api.Services.IScopedRequestTracker' from root provider.
```
2. **In `Production` (`--no-launch-profile`, `ValidateScopes = false`)**: The app starts and captures a single `ScopedRequestTracker` instance inside `RequestTrackerMiddleware` for the lifetime of the application (captive dependency). Calling `/api/v1/health/concurrency` concurrently from two terminals (`terminal-1` with `delayMs=1500` followed 300ms later by `terminal-2` with `delayMs=100`) produced:
```text
Terminal 1: {"middlewareInstanceId":"1c91332f-eaf6-4988-9b2a-01984e9e6492","controllerInstanceId":"933c8729-fee4-4997-88c6-9ca0c123f929","requestedTag":"terminal-1","tagOnEntry":"terminal-1","tagAfterDelay":"terminal-2"}
Terminal 2: {"middlewareInstanceId":"1c91332f-eaf6-4988-9b2a-01984e9e6492","controllerInstanceId":"aafe9d4a-8a03-4c27-9d75-6d0f5a896e90","requestedTag":"terminal-2","tagOnEntry":"terminal-2","tagAfterDelay":"terminal-2"}
```
**Observed Bug:** Both concurrent requests shared the exact same `middlewareInstanceId` (`1c91332f-eaf6-4988-9b2a-01984e9e6492`), different from each request's `controllerInstanceId`, and Terminal 2 overwrote `Tag` to `"terminal-2"` while Terminal 1 was awaiting its delay (`tagOnEntry: "terminal-1"`, `tagAfterDelay: "terminal-2"`).

### Part 2: Moved to `InvokeAsync(HttpContext context, IScopedRequestTracker tracker)` (Fixed)
Moving `IScopedRequestTracker` from the constructor into `InvokeAsync` resolves a fresh scoped instance from `context.RequestServices` on each request:
```text
Terminal 1: {"middlewareInstanceId":"c8475526-7f9b-4db8-954c-0626fb6170db","controllerInstanceId":"c8475526-7f9b-4db8-954c-0626fb6170db","requestedTag":"terminal-1","tagOnEntry":"terminal-1","tagAfterDelay":"terminal-1"}
Terminal 2: {"middlewareInstanceId":"14840c50-f924-427e-83cf-4da16fcb9af9","controllerInstanceId":"14840c50-f924-427e-83cf-4da16fcb9af9","requestedTag":"terminal-2","tagOnEntry":"terminal-2","tagAfterDelay":"terminal-2"}
```
**Observed Fix:** Starts cleanly in `Development`, each concurrent request receives its own isolated scoped instance (`middlewareInstanceId == controllerInstanceId`), and `tagAfterDelay` remains uncorrupted.

---

## Exercise 6 - `UseAuthorization` Above `UseAuthentication`

Configured `DemoBearerAuthenticationHandler` (`DemoBearer` scheme) and added `[Authorize]` endpoint `GET /api/v1/health/protected`.

- **Correct order (`UseAuthentication` before `UseAuthorization`)**:
  - `GET /api/v1/health/protected` with `Authorization: Bearer AdminToken` returns `200 OK`: `{"user":"AddisEatsUser","authenticated":true}`.
- **Swapped order (`UseAuthorization` above `UseAuthentication` in scratch experiment)**:
  - Calling `GET /api/v1/health/protected` with `Authorization: Bearer AdminToken` and `X-Correlation-Id: ex6-swapped-order` fails because `UseAuthorization` evaluates an unauthenticated `HttpContext.User` before `UseAuthentication` parses the bearer header.
  - **Exact Response:**
    - Status: `401`
    - Headers: `{'Content-Length': '0', 'Connection': 'close', 'Date': 'Thu, 26 Nov 2026 13:53:20 GMT', 'Server': 'Kestrel', 'X-Correlation-Id': 'ex6-swapped-order'}`
    - Body: `''` (empty)
  - **Exact Log Output:**
```text
info: AddisEats.Api.Auth.DemoBearerAuthenticationHandler[12]
      AuthenticationScheme: DemoBearer was challenged.
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      HTTP GET /api/v1/health/protected responded 401 in 12 ms [CorrelationId: ex6-swapped-order]
```

---

## Exercise 7 - AuditActionFilter

Implemented `Filters/AuditActionFilter.cs` (`IActionFilter`) registered globally in `AddControllers`, logging the resolved `ActionDescriptor.DisplayName` and JSON-serialized `ActionArguments` dictionary in `OnActionExecuting`:
```text
info: AddisEats.Api.Filters.AuditActionFilter[0]
      Audit: Executing AddisEats.Api.Controllers.RestaurantsController.Search (AddisEats.Api) with arguments {"query":{"Area":"Bole","Areas":null,"Name":null,"MaxFeeEtb":null,"Page":1,"Limit":10}}
```

### One-line Explanation
This could not be middleware because middleware runs outside MVC action invocation before model binding completes and therefore has no access to the resolved `ActionDescriptor` or bound C# `ActionArguments`.

---

## Exercise 8 - Final `Program.cs` Pipeline (Line-by-Line)

| Line(s) | Statement | Reason for Position |
|---|---|---|
| 64 | `app.UseMiddleware<CorrelationIdMiddleware>();` | Must run first so `HttpContext.TraceIdentifier`, the `X-Correlation-Id` response header, and the logging scope exist for every subsequent middleware, error handler, and timing log. |
| 65 | `app.UseMiddleware<RequestTimingMiddleware>();` | Placed immediately after correlation ID assignment and outside `ExceptionMiddleware` so it measures total request latency and records the final status code (including `500`s) with the correlation ID already populated. |
| 66 | `app.UseMiddleware<ExceptionMiddleware>();` | Wraps all Swagger, routing, auth, branched, and controller middleware so any unhandled downstream exception is caught and formatted as `500` `ProblemDetails` while keeping the timing and correlation middleware intact outside it. |
| 68-72 | `if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(); }` | Exposes OpenAPI JSON and Swagger UI only in `Development` and before HTTPS redirection/auth so local documentation loads without requiring API authentication. |
| 74 | `app.UseHttpsRedirection();` | Redirects plain HTTP requests to HTTPS early in the pipeline before CORS, auth, and endpoint execution. |
| 76 | `app.UseCors();` | Runs before authentication, authorization, and terminal endpoints so CORS headers and preflight `OPTIONS` responses are applied even when auth or downstream middleware short-circuits. |
| 78 | `app.UseAuthentication();` | Must run before `UseAuthorization` so incoming credentials (such as `Authorization: Bearer ...`) are validated and `HttpContext.User` is populated before authorization checks execute. |
| 79 | `app.UseAuthorization();` | Runs immediately after `UseAuthentication` and before endpoint execution (`MapControllers`) so `[Authorize]` policies evaluate the populated `ClaimsPrincipal` and reject unauthorized requests before controller code runs. |
| 81 | `app.UseMiddleware<RequestTrackerMiddleware>();` | Runs after routing/auth middleware and before controller execution so per-request scoped state is initialized inside `InvokeAsync` only for requests that proceed toward MVC endpoints. |
| 83-94 | `app.Map("/admin", adminApp => { ... });` | Branches `/admin` requests into an isolated sub-pipeline protected by `ApiKeyMiddleware` after shared cross-cutting concerns (correlation ID, timing, exceptions, CORS) have run, without affecting `MapControllers` routes. |
| 96 | `app.MapControllers();` | Terminal endpoint middleware that dispatches matched controller actions and executes MVC filters (`RejectUnknownQueryParamsFilter`, `AuditActionFilter`) after all pipeline middleware has run. |
| 98 | `app.Run();` | Starts the Kestrel web host and begins listening for incoming HTTP requests with the configured pipeline. |

---

## Git Commit Mapping (One Commit Each)

```bash
git add AddisEats.Api/Middleware/CorrelationIdMiddleware.cs
git commit -m "feat: add CorrelationIdMiddleware setting TraceIdentifier and X-Correlation-Id header"

git add AddisEats.Api/Middleware/RequestTimingMiddleware.cs
git commit -m "feat: add RequestTimingMiddleware logging method, path, status and Warning above 1000ms"

git add AddisEats.Api/Program.cs
git commit -m "feat: register CorrelationIdMiddleware and RequestTimingMiddleware in pipeline"

git add AddisEats.Api/Middleware/ApiKeyMiddleware.cs AddisEats.Api/Program.cs
git commit -m "feat: add ApiKeyMiddleware returning 401 when header missing on /admin Map branch"

git add AddisEats.Api/Services/IScopedRequestTracker.cs AddisEats.Api/Services/ScopedRequestTracker.cs AddisEats.Api/Middleware/RequestTrackerMiddleware.cs AddisEats.Api/Controllers/HealthController.cs AddisEats.Api/Program.cs
git commit -m "fix: move scoped service injection from convention middleware constructor to InvokeAsync"

git add AddisEats.Api/Auth/DemoBearerAuthenticationHandler.cs AddisEats.Api/Controllers/HealthController.cs AddisEats.Api/Program.cs
git commit -m "feat: add DemoBearer auth and protected endpoint verifying UseAuthentication before UseAuthorization"

git add AddisEats.Api/Filters/AuditActionFilter.cs AddisEats.Api/Program.cs
git commit -m "feat: add AuditActionFilter logging action name and bound arguments"

git add AddisEats.Api/README.md
git commit -m "docs: record middleware experiments and line-by-line Program.cs pipeline in README"
```
