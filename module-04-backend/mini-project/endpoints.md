# Addis Eats API: Endpoint Table

Design contract for the Addis Eats API. Written before implementation.

## Conventions

- Every path is versioned and starts with `/api/v1`.
- Collections are plural nouns (`restaurants`, `menu-items`, `orders`, `payments`, `users`, `sessions`).
- Identifiers go in the path (`{restaurantId}`); filters, sorting and paging go in the query string.
- The HTTP method is the verb. No path contains a verb.
- Creation returns `201 Created`; deletion and logout return `204 No Content`; other successes return `200 OK`.
- Failure codes are client errors (4xx) caused by bad input, missing resources or missing permission. `500` is never used for bad input from the caller.

## Endpoint Table

| # | Method | Path | Purpose | Success | Failure |
|---|--------|------|---------|---------|---------|
| 1 | GET | `/api/v1/restaurants` | List restaurants; filter with `?city=`, `?cuisine=`, `?page=` | 200 | 400 (invalid filter value) |
| 2 | GET | `/api/v1/restaurants/{restaurantId}` | Get one restaurant's details | 200 | 404 (restaurant not found) |
| 3 | POST | `/api/v1/restaurants` | Create a new restaurant | 201 | 422 (missing or invalid fields) |
| 4 | PATCH | `/api/v1/restaurants/{restaurantId}` | Update a restaurant's details | 200 | 403 (caller does not own the restaurant) |
| 5 | GET | `/api/v1/restaurants/{restaurantId}/menu-items` | List a restaurant's menu; filter with `?category=`, `?available=true` | 200 | 404 (restaurant not found) |
| 6 | POST | `/api/v1/restaurants/{restaurantId}/menu-items` | Add a menu item to a restaurant | 201 | 422 (missing name or invalid price) |
| 7 | PATCH | `/api/v1/menu-items/{menuItemId}` | Update a menu item (price, availability) | 200 | 404 (menu item not found) |
| 8 | DELETE | `/api/v1/menu-items/{menuItemId}` | Remove a menu item | 204 | 404 (menu item not found) |
| 9 | POST | `/api/v1/orders` | Place a new order (restaurant, items, quantities in body) | 201 | 422 (empty cart or unavailable item) |
| 10 | GET | `/api/v1/orders` | List the caller's orders; filter with `?status=`, `?restaurantId=` | 200 | 401 (not authenticated) |
| 11 | GET | `/api/v1/orders/{orderId}` | Get one order with its items and status | 200 | 404 (order not found) |
| 12 | PATCH | `/api/v1/orders/{orderId}` | Change an order's status (e.g. to `cancelled`) | 200 | 409 (status change not allowed, e.g. already delivered) |
| 13 | POST | `/api/v1/orders/{orderId}/payments` | Create a payment for an order | 201 | 402 (payment declined) |
| 14 | GET | `/api/v1/orders/{orderId}/payments/{paymentId}` | Get a payment's status and details | 200 | 404 (payment not found) |
| 15 | POST | `/api/v1/users` | Register a new account | 201 | 409 (email or phone already registered) |
| 16 | POST | `/api/v1/sessions` | Log in: create a session and return an access token | 201 | 401 (wrong credentials) |
| 17 | DELETE | `/api/v1/sessions/current` | Log out: end the caller's current session | 204 | 401 (missing or invalid token) |

## Noun and Verb Check

Rows 1 to 3 are the restaurant endpoints from Part 4. Every other row was derived by asking "what is the noun, and what is the verb?"

| Feature | Noun (path) | Verb (method) |
|---------|-------------|---------------|
| Browse the menu | `menu-items` | GET |
| Add or remove a dish | `menu-items` | POST / DELETE |
| Place an order | `orders` | POST |
| Cancel an order | `orders` (status field) | PATCH |
| Pay for an order | `payments` | POST |
| Register | `users` | POST |
| Log in | `sessions` | POST |
| Log out | `sessions` | DELETE |

## Self-Check

- [x] No path contains a verb (no `login`, `cancel`, `pay`, `create`).
- [x] Every collection is plural.
- [x] Every row has both a success and a failure code.
- [x] No creation returns 200; all creations (rows 3, 6, 9, 13, 15, 16) return 201.
- [x] Nothing returns 500 for bad input from the caller.
- [x] Identifiers are in the path; filters are in the query string.
- [x] Everything lives under `/api/v1`.
- [x] Covers restaurants, menus, orders, payments and authentication.
