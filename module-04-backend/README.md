# Module 04: Backend Development with .NET & ASP.NET Core

## Endpoints

### Menu API (`/api/v1/menu`)
- `GET /api/v1/menu` - Retrieve all menu items (optional `category`, `page`, `pageSize` query params). **Success: 200 OK**.
- `GET /api/v1/menu/{id}` - Retrieve menu item by id. **Success: 200 OK**, **Failure: 404 Not Found**.
- `POST /api/v1/menu` - Create new menu item. **Success: 201 Created** (with `Location` header), **Failure: 400 Bad Request** (non-positive ETB price).

### Restaurant API (`/api/v1/Resturant`)
- `GET /api/v1/Resturant` - List restaurants. **Success: 200 OK**.
- `GET /api/v1/Resturant/{id}` - Restaurant by id. **Success: 200 OK**, **Failure: 404 Not Found**.
