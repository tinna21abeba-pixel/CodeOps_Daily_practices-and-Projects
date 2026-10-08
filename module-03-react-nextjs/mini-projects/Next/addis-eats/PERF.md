# Addis Eats Performance Optimization and Web Vitals

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
- Landing page hero image loaded via CSS background-image from external host without preloading, compression, or responsive sizing.
- Missing explicit aspect ratio reservations for media elements.
- Unoptimized external font requests and unmanaged third-party scripts competing for main-thread execution time.

## Step 1 — Baseline Production Lighthouse

A production build was executed with npm run build and evaluated on a production server. Performance metrics were captured with network and CPU throttling to establish baseline values for LCP, CLS, and TBT.

## Step 2 — Convert Media to next/image

Replaced all unoptimized media tags and CSS background declarations with Next.js Image components:
- app/page.js: Hero image converted with explicit dimensions (width={1200} height={600}), responsive sizes attribute (sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"), and meaningful alt text.
- app/home/page.js: Home preview image converted with explicit dimensions (width={800} height={450}), responsive sizes attribute, and meaningful alt text.
- app/menu/DishList.jsx: Dish cards converted with explicit dimensions (width={400} height={250}), responsive sizes attribute (sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"), and meaningful alt text.
- app/menu/[id]/page.js: Dish detail view converted with explicit dimensions (width={800} height={450}), responsive sizes attribute (sizes="(max-width: 768px) 100vw, 600px"), and meaningful alt text.

Impact:
Automatic modern format conversion (AVIF/WebP) and responsive resizing reduced image payload sizes significantly.

## Step 3 — Priority Preload and Remote Domain Configuration

Added priority prop exclusively to the hero image on the landing page (app/page.js), which is the primary above-the-fold contentful paint element.
No other images across the application received priority.

Configured remotePatterns in next.config.mjs to authorize image optimization for typicalethiopian.com:
- protocol: "https"
- hostname: "typicalethiopian.com"

Impact:
Next.js injects a high-priority preload tag in the document head for the single hero image. The browser fetches the LCP image concurrently with initial page parsing rather than discovering it late in the stylesheet.

## Step 4 — Font Optimization via next/font

Replaced external stylesheet links with next/font/google:
- Configured Plus_Jakarta_Sans in app/layout.js with subsets: ["latin"], display: "swap", and CSS variable --font-plus-jakarta.
- Updated app/globals.css font-family to var(--font-plus-jakarta), sans-serif.

Impact:
Font files are downloaded at build time and self-hosted with the deployment bundle. Eliminates external render-blocking round trips and matches fallback font metrics to avoid layout shift.

## Step 5 — Third-Party Scripts via next/script

Implemented Next.js Script component in app/layout.js:
- Configured third-party dayjs library with strategy="lazyOnload".
- Deferred execution until browser idle time after page hydration.

Impact:
Removes third-party JavaScript from the critical rendering path, dropping Total Blocking Time from 790 ms to 170 ms.

## Step 6 — Environment Configuration and Secret Isolation

Created .env.example in the project root:
- Documented SESSION_SECRET with placeholder value.
- Confirmed .env*.local is properly gitignored.
- Verified no server-only secrets are prefixed with NEXT_PUBLIC.

## Step 7 — Final Production Lighthouse Measurements

Lighthouse re-run on the optimized production build under identical mobile throttling conditions:

| Metric | Starting Baseline | Optimized | Delta |
| :--- | :--- | :--- | :--- |
| Performance Score | 52 / 100 | 91 / 100 | +39 points |
| LCP (Largest Contentful Paint) | 4.8 s | 3.1 s | -1.7 s faster |
| CLS (Cumulative Layout Shift) | 0.000 | 0.000 | 0.000 (stable) |
| TBT / INP Proxy | 790 ms | 170 ms | -620 ms reduction |
| FCP (First Contentful Paint) | 2.6 s | 0.8 s | -1.8 s faster |
| Speed Index | 7.9 s | 2.4 s | -5.5 s faster |

## Check Yourself

### Did LCP improve, and can you name the single change that did most of it?
Yes, LCP improved from 4.8 s to 3.1 s (a 1.7 s reduction). The single change that contributed most to this improvement was replacing the CSS background-image with next/image using the priority attribute, accompanied by authorized remote host configuration in next.config.mjs. This allowed Next.js to inject an immediate preload hint in the document head and deliver a properly sized, modern-format WebP asset, eliminating the delayed discovery and heavy transfer time of an unoptimized remote image.

### Does the page still jump as it loads? If so, what is not reserving space?
No, the page does not jump as it loads (CLS is 0.000). Space is reserved because every Image component specifies explicit width and height attributes alongside responsive sizes. This allows the browser to compute the aspect ratio and reserve the exact dimensions in the layout before the image bytes finish downloading. Additionally, next/font eliminates font-swap layout shifts by harmonizing fallback font metrics.
