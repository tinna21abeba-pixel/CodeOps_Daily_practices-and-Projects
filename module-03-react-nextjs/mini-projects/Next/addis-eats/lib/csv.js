export function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function ordersToCsv(orders = []) {
  const headers = [
    "Order ID",
    "Date",
    "Customer",
    "Items",
    "Neighbourhood",
    "Address",
    "Status",
    "Quantity",
    "Total (ETB)",
    "Note",
  ];

  const rows = orders.map((order) => {
    const itemsStr = Array.isArray(order.items)
      ? order.items.map((i) => `${i.quantity}x ${i.name}`).join("; ")
      : order.food || "";

    const quantity =
      order.quantity ||
      (Array.isArray(order.items)
        ? order.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
        : 1);

    return [
      escapeCsv(order.id),
      escapeCsv(order.createdAt),
      escapeCsv(order.name || order.customerName),
      escapeCsv(itemsStr),
      escapeCsv(order.neighbourhood || ""),
      escapeCsv(order.address || ""),
      escapeCsv(order.status),
      escapeCsv(quantity),
      escapeCsv(order.total),
      escapeCsv(order.note || ""),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}
