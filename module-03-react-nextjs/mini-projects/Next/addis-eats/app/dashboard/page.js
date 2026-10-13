import Link from "next/link";
import { listOrders } from "../lib/store";
import { etb } from "@/lib/format";
import RevenueChart from "./RevenueChart";
import OrdersOverTimeChart from "./OrdersOverTimeChart";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
  description: "Addis Eats analytics dashboard with server aggregation, neighbourhood revenue bar chart, orders timeline, and accessible orders ledger.",
};

export default async function DashboardPage({ searchParams }) {
  const resolvedParams = (await searchParams) || {};

  const currentSort = resolvedParams.sort || "date";
  const currentDir = resolvedParams.dir || "desc";
  const pageParam = parseInt(resolvedParams.page || "1", 10);
  const isForcedEmpty = resolvedParams.empty === "true" || resolvedParams.state === "empty";
  const isForcedError = resolvedParams.error === "true" || resolvedParams.state === "error";
  const isForcedLoading = resolvedParams.loading === "true" || resolvedParams.state === "loading";
  const forcedState = resolvedParams.forcedState || null;

  if (isForcedError) {
    throw new Error("Simulated server-side aggregation error for Addis Eats dashboard demonstration.");
  }

  if (isForcedLoading) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const allRawOrders = listOrders() || [];
  const orders = isForcedEmpty ? [] : allRawOrders;

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Restaurant Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Real-time revenue metrics, neighbourhood distribution, and customer order ledger
            </p>
          </div>
          {isForcedEmpty && (
            <Link
              href="/dashboard"
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-600 transition"
            >
              Exit Empty State Preview
            </Link>
          )}
        </div>

        <EmptyState isForced={isForcedEmpty} />
      </div>
    );
  }

  const definedAreas = ["Bole", "Kazanchis", "Megenagna", "Sarbet", "Piassa"];
  const revenueByArea = definedAreas.map((area) => {
    const areaOrders = orders.filter((o) => {
      const loc = (o.neighbourhood || o.deliveryArea || o.address || "").toLowerCase();
      return loc.includes(area.toLowerCase());
    });
    const revenue = areaOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return {
      area,
      revenue,
      orderCount: areaOrders.length,
    };
  });

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

  const ordersOverTime = dailyBuckets.map((bucket) => {
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

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const topNeighbourhood = [...revenueByArea].sort((a, b) => b.revenue - a.revenue)[0]?.area || "N/A";

  const sortedOrders = [...orders].sort((a, b) => {
    let aVal;
    let bVal;

    switch (currentSort) {
      case "id":
        aVal = a.id;
        bVal = b.id;
        break;
      case "customer":
        aVal = (a.name || a.customerName || "").toLowerCase();
        bVal = (b.name || b.customerName || "").toLowerCase();
        break;
      case "items":
        aVal = Array.isArray(a.items)
          ? a.items.map((i) => i.name).join(", ").toLowerCase()
          : (a.food || "").toLowerCase();
        bVal = Array.isArray(b.items)
          ? b.items.map((i) => i.name).join(", ").toLowerCase()
          : (b.food || "").toLowerCase();
        break;
      case "neighbourhood":
        aVal = (a.neighbourhood || a.deliveryArea || a.address || "").toLowerCase();
        bVal = (b.neighbourhood || b.deliveryArea || b.address || "").toLowerCase();
        break;
      case "status":
        aVal = (a.status || "").toLowerCase();
        bVal = (b.status || "").toLowerCase();
        break;
      case "quantity":
        aVal = Number(
          a.quantity ||
            (Array.isArray(a.items)
              ? a.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
              : 0)
        );
        bVal = Number(
          b.quantity ||
            (Array.isArray(b.items)
              ? b.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
              : 0)
        );
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

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const pageOrders = sortedOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Analytics Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Restaurant Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Server-aggregated metrics, neighbourhood revenue distribution, and customer order ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition"
          >
            Live Normal
          </Link>
          <Link
            href="/dashboard?empty=true"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition"
          >
            Demonstrate Empty State
          </Link>
          <Link
            href="/dashboard?error=true"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-800 bg-red-950/60 hover:bg-red-900/80 text-red-300 transition"
          >
            Demonstrate Error State
          </Link>
          <Link
            href="/dashboard?page=3&sort=total&dir=desc"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 transition"
          >
            Page 3 Sorted by Total
          </Link>
          <a
            href="/api/orders/export"
            download="orders.csv"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 transition"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Revenue
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-1">
            {etb(totalRevenue)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Aggregated server-side
          </span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Orders
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
            {totalOrdersCount} orders
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Across 5 delivery zones
          </span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Avg. Order Value
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {etb(avgOrderValue)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Per customer transaction
          </span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Top Neighbourhood
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-300 truncate mt-1">
            {topNeighbourhood}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Highest sales volume
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueByArea} />
        <OrdersOverTimeChart
          data={ordersOverTime}
          range={dateRangeLabel}
          unit={unitLabel}
        />
      </div>

      <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Detailed Orders Ledger
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sortable order table using URL parameters, right-aligned totals, and full pagination states.
          </p>
        </div>

        <OrderTable
          orders={pageOrders}
          currentSort={currentSort}
          currentDir={currentDir}
          currentParams={resolvedParams}
        />

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
