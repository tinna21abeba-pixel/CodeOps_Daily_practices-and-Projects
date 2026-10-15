import Link from "next/link";

export default function OrderTable({
  orders = [],
  currentSort = "date",
  currentDir = "desc",
  currentParams = {},
}) {
  const getSortHref = (columnKey) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== "sort" && k !== "dir" && k !== "page" && v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });

    const isCurrent = currentSort === columnKey;
    const nextDir = isCurrent && currentDir === "asc" ? "desc" : "asc";

    params.set("sort", columnKey);
    params.set("dir", nextDir);
    params.set("page", "1");

    return `/dashboard?${params.toString()}`;
  };

  const getAriaSort = (columnKey) => {
    if (currentSort !== columnKey) return "none";
    return currentDir === "asc" ? "ascending" : "descending";
  };

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

  const pageTotalQty = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const pageTotalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const columns = [
    { key: "id", label: "Order ID", align: "left" },
    { key: "date", label: "Date / Time", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "food", label: "Dish Item", align: "left" },
    { key: "area", label: "Neighbourhood", align: "left" },
    { key: "status", label: "Status", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "total", label: "Total (ETB)", align: "right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <caption className="caption-top text-left text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
          Customer Orders Log Listing recent orders with delivery area, status, right-aligned totals, and searchParams sorting
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
                  className={`p-1 select-none ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <Link
                    href={getSortHref(col.key)}
                    className={`min-h-[44px] px-3 py-2 inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${
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
                    {isActive ? (
                      <span className="text-[10px] font-mono uppercase text-orange-600">
                        [{currentDir}]
                      </span>
                    ) : null}
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
                  {order.deliveryArea || order.area}
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
                <td className="py-3 px-3.5 text-right font-mono text-stone-700">
                  {order.quantity}
                </td>
                <td className="py-3 px-3.5 text-right font-mono font-bold text-stone-900">
                  {Number(order.total || 0).toLocaleString()} ETB
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-stone-300 bg-stone-50 font-bold text-stone-900">
            <th
              scope="row"
              colSpan={6}
              className="py-3 px-3.5 text-left text-xs uppercase tracking-wider text-stone-600"
            >
              Page Subtotal ({orders.length} orders on this page)
            </th>
            <td className="py-3 px-3.5 text-right font-mono text-stone-800">
              {pageTotalQty}
            </td>
            <td className="py-3 px-3.5 text-right font-mono text-orange-600 font-extrabold text-sm sm:text-base">
              {Number(pageTotalRevenue).toLocaleString()} ETB
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
