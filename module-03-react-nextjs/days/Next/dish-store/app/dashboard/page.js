import Link from "next/link";
import { getOrders } from "@/app/lib/orders";
import RevenueChart from "./RevenueChart";
import OrdersPerDayChart from "./OrdersPerDayChart";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard & Analytics | Addis Eats",
  description:
    "Order aggregation, revenue by neighbourhood bar chart, daily order timeline, and paginated order log.",
};

/**
 * Exercise 1:
 * Aggregate order data in a server component and pass only the summary to the client.
 *
 * Exercise:
 * Build the empty state first — before there is any data to display.
 */
export default async function DashboardPage({ searchParams }) {
  // Await searchParams Promise (Next.js 15/16 convention)
  const resolvedParams = (await searchParams) || {};

  const currentSort = resolvedParams.sort || "date";
  const currentDir = resolvedParams.dir || "desc";
  const pageParam = parseInt(resolvedParams.page || "1", 10);
  const isForcedEmpty = resolvedParams.empty === "true";
  const forcedState = resolvedParams.forcedState || null;

  // Retrieve orders from data layer
  const allRawOrders = (await getOrders()) || [];

  // When empty state is forced for preview/testing or when database has no orders
  const orders = isForcedEmpty ? [] : allRawOrders;

  /* =======================================================================
   * EXERCISE: Build the empty state first — before there is any data to display.
   * ======================================================================= */
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Restaurant Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Real-time revenue metrics, delivery neighbourhood distribution, and order log
            </p>
          </div>
          {isForcedEmpty && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-xs"
            >
              Exit Empty State Preview
            </Link>
          )}
        </div>

        <EmptyState isForced={isForcedEmpty} />
      </div>
    );
  }

  /* =======================================================================
   * EXERCISE 1: Aggregate order data in a server component and pass only
   * the summary to the client.
   * ======================================================================= */

  // 1. Aggregate: Revenue by Neighbourhood (Delivery Zone)
  const definedAreas = ["Bole", "Kazanchis", "Megenagna", "Sarbet", "Piassa"];
  const revenueByArea = definedAreas.map((area) => {
    const areaOrders = orders.filter(
      (o) => (o.deliveryArea || o.area || "").toLowerCase() === area.toLowerCase()
    );
    const revenue = areaOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return {
      area,
      revenue,
      orderCount: areaOrders.length,
    };
  });

  // 2. Aggregate: Orders Per Day across fixed 7-day range (Oct 1 to Oct 7, 2026)
  const dateRangeLabel = "Oct 1 to Oct 7, 2026";
  const unitLabel = "Orders / Day";

  const dailyBuckets = [
    { date: "2026-10-01", label: "Oct 1" },
    { date: "2026-10-02", label: "Oct 2" },
    { date: "2026-10-03", label: "Oct 3" },
    { date: "2026-10-04", label: "Oct 4" },
    { date: "2026-10-05", label: "Oct 5" },
    { date: "2026-10-06", label: "Oct 6" },
    { date: "2026-10-07", label: "Oct 7" },
  ];

  const ordersPerDay = dailyBuckets.map((bucket) => {
    const dayOrders = orders.filter((o) => {
      const createdStr = typeof o.createdAt === "string" ? o.createdAt : "";
      return createdStr.startsWith(bucket.date);
    });

    const dayRevenue = dayOrders.reduce(
      (sum, o) => sum + (Number(o.total) || 0),
      0
    );

    return {
      date: bucket.date,
      label: bucket.label,
      count: dayOrders.length,
      revenue: dayRevenue,
    };
  });

  // 3. Executive KPI Summaries
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const topNeighbourhood = [...revenueByArea].sort((a, b) => b.revenue - a.revenue)[0]?.area || "N/A";

  /* =======================================================================
   * EXERCISES 5 & 6: Server-side Sorting based on searchParams
   * ======================================================================= */
  const sortedOrders = [...orders].sort((a, b) => {
    let aVal;
    let bVal;

    switch (currentSort) {
      case "id":
        aVal = a.id;
        bVal = b.id;
        break;
      case "customer":
        aVal = (a.customerName || "").toLowerCase();
        bVal = (b.customerName || "").toLowerCase();
        break;
      case "food":
        aVal = (a.food || "").toLowerCase();
        bVal = (b.food || "").toLowerCase();
        break;
      case "area":
        aVal = (a.deliveryArea || a.area || "").toLowerCase();
        bVal = (b.deliveryArea || b.area || "").toLowerCase();
        break;
      case "status":
        aVal = (a.status || "").toLowerCase();
        bVal = (b.status || "").toLowerCase();
        break;
      case "quantity":
        aVal = Number(a.quantity || 0);
        bVal = Number(b.quantity || 0);
        break;
      case "total":
        aVal = Number(a.total || 0);
        bVal = Number(b.total || 0);
        break;
      case "date":
      default:
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
        break;
    }

    if (currentDir === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  /* =======================================================================
   * EXERCISE 7: Server-side Pagination based on searchParams (page)
   * ======================================================================= */
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const pageOrders = sortedOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Executive Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Restaurant Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Server-aggregated metrics, neighbourhood revenue distribution, and customer order ledger.
          </p>
        </div>

        {/* Toolbar: Toggle Empty State Simulation */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard?empty=true"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
            title="Preview how dashboard handles zero orders"
          >
            Simulate Empty State
          </Link>
          <Link
            href="/checkout"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs"
          >
            + Create New Order
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Total Revenue
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-orange-600 font-mono mt-1">
            {Number(totalRevenue).toLocaleString()} ETB
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Aggregated server-side
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Total Orders
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono mt-1">
            {totalOrdersCount} orders
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Across 5 delivery zones
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Avg. Order Value
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            {avgOrderValue.toLocaleString()} ETB
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Per customer transaction
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Top Neighbourhood
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-600 truncate mt-1">
            {topNeighbourhood}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Highest sales volume
          </span>
        </div>
      </div>

      {/* Data Visualizations Section (Exercises 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise 2: Revenue Bar Chart with Fixed-Height Container and ETB Tick Formatting */}
        <RevenueChart data={revenueByArea} />

        {/* Exercise 3 & 4: Orders-Per-Day Line Chart with Range/Unit Heading & Accessible Table */}
        <OrdersPerDayChart
          data={ordersPerDay}
          range={dateRangeLabel}
          unit={unitLabel}
        />
      </div>

      {/* Order Log Table Section (Exercises 5, 6, 7) */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-700"></span>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Detailed Orders Ledger
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Sortable table using searchParams, right-aligned totals, and full pagination states.
            </p>
          </div>
        </div>

        {/* Exercise 5 & 6: Order Table with real markup, right-aligned totals, caption & aria-sort */}
        <OrderTable
          orders={pageOrders}
          currentSort={currentSort}
          currentDir={currentDir}
          currentParams={resolvedParams}
        />

        {/* Exercise 7: Paging with Link elements, writing and forcing each of the four states */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedOrders.length}
          pageSize={pageSize}
          currentParams={resolvedParams}
          forcedState={forcedState}
        />
      </section>
    </div>
  );
}