import "server-only";
import dishes from "../data/dishes";


globalThis.__addisEatsDb ??= { orders: [], nextId: 1001 };
const db = globalThis.__addisEatsDb;

export function listDishes(category) {
  if (!category || category === "All") return dishes;
  return dishes.filter(
    (d) => d.category.toLowerCase() === category.toLowerCase()
  );
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

export const findOrder = (id) => db.orders.find((o) => o.id === id);
export const listOrders = () => db.orders;
export const listOrdersByUser = (userId) =>
  db.orders.filter((o) => o.userId === userId);


export function toPublicOrder(o) {
  return { id: o.id, items: o.items, total: o.total, status: o.status, createdAt: o.createdAt };
}


export function toOwnerOrder(o) {
  const { userId, ...rest } = o;
  return rest;
}