# Addis Eats API — Validation, Result Pattern & Global Error Architecture

## Overview

Addis Eats API implements comprehensive request validation across all five architectural layers, domain error encapsulation using a generic Result type with an error catalogue, server-authoritative monetary calculations, and a global exception handling middleware registered first in the pipeline.

---

## The Five Validation Layers

### Layer 1: Route Constraints
Route parameters enforce type matching directly during route evaluation.
- `GET /api/v1/restaurants/{id:int}`
- `GET /api/v1/restaurants/{id:int}/menu-items`
- `GET /api/v1/orders/{id:int}`
- `PATCH /api/v1/orders/{id:int}/status`
- `GET /api/v1/menu-items/{id:int}`
- `DELETE /api/v1/menu-items/{id:int}`

When a non-integer segment such as `/api/v1/restaurants/abc` is received, routing rejects candidate endpoints at the route selection phase, returning `404 Not Found`.

### Layer 2: Model Binding and Data Annotations
Every incoming request model is decorated with validation attributes specifying custom messages:
- `CreateOrderRequest`:
  - `RestaurantId`: `[Required]`, `[Range(1, int.MaxValue)]`
  - `CustomerName`: `[Required]`, `[StringLength(100)]`, `[MinLength(2)]`
  - `CustomerPhone`: `[Required]`, `[EthiopianMobile]`
  - `TipEtb`: `[EtbAmount]`
  - `Items`: `[Required]`, `[MinLength(1)]`
- `OrderItemRequest`:
  - `MenuItemId`: `[Required]`, `[Range(1, int.MaxValue)]`
  - `Quantity`: `[Required]`, `[Range(1, 100)]`
- `UpdateOrderStatusRequest`:
  - `Status`: `[Required]`
- `CreateMenuItemRequest`:
  - `Name`: `[Required]`, `[StringLength(100)]`, `[MinLength(2)]`
  - `Category`: `[Required]`, `[StringLength(50)]`
  - `Price`: `[Required]`, `[EtbAmount]`
- `PaymentRequest`:
  - `Provider`: `[Required]`
  - `Amount`: `[Required]`, `[EtbAmount]`
  - `Phone`: `[Required]`, `[EthiopianMobile]`
- `RestaurantQuery`:
  - `Page`: `[Range(1, int.MaxValue)]`
  - `Limit`: `[Range(1, 50)]`
  - `MaxFeeEtb`: `[EtbAmount]`

#### Custom Validation Attributes
- `EthiopianMobileAttribute`: Validates Ethiopian mobile phone numbers matching `^(?:09\d{8}|07\d{8}|\+2519\d{8}|\+2517\d{8})$`.
- `EtbAmountAttribute`: Enforces monetary amounts strictly greater than zero with at most two decimal places.

### Layer 3: Cross-Field Object Validation (IValidatableObject)
`CreateOrderRequest` implements `IValidatableObject` to validate dependencies across multiple fields:
- If `IsDelivery` is set to `true`, `DeliveryAddress` must not be null or whitespace.

### Layer 4: Pipeline and Action Filters
- `RejectUnknownQueryParamsFilter`: Evaluates query strings against permitted controller action parameters. Unknown query keys immediately terminate the pipeline with `400 Bad Request` and catalogue code `UNKNOWN_QUERY_PARAMETER`.
- `InvalidModelStateResponseFactory`: Configured in `Program.cs` to capture model binding and data annotation errors. It formats failures into a standardized ProblemDetails response with catalogue code `VALIDATION_FAILED`, a trace identifier, and an `errors` collection reporting all failed fields simultaneously.

### Layer 5: Business Rules via Result<T> and Error
Domain and business constraints are evaluated in service classes (`OrderService`, `RestaurantService`, `MenuService`, `PaymentService`) returning `Result<T>` instead of throwing runtime exceptions:
- Restaurant existence and active status checks
- Menu availability and menu item ownership verification
- Order lifecycle state transition validation
- Transaction thresholds for payment processing

---

## Server-Side Order Pricing Guarantee

No client is permitted to supply an order total. The `totalAmount` and `totalEtb` fields have been removed from `CreateOrderRequest`.

Order totals are calculated exclusively on the server:
- Item Subtotal: Sum of authoritative `menuItem.Price * item.Quantity` for verified items belonging to the selected restaurant.
- Delivery Fee: Restaurant's configured `DeliveryFeeEtb` applied only when `IsDelivery` is true.
- Tip: Validated optional `TipEtb`.
- Total: `Subtotal + DeliveryFee + Tip`.

Any client attempt to inject `"totalAmount": 1.00` or `"totalEtb": 1.00` into the request payload is ignored by the model binder.

---

## Global Exception Handling Middleware

`ExceptionMiddleware` is registered first in the ASP.NET Core pipeline:
1. Intercepts unhandled exceptions across all endpoints.
2. Extracts or generates a distributed trace identifier (`Activity.Current?.Id ?? context.TraceIdentifier`).
3. Logs the exception details alongside the trace identifier.
4. Serializes an RFC 7807 `ProblemDetails` response with HTTP `500 Internal Server Error`, title `INTERNAL_SERVER_ERROR`, and catalogue code `INTERNAL_SERVER_ERROR`.
5. Omits raw exception messages and stack traces from the HTTP response payload.

---

## Error Catalogue

| Code | Status | Trigger Condition | Detail Message |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | Missing or malformed payload fields or cross-field validation rules | One or more fields in your request are invalid. Please check your submission and try again. |
| `UNKNOWN_QUERY_PARAMETER` | 400 | Query string contains unrecognized or misspelled parameter keys | One or more unrecognized query parameters were provided. Please verify spelling. |
| `UNAUTHORIZED` | 401 | Missing authentication header | You must be signed in to perform this request. |
| `PAYMENT_DECLINED` | 402 | Payment amount exceeds provider limits or fails balance checks | Your payment was declined by the provider. Please verify your balance and retry. |
| `PERMISSION_DENIED` | 403 | Authenticated role lacks required privileges | You do not have permission to perform this action. |
| `RESTAURANT_NOT_FOUND` | 404 | Target restaurant ID does not exist in the data source | The requested restaurant with ID {id} could not be found. |
| `ORDER_NOT_FOUND` | 404 | Target order ID does not exist in the data source | The requested order with ID {id} could not be found. |
| `MENU_ITEM_NOT_FOUND` | 404 | Target menu item ID does not exist in the data source | The requested menu item with ID {id} could not be found. |
| `ORDER_ALREADY_DELIVERED` | 409 | Attempting to cancel or alter an order already delivered | Order {id} has already been delivered and can no longer be modified or cancelled. |
| `RESTAURANT_CLOSED` | 409 | Attempting to order from an inactive restaurant or one with an empty menu | Restaurant '{name}' is currently closed. Please place your order during operating hours. |
| `AMOUNT_INVALID` | 422 | Ordered item does not belong to the restaurant or produces non-positive total | Menu item with ID {id} does not belong to restaurant '{name}'. |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception caught by ExceptionMiddleware | An unexpected error occurred on the server. Please contact support with the trace identifier. |

---

## Real Request & Response Bodies

### 1. VALIDATION_FAILED (400 Bad Request)
Request:
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
Response:
```json
{
  "type": "https://addiseats.et/errors/validation-failed",
  "title": "VALIDATION_FAILED",
  "status": 400,
  "detail": "One or more fields in your request are invalid. Please check your submission and try again.",
  "instance": "/api/v1/orders",
  "code": "VALIDATION_FAILED",
  "traceId": "00-205139fb7db6151740922e379b37a346-a0eeb9bb4092b771-00",
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

### 2. UNKNOWN_QUERY_PARAMETER (400 Bad Request)
Request:
```http
GET /api/v1/restaurants?unexpectedParam=test
```
Response:
```json
{
  "type": "https://addiseats.et/errors/unknown-query-parameter",
  "title": "UNKNOWN_QUERY_PARAMETER",
  "status": 400,
  "detail": "One or more unrecognized query parameters were provided. Please verify spelling. Unknown: 'unexpectedParam'.",
  "instance": "/api/v1/restaurants",
  "code": "UNKNOWN_QUERY_PARAMETER",
  "traceId": "00-4b13a1727ff065c7dae9e7bdf6c71761-758cfdf1be61ef55-00"
}
```

### 3. UNAUTHORIZED (401 Unauthorized)
Request:
```http
GET /api/v1/orders/admin
```
Response:
```json
{
  "type": "https://addiseats.et/errors/unauthorized",
  "title": "UNAUTHORIZED",
  "status": 401,
  "detail": "You must be signed in to perform this request.",
  "instance": "/api/v1/orders/admin",
  "code": "UNAUTHORIZED",
  "traceId": "00-84cf05ae138b32e01dfd25bc542e718b-240fae7cfb07dfb9-00"
}
```

### 4. PAYMENT_DECLINED (402 Payment Required)
Request:
```http
POST /api/v1/payment
Content-Type: application/json

{
  "provider": "TeleBirr",
  "amount": 999999.00,
  "phone": "+251911234567"
}
```
Response:
```json
{
  "type": "https://addiseats.et/errors/payment-declined",
  "title": "PAYMENT_DECLINED",
  "status": 402,
  "detail": "Your payment was declined by the provider. Please verify your balance and retry.",
  "instance": "/api/v1/payment",
  "code": "PAYMENT_DECLINED",
  "traceId": "00-11da8591efc7bb249ef841cf9be32711-893baec41b076e21-00"
}
```

### 5. PERMISSION_DENIED (403 Forbidden)
Request:
```http
GET /api/v1/orders/admin
Authorization: Bearer CourierToken123
```
Response:
```json
{
  "type": "https://addiseats.et/errors/permission-denied",
  "title": "PERMISSION_DENIED",
  "status": 403,
  "detail": "You do not have permission to perform this action.",
  "instance": "/api/v1/orders/admin",
  "code": "PERMISSION_DENIED",
  "traceId": "00-a681df70c1d1982b68eeffea40cf396a-04b12fe9dc7ab83c-00"
}
```

### 6. RESTAURANT_NOT_FOUND (404 Not Found)
Request:
```http
GET /api/v1/restaurants/999
```
Response:
```json
{
  "type": "https://addiseats.et/errors/restaurant-not-found",
  "title": "RESTAURANT_NOT_FOUND",
  "status": 404,
  "detail": "The requested restaurant with ID 999 could not be found.",
  "instance": "/api/v1/restaurants/999",
  "code": "RESTAURANT_NOT_FOUND",
  "traceId": "00-349071cfb9ad11ce20a9bd65cfb18073-82a0d1b9efca0921-00"
}
```

### 7. ORDER_NOT_FOUND (404 Not Found)
Request:
```http
GET /api/v1/orders/999
```
Response:
```json
{
  "type": "https://addiseats.et/errors/order-not-found",
  "title": "ORDER_NOT_FOUND",
  "status": 404,
  "detail": "The requested order with ID 999 could not be found.",
  "instance": "/api/v1/orders/999",
  "code": "ORDER_NOT_FOUND",
  "traceId": "00-54eafb08cb07e1927409ab4efc76d091-76a089bde0f074a3-00"
}
```

### 8. MENU_ITEM_NOT_FOUND (404 Not Found)
Request:
```http
GET /api/v1/menu-items/999
```
Response:
```json
{
  "type": "https://addiseats.et/errors/menu-item-not-found",
  "title": "MENU_ITEM_NOT_FOUND",
  "status": 404,
  "detail": "The requested menu item with ID 999 could not be found.",
  "instance": "/api/v1/menu-items/999",
  "code": "MENU_ITEM_NOT_FOUND",
  "traceId": "00-98fe04dca0187e14cb0965d18a09cf4b-513470dae9fb0241-00"
}
```

### 9. ORDER_ALREADY_DELIVERED (409 Conflict)
Request:
```http
PATCH /api/v1/orders/2/status
Content-Type: application/json

{
  "status": "Cancelled"
}
```
Response:
```json
{
  "type": "https://addiseats.et/errors/order-already-delivered",
  "title": "ORDER_ALREADY_DELIVERED",
  "status": 409,
  "detail": "Order 2 has already been delivered and can no longer be modified or cancelled.",
  "instance": "/api/v1/orders/2/status",
  "code": "ORDER_ALREADY_DELIVERED",
  "traceId": "00-60bda8457019dbe740019e04cb9120de-824fe0ab140de018-00"
}
```

### 10. RESTAURANT_CLOSED (409 Conflict)
Request:
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
Response:
```json
{
  "type": "https://addiseats.et/errors/restaurant-closed",
  "title": "RESTAURANT_CLOSED",
  "status": 409,
  "detail": "Restaurant 'Effoi Pizza Sarbet' is currently closed. Please place your order during operating hours.",
  "instance": "/api/v1/orders",
  "code": "RESTAURANT_CLOSED",
  "traceId": "00-7faec090e7136014e7a08b65cf0184b2-290fae091cb7ae40-00"
}
```

### 11. AMOUNT_INVALID (422 Unprocessable Entity)
Request:
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
Response:
```json
{
  "type": "https://addiseats.et/errors/amount-invalid",
  "title": "AMOUNT_INVALID",
  "status": 422,
  "detail": "Menu item with ID 999 does not belong to restaurant 'Yod Abyssinia'.",
  "instance": "/api/v1/orders",
  "code": "AMOUNT_INVALID",
  "traceId": "00-c9a071efb019dae74011e048ba9012ca-310fab7ec9014efa-00"
}
```

### 12. INTERNAL_SERVER_ERROR (500 Internal Server Error)
Request:
```http
GET /api/v1/health/error
```
Response:
```json
{
  "type": "https://addiseats.et/errors/internal-server-error",
  "title": "INTERNAL_SERVER_ERROR",
  "status": 500,
  "detail": "An unexpected error occurred on the server. Please contact support with the trace identifier.",
  "instance": "/api/v1/health/error",
  "code": "INTERNAL_SERVER_ERROR",
  "traceId": "00-b610fa728c091be047190de6ba104ec0-1840baefc901428e-00"
}
```

---

## Server-Side Pricing Verification

Request submitting tampered `"totalAmount": 1.00`:
```http
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
  "totalAmount": 1.00
}
```
Response (`201 Created` with Location header `http://localhost:5062/api/v1/orders/3`):
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
  "deliveryFee": 50.0,
  "totalAmount": 500.0,
  "status": "Pending",
  "createdAt": "2026-11-23T16:45:00Z"
}
```
Calculation Breakdown: Doro Wat (450.00 ETB) + Delivery Fee (50.00 ETB) = 500.00 ETB. The caller's injected amount of 1.00 ETB was ignored.

---

## Pre-Push Verification Checklist

- [x] No endpoint returns 500 for input the caller got wrong.
- [x] No monetary value is accepted from the client.
- [x] Every error body has the same shape and carries a code and a trace id.
- [x] A field-level failure reports every invalid field at once.
- [x] A business-rule failure returns a Result rather than throwing.
- [x] No stack trace or exception message appears in any response.

---

## Week 12 Capstone — Middleware Pipeline, Action Filter & Ordering Verification

### Added Components

#### 1. Custom Middleware (Zero Scoped Constructor Dependencies)
Middleware in ASP.NET Core is constructed **once per application lifetime** (effectively singleton). Injecting a scoped service directly into a middleware constructor causes a captive-dependency runtime error (`InvalidOperationException` under scope validation). All middleware constructors in `Middleware/` inject only singleton-safe framework services:

| Middleware | File | Constructor Dependencies | Responsibility |
|---|---|---|---|
| `CorrelationIdMiddleware` | `Middleware/CorrelationIdMiddleware.cs` | `RequestDelegate`, `ILogger<CorrelationIdMiddleware>` | Reads `X-Correlation-ID` (accepting sane values `<= 64` chars) or generates a 32-char hex GUID; stores it in `HttpContext.Items["CorrelationId"]` and `HttpContext.TraceIdentifier`; writes `X-Correlation-ID` to every response via `Response.OnStarting(...)` (even on `401` short-circuits or `500` exceptions); opens `_logger.BeginScope("CorrelationId:{CorrelationId}", id)` for all downstream logs. |
| `RequestTimingMiddleware` | `Middleware/RequestTimingMiddleware.cs` | `RequestDelegate`, `ILogger<RequestTimingMiddleware>` | Starts a `Stopwatch` before `await _next(context)` and logs `{Method}`, `{Path}`, `{StatusCode}`, and `{Duration}ms` in a `finally` block. Emits `LogWarning` when `duration >= 1000ms` (`WarningThresholdMs = 1000`), otherwise `LogInformation`. |
| `ExceptionMiddleware` | `Middleware/ExceptionMiddleware.cs` | `RequestDelegate`, `ILogger<ExceptionMiddleware>` | Catches unhandled exceptions from downstream middleware, filters, and controllers; logs the exception with `TraceId`; returns RFC 7807 `ProblemDetails` (`500`). |
| `ApiKeyMiddleware` | `Middleware/ApiKeyMiddleware.cs` | `RequestDelegate`, `IConfiguration`, `ILogger<ApiKeyMiddleware>` | Mounted inside an `app.Map("/api/v1/partner", ...)` branch. Validates `X-API-Key` against `Configuration["ApiKey"]` (`addis-eats-secret` in `appsettings.json`). Short-circuits with `401 Unauthorized` without calling `_next(context)` when missing/invalid. |

> **Console Log Scopes:** `appsettings.json` enables `"Logging": { "Console": { "IncludeScopes": true } }` so the `CorrelationId` scope opened by `CorrelationIdMiddleware` prints on every downstream log line.

#### 2. Audit Action Filter (`Filters/AuditActionFilter.cs`)
- Implements `IAsyncActionFilter` (registered globally alongside `RejectUnknownQueryParamsFilter` in `Program.cs` via `AddControllers`).
- Runs **only** when MVC routing selects a controller action (after middleware, routing, and model binding). It does **not** run on `Map` branch requests (`/api/v1/partner`) or middleware short-circuits.
- Logs:
  - `Audit [START]`: controller/action name, HTTP method, path, bound parameter names (omitting sensitive values), and `CorrelationId`.
  - `Audit [END]`: controller/action name, resolved HTTP status code, and `CorrelationId`.
  - `Audit [EXCEPTION]`: logged at `Warning` level if the action throws an unhandled exception before `ExceptionMiddleware` catches it.

---

### Canonical Pipeline Order (`Program.cs`)

```text
Incoming Request
  │
  ├─► 1. CorrelationIdMiddleware      (assigns/echoes X-Correlation-ID, OnStarting header, BeginScope)
  ├─► 2. RequestTimingMiddleware      (Stopwatch + try/finally; captures final status & slow >= 1000ms warning)
  ├─► 3. ExceptionMiddleware          (global catch -> RFC 7807 500 ProblemDetails)
  ├─► 4. UseSwagger / UseSwaggerUI    (Development only)
  ├─► 5. UseHttpsRedirection
  ├─► 6. UseRouting
  ├─► 7. UseCors("frontend")
  ├─► 8. // app.UseRateLimiter();     (future: positioned after routing/CORS, before auth)
  ├─► 9. // app.UseAuthentication();  (future: establishes caller identity before authorization)
  ├─► 10. // app.UseAuthorization();  (future: enforces policies after identity is established)
  ├─► 11. app.Map("/api/v1/partner")  ──► ApiKeyMiddleware (401 short-circuit or 200 branch handler)
  └─► 12. app.MapControllers()        ──► Action Filters (RejectUnknownQueryParamsFilter, AuditActionFilter) ──► Controllers
```

---

### Pipeline Log Verification (Correct vs. Deliberately Reordered)

Both runs executed the exact same 5 HTTP requests:
1. `GET /api/v1/restaurants?page=1&limit=2` (no `X-Correlation-ID` header — server generates one)
2. `GET /api/v1/health/slow?delayMs=1100` (with `X-Correlation-ID` — triggers `>= 1000ms` Warning threshold)
3. `GET /api/v1/health/error` (with `X-Correlation-ID` — triggers unhandled exception -> `500`)
4. `GET /api/v1/partner` (without `X-API-Key` — `ApiKeyMiddleware` short-circuits `401`)
5. `GET /api/v1/partner` (with `X-API-Key: addis-eats-secret` — `200 OK`)

#### A. Correct Canonical Pipeline Output

HTTP Responses:
```text
=== 1. Normal controller request (no X-Correlation-ID) ===
HTTP 200 | X-Correlation-ID: 7a79f7733aec41c297ec5b46288b0a64

=== 2. Slow request (>= 1000ms -> Warning) ===
HTTP 200 | X-Correlation-ID: canonical-slow-002

=== 3. Error request (500 ProblemDetails) ===
HTTP 500 | X-Correlation-ID: canonical-err-003

=== 4. Partner Map branch without X-API-Key (401 short-circuit) ===
HTTP 401 | X-Correlation-ID: canonical-partner-401
{"message":"Invalid or missing API key."}

=== 5. Partner Map branch with valid X-API-Key (200 OK) ===
HTTP 200 | X-Correlation-ID: canonical-partner-200
{"service":"AddisEats Partner Branch","status":"Authorized","correlationId":"canonical-partner-200","timestamp":"2026-11-26T18:29:36.5414253Z"}
```

Server Console Logs:
```text
info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/restaurants ... => CorrelationId:7a79f7733aec41c297ec5b46288b0a64 => AddisEats.Api.Controllers.RestaurantsController.GetAll (ADdisEAts.Api)
      Audit [START]: Restaurants.GetAll | GET /api/v1/restaurants | Params: [query] | CorrelationId: 7a79f7733aec41c297ec5b46288b0a64
info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/restaurants ... => CorrelationId:7a79f7733aec41c297ec5b46288b0a64 => AddisEats.Api.Controllers.RestaurantsController.GetAll (ADdisEAts.Api)
      Audit [END]: Restaurants.GetAll | GET /api/v1/restaurants | Status: 200 | CorrelationId: 7a79f7733aec41c297ec5b46288b0a64
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => ... => RequestPath:/api/v1/restaurants ... => CorrelationId:7a79f7733aec41c297ec5b46288b0a64
      Request: GET /api/v1/restaurants | Status: 200 | Duration: 136ms

info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/slow ... => CorrelationId:canonical-slow-002 => AddisEats.Api.Controllers.HealthController.Slow (ADdisEAts.Api)
      Audit [START]: Health.Slow | GET /api/v1/health/slow | Params: [delayMs] | CorrelationId: canonical-slow-002
info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/slow ... => CorrelationId:canonical-slow-002 => AddisEats.Api.Controllers.HealthController.Slow (ADdisEAts.Api)
      Audit [END]: Health.Slow | GET /api/v1/health/slow | Status: 200 | CorrelationId: canonical-slow-002
warn: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => ... => RequestPath:/api/v1/health/slow ... => CorrelationId:canonical-slow-002
      Slow request: GET /api/v1/health/slow | Status: 200 | Duration: 1161ms

info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:canonical-err-003 => AddisEats.Api.Controllers.HealthController.DeliberateError (ADdisEAts.Api)
      Audit [START]: Health.DeliberateError | GET /api/v1/health/error | Params: [none] | CorrelationId: canonical-err-003
warn: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:canonical-err-003 => AddisEats.Api.Controllers.HealthController.DeliberateError (ADdisEAts.Api)
      Audit [EXCEPTION]: Health.DeliberateError | GET /api/v1/health/error | Exception: InvalidOperationException | CorrelationId: canonical-err-003
fail: AddisEats.Api.Middleware.ExceptionMiddleware[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:canonical-err-003
      Unhandled exception occurred. TraceId: 00-a0e2d3a0a921a7ce228b8c12f1f4ae5d-13c1ba67f378c214-00
      System.InvalidOperationException: Deliberate unhandled exception for middleware verification.
         ...
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:canonical-err-003
      Request: GET /api/v1/health/error | Status: 500 | Duration: 181ms

warn: AddisEats.Api.Middleware.ApiKeyMiddleware[0]
      => ... => RequestPath:/api/v1/partner ... => CorrelationId:canonical-partner-401
      ApiKeyMiddleware short-circuited GET /api/v1/partner with 401 (invalid or missing X-API-Key).
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => ... => RequestPath:/api/v1/partner ... => CorrelationId:canonical-partner-401
      Request: GET /api/v1/partner | Status: 401 | Duration: 21ms

info: AddisEats.Api.Middleware.ApiKeyMiddleware[0]
      => ... => RequestPath:/api/v1/partner ... => CorrelationId:canonical-partner-200
      ApiKeyMiddleware verified X-API-Key for GET /api/v1/partner; forwarding to branch handler.
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => ... => RequestPath:/api/v1/partner ... => CorrelationId:canonical-partner-200
      Request: GET /api/v1/partner | Status: 200 | Duration: 23ms
```

#### B. Deliberately Reordered Pipeline Output

To verify the impact of middleware ordering, the pipeline was temporarily reordered to:
1. `app.Map("/api/v1/partner", ...)` **first** (before `CorrelationIdMiddleware` and `RequestTimingMiddleware`)
2. `ExceptionMiddleware` **second** (before `RequestTimingMiddleware` and `CorrelationIdMiddleware`)
3. `RequestTimingMiddleware` **third** (inside `ExceptionMiddleware`, and before `CorrelationIdMiddleware`)
4. `CorrelationIdMiddleware` **fourth**

HTTP Responses:
```text
=== 1. Normal controller request (no X-Correlation-ID) ===
HTTP 200 | X-Correlation-ID: b828417ce68c411ca7cb17a46df1abd5

=== 2. Slow request (>= 1000ms -> Warning) ===
HTTP 200 | X-Correlation-ID: reordered-slow-002

=== 3. Error request (500 ProblemDetails) ===
HTTP 500 | X-Correlation-ID: reordered-err-003

=== 4. Partner Map branch without X-API-Key (401 short-circuit) ===
HTTP 401 | X-Correlation-ID: None
{"message":"Invalid or missing API key."}

=== 5. Partner Map branch with valid X-API-Key (200 OK) ===
HTTP 200 | X-Correlation-ID: None
{"service":"AddisEats Partner Branch","status":"Authorized","correlationId":null,"timestamp":"2026-11-27T05:46:39.5841946Z"}
```

Server Console Logs:
```text
info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/restaurants ... => CorrelationId:b828417ce68c411ca7cb17a46df1abd5 => AddisEats.Api.Controllers.RestaurantsController.GetAll (ADdisEAts.Api)
      Audit [START]: Restaurants.GetAll | GET /api/v1/restaurants | Params: [query] | CorrelationId: b828417ce68c411ca7cb17a46df1abd5
info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/restaurants ... => CorrelationId:b828417ce68c411ca7cb17a46df1abd5 => AddisEats.Api.Controllers.RestaurantsController.GetAll (ADdisEAts.Api)
      Audit [END]: Restaurants.GetAll | GET /api/v1/restaurants | Status: 200 | CorrelationId: b828417ce68c411ca7cb17a46df1abd5
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => SpanId:0112fd57f57bda5a, TraceId:7bf85687a1265648907ef2c1d4e74e2e, ParentId:0000000000000000 => ConnectionId:0HNQC976S3ELS => RequestPath:/api/v1/restaurants RequestId:0HNQC976S3ELS:00000001
      Request: GET /api/v1/restaurants | Status: 200 | Duration: 124ms

warn: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => SpanId:81b9f2b4df567724, TraceId:39e760230f0db667c8f5455e4751c9fb, ParentId:0000000000000000 => ConnectionId:0HNQC976S3ELT => RequestPath:/api/v1/health/slow RequestId:0HNQC976S3ELT:00000001
      Slow request: GET /api/v1/health/slow | Status: 200 | Duration: 1164ms

info: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:reordered-err-003 => AddisEats.Api.Controllers.HealthController.DeliberateError (ADdisEAts.Api)
      Audit [START]: Health.DeliberateError | GET /api/v1/health/error | Params: [none] | CorrelationId: reordered-err-003
warn: AddisEats.Api.Filters.AuditActionFilter[0]
      => ... => RequestPath:/api/v1/health/error ... => CorrelationId:reordered-err-003 => AddisEats.Api.Controllers.HealthController.DeliberateError (ADdisEAts.Api)
      Audit [EXCEPTION]: Health.DeliberateError | GET /api/v1/health/error | Exception: InvalidOperationException | CorrelationId: reordered-err-003
info: AddisEats.Api.Middleware.RequestTimingMiddleware[0]
      => SpanId:f0995fdea802c689, TraceId:7eabe5195b6214d3c0a4ca46658bec38, ParentId:0000000000000000 => ConnectionId:0HNQC976S3ELU => RequestPath:/api/v1/health/error RequestId:0HNQC976S3ELU:00000001
      Request: GET /api/v1/health/error | Status: 200 | Duration: 16ms
fail: AddisEats.Api.Middleware.ExceptionMiddleware[0]
      => SpanId:f0995fdea802c689, TraceId:7eabe5195b6214d3c0a4ca46658bec38, ParentId:0000000000000000 => ConnectionId:0HNQC976S3ELU => RequestPath:/api/v1/health/error RequestId:0HNQC976S3ELU:00000001
      Unhandled exception occurred. TraceId: 00-7eabe5195b6214d3c0a4ca46658bec38-f0995fdea802c689-00

warn: AddisEats.Api.Middleware.ApiKeyMiddleware[0]
      => SpanId:0afc02b26d321b40, TraceId:01c9fe4439ab55c836301a9d9aae1522, ParentId:0000000000000000 => ConnectionId:0HNQC976S3ELV => RequestPath:/api/v1/partner RequestId:0HNQC976S3ELV:00000001
      ApiKeyMiddleware short-circuited GET /api/v1/partner with 401 (invalid or missing X-API-Key).
info: AddisEats.Api.Middleware.ApiKeyMiddleware[0]
      => SpanId:b8f16082b1e5808b, TraceId:5489492a84f8b0206d27270450656666, ParentId:0000000000000000 => ConnectionId:0HNQC976S3EM0 => RequestPath:/api/v1/partner RequestId:0HNQC976S3EM0:00000001
      ApiKeyMiddleware verified X-API-Key for GET /api/v1/partner; forwarding to branch handler.
```

#### Observed Ordering Bugs in the Reordered Pipeline
1. **Partner `Map` branch skipped correlation and timing completely:** Because `app.Map("/api/v1/partner", ...)` ran before `CorrelationIdMiddleware` and `RequestTimingMiddleware`, `X-Correlation-ID` was `None` on both `401` and `200` responses, `correlationId` in the JSON body was `null`, `ApiKeyMiddleware` logs lost the `CorrelationId` scope, and `RequestTimingMiddleware` never logged `/api/v1/partner` requests at all.
2. **`RequestTimingMiddleware` falsely logged `Status: 200` on an unhandled `500` error:** Because `RequestTimingMiddleware` ran inside `ExceptionMiddleware`, its `finally` block executed while the exception unwound *before* `ExceptionMiddleware`'s `catch` block set `StatusCode = 500`.
3. **Timing and exception logs lost the `CorrelationId` scope:** Because `ExceptionMiddleware` and `RequestTimingMiddleware` ran before `CorrelationIdMiddleware`, neither middleware's logs carried `=> CorrelationId:...`.

---

### Week 12 Capstone Checklist
- [x] `CorrelationIdMiddleware` accepts or generates `X-Correlation-ID`, returns it on every response, and opens a log scope.
- [x] `RequestTimingMiddleware` logs status and duration with a `1000ms` `Warning` threshold.
- [x] `ApiKeyMiddleware` demonstrates short-circuiting (`401`) on an `app.Map("/api/v1/partner", ...)` branch.
- [x] `AuditActionFilter` logs controller action execution start, outcome/status, and exceptions.
- [x] Zero scoped services injected into any middleware constructor.
- [x] Pipeline arranged in canonical order with `UseRateLimiter`, `UseAuthentication`, and `UseAuthorization` positioned and commented.
- [x] Canonical and deliberately reordered pipeline log outputs recorded in `README.md`.
