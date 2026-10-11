export const DISH_PRICES = {
  "Doro Wat": 240,
  "Tibs": 300,
  "Kitfo": 350,
  "Shiro": 150,
  "Alicha Wot": 180,
  "Beg Wot": 320,
};

let orders = [
  {
    id: 1,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Doro Wat",
    quantity: 1,
    deliveryArea: "Bole",
    area: "Bole",
    total: 240,
    status: "Delivered",
    createdAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    userId: "user-3",
    customerName: "Selam",
    phone: "0933445566",
    food: "Tibs",
    quantity: 2,
    deliveryArea: "Kazanchis",
    area: "Kazanchis",
    total: 600,
    status: "Delivered",
    createdAt: "2026-10-01T13:30:00.000Z",
  },
  {
    id: 3,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Kitfo",
    quantity: 2,
    deliveryArea: "Bole",
    area: "Bole",
    total: 700,
    status: "Delivered",
    createdAt: "2026-10-02T11:00:00.000Z",
  },
  {
    id: 4,
    userId: "user-4",
    customerName: "Dawit",
    phone: "0944556677",
    food: "Shiro",
    quantity: 2,
    deliveryArea: "Megenagna",
    area: "Megenagna",
    total: 300,
    status: "Delivered",
    createdAt: "2026-10-02T18:15:00.000Z",
  },
  {
    id: 5,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Shiro",
    quantity: 1,
    deliveryArea: "Bole",
    area: "Bole",
    total: 150,
    status: "Delivered",
    createdAt: "2026-10-03T12:00:00.000Z",
  },
  {
    id: 6,
    userId: "user-2",
    customerName: "Abebe",
    phone: "0922334455",
    food: "Beg Wot",
    quantity: 2,
    deliveryArea: "Kazanchis",
    area: "Kazanchis",
    total: 640,
    status: "Delivered",
    createdAt: "2026-10-03T14:45:00.000Z",
  },
  {
    id: 7,
    userId: "user-5",
    customerName: "Marta",
    phone: "0955667788",
    food: "Alicha Wot",
    quantity: 1,
    deliveryArea: "Megenagna",
    area: "Megenagna",
    total: 180,
    status: "Delivered",
    createdAt: "2026-10-03T19:20:00.000Z",
  },
  {
    id: 8,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Tibs",
    quantity: 1,
    deliveryArea: "Bole",
    area: "Bole",
    total: 300,
    status: "Delivered",
    createdAt: "2026-10-04T13:00:00.000Z",
  },
  {
    id: 9,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Alicha Wot",
    quantity: 1,
    deliveryArea: "Bole",
    area: "Bole",
    total: 180,
    status: "Delivered",
    createdAt: "2026-10-04T14:00:00.000Z",
  },
  {
    id: 10,
    userId: "user-6",
    customerName: "Yonas",
    phone: "0966778899",
    food: "Kitfo",
    quantity: 1,
    deliveryArea: "Sarbet",
    area: "Sarbet",
    total: 350,
    status: "Delivered",
    createdAt: "2026-10-04T17:30:00.000Z",
  },
  {
    id: 11,
    userId: "user-2",
    customerName: "Abebe",
    phone: "0922334455",
    food: "Beg Wot",
    quantity: 1,
    deliveryArea: "Kazanchis",
    area: "Kazanchis",
    total: 320,
    status: "Delivered",
    createdAt: "2026-10-05T08:00:00.000Z",
  },
  {
    id: 12,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Doro Wat",
    quantity: 2,
    deliveryArea: "Bole",
    area: "Bole",
    total: 480,
    status: "Delivered",
    createdAt: "2026-10-05T09:00:00.000Z",
  },
  {
    id: 13,
    userId: "user-4",
    customerName: "Dawit",
    phone: "0944556677",
    food: "Tibs",
    quantity: 2,
    deliveryArea: "Megenagna",
    area: "Megenagna",
    total: 600,
    status: "Delivered",
    createdAt: "2026-10-05T15:30:00.000Z",
  },
  {
    id: 14,
    userId: "user-7",
    customerName: "Helina",
    phone: "0977889900",
    food: "Kitfo",
    quantity: 3,
    deliveryArea: "Bole",
    area: "Bole",
    total: 1050,
    status: "Preparing",
    createdAt: "2026-10-06T12:10:00.000Z",
  },
  {
    id: 15,
    userId: "user-3",
    customerName: "Selam",
    phone: "0933445566",
    food: "Doro Wat",
    quantity: 1,
    deliveryArea: "Kazanchis",
    area: "Kazanchis",
    total: 240,
    status: "Preparing",
    createdAt: "2026-10-06T13:00:00.000Z",
  },
  {
    id: 16,
    userId: "user-8",
    customerName: "Kidus",
    phone: "0988990011",
    food: "Shiro",
    quantity: 3,
    deliveryArea: "Piassa",
    area: "Piassa",
    total: 450,
    status: "Preparing",
    createdAt: "2026-10-06T18:40:00.000Z",
  },
  {
    id: 17,
    userId: "user-1",
    customerName: "Tehesh",
    phone: "0911223344",
    food: "Tibs",
    quantity: 2,
    deliveryArea: "Bole",
    area: "Bole",
    total: 600,
    status: "Pending",
    createdAt: "2026-10-07T10:15:00.000Z",
  },
  {
    id: 18,
    userId: "user-5",
    customerName: "Marta",
    phone: "0955667788",
    food: "Beg Wot",
    quantity: 1,
    deliveryArea: "Megenagna",
    area: "Megenagna",
    total: 320,
    status: "Pending",
    createdAt: "2026-10-07T11:45:00.000Z",
  },
];

export function getOrders() {
  return orders;
}

export function getOrdersByUserId(userId) {
  return orders.filter((order) => order.userId === userId);
}

export function addOrder(order) {
  const calculatedTotal =
    order.total ||
    (DISH_PRICES[order.food] || 250) * (order.quantity || 1);
  const fullOrder = {
    ...order,
    total: calculatedTotal,
    area: order.area || order.deliveryArea || "Bole",
    deliveryArea: order.deliveryArea || order.area || "Bole",
  };
  orders.push(fullOrder);
  return fullOrder;
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