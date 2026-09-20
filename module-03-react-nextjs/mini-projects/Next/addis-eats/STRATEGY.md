# Addis Eats - Route Rendering Strategies

| Route | Strategy | Reason |
| :--- | :--- | :--- |
| `/` | Static (SSG) | Landing page content is static and identical for all visitors. |
| `/menu` | Incremental Static Regeneration (ISR - 60s) | Menu items and availability change periodically, benefiting from cached static performance with automated background revalidation. |
| `/menu/[id]` | Static Site Generation (SSG via `generateStaticParams`) | All dish IDs and item details are known ahead of time, allowing pre-rendering of individual pages at build time. |
| `/cart` | Static (Client-Hydrated) | The cart layout shell is static, while dynamic item state is managed client-side. |
| `/checkout` | Dynamic (Server-Rendered on Demand) | Requires reading request-time cookies, session credentials, and user-specific headers for processing orders. |
| `/home` | Static (SSG) | Static informational welcome page that does not depend on request parameters or external mutations. |
