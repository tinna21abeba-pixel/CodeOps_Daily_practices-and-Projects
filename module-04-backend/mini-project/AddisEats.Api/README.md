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
