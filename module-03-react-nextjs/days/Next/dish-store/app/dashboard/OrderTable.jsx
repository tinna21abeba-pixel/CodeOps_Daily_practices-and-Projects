import Link from "next/link";

/**
 * Exercise 5:
 * Build the order table with real markup, right-aligned totals and a caption.
 *
 * Exercise 6:
 * Add sorting via searchParams, with aria-sort on the active column header.
 */
export default function OrderTable({
  orders = [],
  currentSort = "date",
  currentDir = "desc",
  currentParams = {},
}) {
  // Helper to construct sorting link preserving searchParams
  const getSortHref = (columnKey) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== "sort" && k !== "dir" && k !== "page" && v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });

    // If currently sorted by this column, flip direction; otherwise default
    const isCurrent = currentSort === columnKey;
    const nextDir = isCurrent && currentDir === "asc" ? "desc" : "asc";

    params.set("sort", columnKey);
    params.set("dir", nextDir);
    params.set("page", "1"); // reset to page 1 on new sort

    return `/dashboard?${params.toString()}`;
  };

  // Helper for aria-sort on <th>
  const getAriaSort = (columnKey) => {
    if (currentSort !== columnKey) return "none";
    return currentDir === "asc" ? "ascending" : "descending";
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Preparing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancelled":
        return "bg-stone-100 text-stone-500 border-stone-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  // Calculate page totals for right-aligned totals in tfoot
  const pageTotalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const pageTotalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Column definitions for sorting and right alignment
  const columns = [
    { key: "id", label: "Order ID", align: "left" },
    { key: "date", label: "Date / Time", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "food", label: "Dish Item", align: "left" },
    { key: "area", label: "Neighbourhood", align: "left" },
    { key: "status", label: "Status", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" }, // right-aligned
    { key: "total", label: "Total (ETB)", align: "right" }, // right-aligned
  ];

  return (
    <div className="overflow-x-auto">
      {/* Exercise 5: Real markup with <table>, <caption>, <thead>, <tbody>, <tfoot> */}
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        {/* Requirement 5: Caption element */}
        <caption className="caption-top text-left text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
          Customer Orders Log — Listing recent orders with delivery area, status, right-aligned totals, and searchParams sorting
        </caption>

        <thead>
          <tr className="border-b border-stone-200 bg-stone-50 text-stone-600">
            {columns.map((col) => {
              const isActive = currentSort === col.key;
              const ariaSort = getAriaSort(col.key);

              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`py-3 px-3.5 font-semibold select-none ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {/* Exercise 6: Sorting via searchParams with aria-sort */}
                  <Link
                    href={getSortHref(col.key)}
                    className={`inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors ${
                      isActive ? "text-orange-600 font-bold" : "text-stone-700"
                    }`}
                    title={`Sort by ${col.label} ${
                      isActive
                        ? currentDir === "asc"
                          ? "descending"
                          : "ascending"
                        : "ascending"
                    }`}
                  >
                    <span>{col.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-[11px] font-mono text-stone-400"
                    >
                      {isActive ? (currentDir === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-100 bg-white">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <tr
                key={order.id}
                className="hover:bg-stone-50/70 transition-colors"
              >
                <td className="py-3 px-3.5 font-mono text-xs font-bold text-stone-500">
                  #{order.id}
                </td>
                <td className="py-3 px-3.5 text-stone-600 whitespace-nowrap">
                  {dateStr}
                </td>
                <td className="py-3 px-3.5 font-medium text-stone-900">
                  {order.customerName}
                </td>
                <td className="py-3 px-3.5 text-stone-800">
                  {order.food}
                </td>
                <td className="py-3 px-3.5 text-stone-600">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                    {order.deliveryArea || order.area}
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Requirement 5: Right-aligned quantity */}
                <td className="py-3 px-3.5 text-right font-mono text-stone-700">
                  {order.quantity}
                </td>

                {/* Requirement 5: Right-aligned totals with ETB */}
                <td className="py-3 px-3.5 text-right font-mono font-bold text-stone-900">
                  {Number(order.total || 0).toLocaleString()} ETB
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Real Markup <tfoot> with right-aligned totals */}
        <tfoot>
          <tr className="border-t-2 border-stone-300 bg-stone-50 font-bold text-stone-900">
            <th
              scope="row"
              colSpan={6}
              className="py-3 px-3.5 text-left text-xs uppercase tracking-wider text-stone-600"
            >
              Page Subtotal ({orders.length} orders on this page)
            </th>
            {/* Right-aligned total quantity */}
            <td className="py-3 px-3.5 text-right font-mono text-stone-800">
              {pageTotalQty}
            </td>
            {/* Right-aligned total revenue */}
            <td className="py-3 px-3.5 text-right font-mono text-orange-600 font-extrabold text-sm sm:text-base">
              {Number(pageTotalRevenue).toLocaleString()} ETB
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
