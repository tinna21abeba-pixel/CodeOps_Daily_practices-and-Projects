# Performance Optimization and Web Vitals

## Baseline Measurements

Lighthouse run on production build with mobile throttling (Slow 4G emulation, 4x CPU slowdown):

| Metric | Starting Baseline |
| :--- | :--- |
| Performance Score | 52 / 100 |
| LCP (Largest Contentful Paint) | 4.8 s |
| CLS (Cumulative Layout Shift) | 0.000 |
| TBT / INP Proxy | 790 ms |
| FCP (First Contentful Paint) | 2.6 s |
| Speed Index | 7.9 s |

Primary issues identified:
- Large unoptimized images served via standard img tags without dimension constraints and compression.
- Render-blocking external stylesheets and third-party scripts.

## Step 1 — Baseline Production Lighthouse

A production build was created using npm run build and served with next start. Lighthouse was run with network throttling and CPU throttling to capture baseline LCP, CLS, and INP metrics.

## Step 2 — Convert img to next/image

Converted all img tags across the application to Next.js Image components from next/image:
- app/page.js: Hero image converted with explicit dimensions (width={1200} height={600}) and responsive sizes attribute (sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px").
- app/menu/DishList.jsx: Dish card images converted with explicit dimensions (width={400} height={250}) and responsive sizes attribute (sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw").
- app/menu/[id]/page.js: Dish detail image converted with explicit dimensions (width={800} height={450}) and responsive sizes attribute (sizes="(max-width: 768px) 100vw, 600px").

Impact: Image delivery savings reduced payloads by over 1.2 MB through automatic modern format conversion (WebP/AVIF) and responsive sizing.

## Step 3 — Priority on Above-the-Fold Image

Added priority prop exclusively to the hero image on the landing page (app/page.js), which is the largest above-the-fold contentful element.
No other images below the fold or in dish lists received priority.

Impact: Next.js injects a high-priority preload tag in the document head, allowing the browser to fetch the LCP element immediately during page parse.

## Step 4 — Font Optimization via next/font

Replaced external Google Fonts link stylesheet tags with next/font/google:
- Configured Plus_Jakarta_Sans in app/layout.js with subsets: ["latin"], display: "swap", and CSS variable --font-plus-jakarta.
- Updated app/globals.css font-family to var(--font-plus-jakarta), sans-serif.
- Removed external render-blocking font link requests from the head.

Impact: Font files are self-hosted at build time and served from the same origin with automated fallback font adjustment, preventing layout shifts (CLS stable at 0).

## Step 5 — Third-Party Scripts via next/script

Replaced raw script tag with Next.js Script component from next/script:
- Used strategy="lazyOnload" for third-party scripts (dayjs).
- Scripts load during browser idle time after page hydration.

Impact: Eliminates main-thread blocking during initial render, reducing Total Blocking Time from 790 ms to 170 ms.

## Step 6 — Environment Configuration

Created .env.example in the project root:
- Documented required environment variables (SESSION_SECRET).
- Updated .gitignore to ensure .env*.local remains untracked while .env.example is tracked in git.

## Step 7 — Final Lighthouse Measurements

Re-ran Lighthouse on the optimized production build under identical throttling conditions:

| Metric | Starting Baseline | Optimized | Delta |
| :--- | :--- | :--- | :--- |
| Performance Score | 52 / 100 | 91 / 100 | +39 points |
| LCP (Largest Contentful Paint) | 4.8 s | 3.1 s | -1.7 s faster |
| CLS (Cumulative Layout Shift) | 0.000 | 0.000 | 0.000 (stable) |
| TBT / INP Proxy | 790 ms | 170 ms | -620 ms reduction |
| FCP (First Contentful Paint) | 2.6 s | 0.8 s | -1.8 s faster |
| Speed Index | 7.9 s | 2.4 s | -5.5 s faster |
