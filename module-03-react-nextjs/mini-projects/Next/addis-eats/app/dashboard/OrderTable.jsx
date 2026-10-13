import Link from "next/link";
import { etb, when } from "@/lib/format";

export default function OrderTable({
  orders = [],
  currentSort = "date",
  currentDir = "desc",
  currentParams = {},
}) {
  const getSortHref = (colKey) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== "sort" && k !== "dir" && k !== "page" && v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });

    const isCurrent = currentSort === colKey;
    const nextDir = isCurrent && currentDir === "asc" ? "desc" : "asc";

    params.set("sort", colKey);
    params.set("dir", nextDir);
    params.set("page", "1");

    return `/dashboard?${params.toString()}`;
  };

  const getAriaSort = (colKey) => {
    if (currentSort !== colKey) return "none";
    return currentDir === "asc" ? "ascending" : "descending";
  };

  const getSortIndicator = (colKey) => {
    if (currentSort !== colKey) return "-";
    return currentDir === "asc" ? "▲" : "▼";
  };

  const pageTotalQty = orders.reduce((sum, o) => {
    const qty =
      o.quantity ||
      (Array.isArray(o.items)
        ? o.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
        : 1);
    return sum + qty;
  }, 0);

  const pageTotalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const columns = [
    { key: "id", label: "Order ID", align: "left" },
    { key: "date", label: "Date / Time", align: "left" },
    { key: "customer", label: "Customer", align: "left" },
    { key: "items", label: "Items Ordered", align: "left" },
    { key: "neighbourhood", label: "Neighbourhood", align: "left" },
    { key: "status", label: "Status", align: "left" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "total", label: "Total (ETB)", align: "right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <caption className="caption-top text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Customer Orders Log — Listing orders with delivery zone, right-aligned totals, and URL sorting
        </caption>

        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-300">
            {columns.map((col) => {
              const isActive = currentSort === col.key;
              const ariaSort = getAriaSort(col.key);
              const sortIndicator = getSortIndicator(col.key);

              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`py-3 px-3.5 font-semibold ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <Link
                    href={getSortHref(col.key)}
                    className={`inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors ${
                      isActive ? "text-amber-400 font-bold" : "text-zinc-300"
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
                    <span aria-hidden="true" className="text-[10px] font-mono text-zinc-500">
                      {sortIndicator}
                    </span>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
          {orders.map((order) => {
            const dateStr = order.createdAt ? when(order.createdAt) : "N/A";

            const itemsStr = Array.isArray(order.items)
              ? order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")
              : order.food || "Order item";

            const orderQty =
              order.quantity ||
              (Array.isArray(order.items)
                ? order.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
                : 1);

            const areaStr = order.neighbourhood || order.deliveryArea || order.address || "Bole";

            return (
              <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                <td className="py-3 px-3.5 font-mono text-xs font-bold text-amber-400">
                  {order.id}
                </td>
                <td className="py-3 px-3.5 text-zinc-400 whitespace-nowrap">
                  {dateStr}
                </td>
                <td className="py-3 px-3.5 font-medium text-white">
                  {order.name || order.customerName}
                </td>
                <td className="py-3 px-3.5 text-zinc-300">
                  {itemsStr}
                </td>
                <td className="py-3 px-3.5 text-zinc-400">
                  {areaStr}
                </td>
                <td className="py-3 px-3.5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border border-zinc-700 bg-zinc-800 text-zinc-200">
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-zinc-200">
                  {orderQty}
                </td>
                <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-400">
                  {etb(order.total)}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-zinc-700 bg-zinc-950 font-bold text-white">
            <th
              scope="row"
              colSpan={6}
              className="py-3 px-3.5 text-left text-xs uppercase tracking-wider text-zinc-400"
            >
              Page Subtotal ({orders.length} orders displayed)
            </th>
            <td className="py-3 px-3.5 text-right font-mono text-zinc-200">
              {pageTotalQty}
            </td>
            <td className="py-3 px-3.5 text-right font-mono text-amber-400 font-extrabold text-sm sm:text-base">
              {etb(pageTotalRevenue)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
