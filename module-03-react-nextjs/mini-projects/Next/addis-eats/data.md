# DATA.md: Live data in Addis Eats

Library: SWR. All queries use the shared `fetcher` (`app/lib/fetcher.js`),
registered once in `SWRConfig` (`app/Providers.jsx`). It throws an error carrying `status` and `info` on non-OK responses.

SWR has no `staleTime`. The equivalent is `dedupingInterval`: identical requests
inside that window reuse the cached result instead of hitting the network.

| Query | Key | Refresh rule | Why |
|---|---|---|---|
| Order status | `/api/orders/:id` | `refreshInterval` 5000 ms, switches to 0 once status is `delivered` or `cancelled`; `dedupingInterval` 2000 ms; `fallbackData` from the server render | Status changes over minutes, so 5 s feels live without hammering the server, and a finished order can never change again so polling stops. |
| Dishes (paged) | `/api/dishes?page=N&pageSize=4[&category=X]` | No `refreshInterval`; `dedupingInterval` 60 000 ms; `revalidateOnFocus` off; `keepPreviousData` on | The menu rarely changes (the menu page itself uses `revalidate = 60`), so 60 s matches it and each page is its own cache entry. |
| Dish search | `/api/dishes?q=TERM`, or `null` when the term is empty | No `refreshInterval`; `dedupingInterval` 30 000 ms; `keepPreviousData` on | An empty term must not fetch, so the key is null. Repeating a search within 30 s costs nothing, and previous results stay visible while the next load runs. |

## Shared keys
`Pager` and the dish grid both call `useDishes` with the same arguments. SWR
dedupes them into one network request.

## Debounce
The input updates local state instantly. Only the debounced value (400 ms)
is used to build the search key, so typing five characters changes the key once.

## Paging
The page number lives in the URL (`/menu?page=2`, `/menu?category=Beef&page=2`),
so every page is linkable, shareable and works with the back button.