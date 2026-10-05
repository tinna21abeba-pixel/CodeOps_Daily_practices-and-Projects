# SWR Data Fetching

## Exercise 1 — Shared Fetcher

Created a shared fetcher in `app/lib/fetcher.js`.

The fetcher checks `response.ok` and returns JSON data.

## Exercise 2 — useSWR

Converted the order-status screen from manual fetching to `useSWR`.

SWR manages loading, error, and data states.

## Exercise 3 — Polling

Added `refreshInterval: 5000`.

The browser Network tab shows repeated GET requests every few seconds.

## Exercise 4 — Server Data + SWR

The order is first loaded in the server component and passed to SWR using `fallbackData`.

This allows the page to render with initial server data while SWR continues to revalidate.

## Exercise 5 — Debounced Search

Added a debounced search input.

The search waits 500ms before changing the SWR key.

When the search term is empty, the SWR key is `null`, so no request is made.

## Exercise 6 — keepPreviousData

Added `keepPreviousData: true`.

Previous results remain visible while the new search request is loading.

## Exercise 7 — Pagination

Added a page number to the API query string.

For example:

`/api/orders?search=Tehesh&page=2`

Changing the page changes the SWR key, causing SWR to request the new page automatically.

The API returns a limited number of orders per page and indicates whether another page exists.