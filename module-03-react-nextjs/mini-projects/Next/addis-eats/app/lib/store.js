import "server-only";
import dishes from "../data/dishes";

globalThis.__addisEatsDb ??= {
  orders: [
    {
      id: "ORD-1001",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      note: "Extra injera please",
      items: [{ dishId: 1, name: "Doro Wat", price: 320, quantity: 1 }],
      total: 320,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "ORD-1002",
      userId: "user-2",
      name: "Abebe",
      phone: "+251922334455",
      address: "Kazanchis, Addis Ababa",
      note: "Mild spice",
      items: [{ dishId: 2, name: "Tibs", price: 280, quantity: 2 }],
      total: 560,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ],
  nextId: 1003,
};

const db = globalThis.__addisEatsDb;

export function listDishes(category) {
  if (!category || category === "All") return dishes;
  return dishes.filter(
    (d) => d.category.toLowerCase() === category.toLowerCase()
  );
}

export function queryDishes({ category, q, page, pageSize = 4 } = {}) {
  let result = listDishes(category);

  const term = (q ?? "").trim().toLowerCase();
  if (term) {
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term)
    );
  }

  const total = result.length;

  if (!page) return { dishes: result, total, page: 1, totalPages: 1 };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    dishes: result.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
  };
}

export function findDish(id) {
  return dishes.find((d) => d.id === Number(id));
}

export function insertOrder({ userId, name, phone, address, note, items }) {
  const lines = items.map(({ dishId, quantity }) => {
    const dish = findDish(dishId);
    return { dishId, name: dish.name, price: dish.price, quantity };
  });

  const order = {
    id: `ORD-${db.nextId++}`,
    userId,
    name,
    phone,
    address,
    note: note ?? "",
    items: lines,
    total: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  return order;
}

export const listOrders = () => db.orders;

export const listOrdersByUser = (userId) =>
  db.orders.filter((o) => o.userId === userId);

export function toPublicOrder(o) {
  return { id: o.id, items: o.items, total: o.total, status: o.status, createdAt: o.createdAt };
}

function advance(order) {
  if (!order || order.status === "cancelled" || order.status === "delivered") return order;
  const age = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  if (age > 60) order.status = "delivered";
  else if (age > 40) order.status = "on_the_way";
  else if (age > 20) order.status = "preparing";
  return order;
}

export const findOrder = (id) => advance(db.orders.find((o) => o.id === id));

export function toOwnerOrder(o) {
  const { userId, ...rest } = o;
  return rest;
}