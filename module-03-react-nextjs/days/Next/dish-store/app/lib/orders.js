let orders = [
  {
    id: 1,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Doro Wat",
    quantity: 1,
    deliveryArea: "Bole",
    status: "Delivered",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Kitfo",
    quantity: 2,
    deliveryArea: "Bole",
    status: "Preparing",
    createdAt: "2026-10-02T11:00:00.000Z",
  },
  {
    id: 3,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Shiro",
    quantity: 1,
    deliveryArea: "Bole",
    status: "Pending",
    createdAt: "2026-10-03T12:00:00.000Z",
  },
  {
    id: 4,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Tibs",
    quantity: 1,
    deliveryArea: "Bole",
    status: "Delivered",
    createdAt: "2026-10-04T13:00:00.000Z",
  },
  {
    id: 5,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Alicha Wot",
    quantity: 1,
    deliveryArea: "Bole",
    status: "Preparing",
    createdAt: "2026-10-04T14:00:00.000Z",
  },
  {
    id: 6,
    userId: "user-2",
    customerName: "Abebe",
    phone: "0922334455",
    food: "Beg Wot",
    quantity: 1,
    deliveryArea: "Kazanchis",
    status: "Pending",
    createdAt: "2026-10-05T08:00:00.000Z",
  },
  {
    id: 123,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Doro Wat",
    quantity: 2,
    deliveryArea: "Bole",
    status: "Out for Delivery",
    createdAt: "2026-10-05T09:00:00.000Z",
  },
];

export function getOrders() {
  return orders;
}

export function getOrdersByUserId(userId) {
  return orders.filter((order) => order.userId === userId);
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