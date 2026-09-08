# Addis Eats - Multi-Screen React & Router Application

A multi-page food ordering web application built with React, React Router, and Context API.

---

## 🗺️ Route Table

| Route Path | Component | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `/` | `Layout` > `Home` | No | Landing page with hero banner, quick links, and featured highlights. |
| `/menu` | `Layout` > `Menu` | No | Browse dishes with dynamic search and shareable URL query category filters (`/menu?category=...`). |
| `/menu/:id` | `Layout` > `DishDetail` | No | Dynamic route displaying individual dish details using `useParams()`. Gracefully handles unknown dishes. |
| `/cart` | `Layout` > `Cart` | No | Shopping cart screen showing all selected items, item removal, and derived totals surviving page transitions. |
| `/checkout` | `Layout` > `RequireAuth` > `Checkout` | **Yes** | Protected checkout form. If not signed in, redirects to `/login` and returns here after login. |
| `/login` | `Layout` > `Login` | No | Authentication screen allowing users to sign in and redirect to their intended destination. |
| `*` | `Layout` > `NotFound` | No | 404 catch-all screen for invalid routes with a link to return home. |

---

## 🚀 Key Features

1. **Persistent Cart State**: `CartProvider` is mounted at the root above `BrowserRouter`, ensuring cart items and totals survive all screen navigations and page changes.
2. **Shareable Category Query Filter**: `/menu?category=main` or `/menu?category=side` parses category from `useSearchParams`, allowing bookmarking and direct link sharing.
3. **Dynamic Dish Details**: `/menu/:id` dynamically extracts route parameters with `useParams` and fetches dish data from `/dishes.json`.
4. **Route Protection (`RequireAuth`)**: Guards the `/checkout` route, redirecting unauthenticated users to `/login` while remembering their target destination using `useLocation`.
5. **Robust 404 & Empty Handling**: Safe fallbacks for unmatched routes (`*`) and missing dish IDs (e.g., `/menu/not-a-dish`).
6. **Active Navigation Highlighting**: Uses `NavLink` with active states in the top navigation bar.

---

## 🛠️ Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
