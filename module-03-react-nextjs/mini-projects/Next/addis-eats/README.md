# Addis Eats

## Build Output


Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /home
├ ○ /menu                      1m      1y
└   /menu/[id]
  ├ ● /menu/1
  ├ ● /menu/2
  ├ ● /menu/3
  └ ● [+7 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Network Tab Behavior While Typing

- Debounce: Keystrokes in the search box are debounced by 400 ms. Typing five characters in succession fires exactly one network request (`/api/dishes?q=...`) once typing pauses, rather than five separate requests.
- Empty Search Term: When the input is cleared, the query key evaluates to `null`. SWR does not issue a network request for a null key.
- No Flash: While a new query is in flight, `keepPreviousData: true` ensures the prior result set remains rendered on screen without flashing empty.
- Cache Deduplication: Identical searches within the 30-second `dedupingInterval` serve from cache without hitting the network.
