let orders = [];

export function getOrders() {
  return orders;
}

export function addOrder(order) {
  orders.push(order);
}

export function findOrder(id) {
  return orders.find((order) => order.id === id);
}

export function cancelOrderById(id) {
  const order = findOrder(id);

  if (!order) {
    return null;
  }

  order.status = "Cancelled";

  return order;
}