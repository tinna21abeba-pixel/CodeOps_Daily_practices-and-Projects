# Addis Eats - The Cart, Moved to a Store

A multi-screen food ordering web application with state management split between a persistent **Zustand store** (for cart operations) and **React Context with guarded hooks** (for authentication and theme).

---

## 🏗️ State Architecture: Why Each Piece of State Lives Where It Does

### 1. Why the Cart Lives in a Zustand Store
- **Frequent, localized updates without tree-wide re-renders**: Cart state changes frequently (adding/removing dishes, changing quantities). React Context re-renders every consuming component whenever any part of its value changes. Zustand enables granular, narrow selectors (`useCartStore((state) => state.items.length)`) so components like `Header` never re-render when a dish is added—only the `CartBadge` updates.
- **Built-in persistence middleware**: With Zustand's `persist` middleware, cart items automatically sync with `localStorage` and hydrate seamlessly upon page reload/refresh.
- **Decoupled from React lifecycle**: Actions (`addItem`, `remove`, `clear`) are defined directly on the store and can be invoked anywhere without wrapping the component tree in context providers or passing dispatchers.

### 2. Why the Auth Session Stays in React Context
- **Low-frequency, global broadcast data**: The authentication session changes rarely (upon login or logout) and represents ambient global state that gatekeeps route accessibility and app-level layout elements.
- **Natural integration with React Router tree & guards**: Keeping session state in `AuthProvider` provides clear encapsulation for the route tree (`RequireAuth`), exposing a guarded hook (`useAuth`) that throws an actionable error if invoked outside its provider.
- **Separation of concerns**: Auth and theme are separated into dedicated, single-purpose providers (`AuthProvider`, `ThemeProvider`) rather than being bundled into a monolithic value.

---

## 🗺️ Route Table

| Route Path | Component | Auth Required | State Source | Description |
| :--- | :--- | :---: | :--- | :--- |
| `/` | `Layout` > `Home` | No | `useAuth`, `useTheme` | Landing page with hero banner and quick navigation. |
| `/menu` | `Layout` > `Menu` | No | `useFetch`, `useCartStore` (actions) | Browse menu dishes with category filtering and instant search. |
| `/menu/:id` | `Layout` > `DishDetail` | No | `useFetch`, `useCartStore` (actions) | Dynamic route with detailed dish view and add-to-cart action. |
| `/cart` | `Layout` > `Cart` | No | `useCartStore` (narrow selectors) | Shopping cart screen with item removal, clear, and derived totals. |
| `/checkout` | `Layout` > `RequireAuth` > `Checkout` | **Yes** | `useAuth`, `useCartStore` | Protected checkout panel and customer order submission. |
| `/login` | `Layout` > `Login` | No | `useAuth` | Single-click authentication with redirect back to target route. |
| `*` | `Layout` > `NotFound` | No | None | 404 catch-all screen with navigation fallback. |

---

## 🧩 Store & Context Implementation

### 1. Zustand Cart Store (`cartStore.js`)
- **State**: `items` array
- **Actions**: `addItem(dish)`, `remove(id)`, `clear()`
- **Persistence**: `persist(..., { name: 'addis-eats-cart' })`
- **Narrow selector usage example**:
```javascript
// Narrow selector: only re-renders when count changes
const itemCount = useCartStore((state) => state.items.length);

// Narrow selector: only selects the action, no re-render on items change
const addItem = useCartStore((state) => state.addItem);
```

### 2. Guarded Context Hooks (`useAuth`, `useTheme`)
- **`useAuth()`**: Accesses `user`, `isAuthenticated`, `login()`, `logout()`. Throws `'useAuth must be used within an AuthProvider'` if used outside provider.
- **`useTheme()`**: Accesses `theme`, `toggleTheme()`. Throws `'useTheme must be used within a ThemeProvider'` if used outside provider.

---

## 🛠️ Verification Checklist

- [x] **No CartProvider dependency**: Removing `CartProvider` does not break any cart functionality.
- [x] **Optimized re-renders**: Adding a dish re-renders only `CartBadge` via narrow selector, leaving `Header` untouched.
- [x] **State persistence**: Cart items and order survive full browser reloads.
- [x] **Narrow selectors**: All consumers read specific slices (`items`, `addItem`, `remove`, `clear`, `length`).
- [x] **Guarded context hooks**: `useAuth` and `useTheme` throw actionable error messages when called outside their providers.
- [x] **Independent providers**: Auth and theme are split into separate `AuthProvider` and `ThemeProvider` components.

---

## 💻 Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
