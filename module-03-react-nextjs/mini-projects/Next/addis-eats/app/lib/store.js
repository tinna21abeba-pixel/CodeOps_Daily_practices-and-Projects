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
      neighbourhood: "Bole",
      note: "Extra injera",
      items: [{ dishId: 1, name: "Doro Wat", price: 320, quantity: 1 }],
      total: 320,
      status: "delivered",
      createdAt: "2026-10-01T10:00:00.000Z",
    },
    {
      id: "ORD-1002",
      userId: "user-2",
      name: "Abebe",
      phone: "+251922334455",
      address: "Kazanchis, Addis Ababa",
      neighbourhood: "Kazanchis",
      note: 'Customer requested "extra spicy" sauce',
      items: [{ dishId: 2, name: "Tibs", price: 280, quantity: 2 }],
      total: 560,
      status: "delivered",
      createdAt: "2026-10-01T13:30:00.000Z",
    },
    {
      id: "ORD-1003",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 3, name: "Kitfo", price: 350, quantity: 2 }],
      total: 700,
      status: "delivered",
      createdAt: "2026-10-02T11:00:00.000Z",
    },
    {
      id: "ORD-1004",
      userId: "user-4",
      name: "Dawit",
      phone: "+251944556677",
      address: "Megenagna, Addis Ababa",
      neighbourhood: "Megenagna",
      note: "",
      items: [{ dishId: 4, name: "Shiro", price: 150, quantity: 2 }],
      total: 300,
      status: "delivered",
      createdAt: "2026-10-02T18:15:00.000Z",
    },
    {
      id: "ORD-1005",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 4, name: "Shiro", price: 150, quantity: 1 }],
      total: 150,
      status: "delivered",
      createdAt: "2026-10-03T12:00:00.000Z",
    },
    {
      id: "ORD-1006",
      userId: "user-2",
      name: "Abebe",
      phone: "+251922334455",
      address: "Kazanchis, Addis Ababa",
      neighbourhood: "Kazanchis",
      note: "",
      items: [{ dishId: 6, name: "Beg Wot", price: 320, quantity: 2 }],
      total: 640,
      status: "delivered",
      createdAt: "2026-10-03T14:45:00.000Z",
    },
    {
      id: "ORD-1007",
      userId: "user-5",
      name: "Marta",
      phone: "+251955667788",
      address: "Megenagna, Addis Ababa",
      neighbourhood: "Megenagna",
      note: "",
      items: [{ dishId: 5, name: "Alicha Wot", price: 180, quantity: 1 }],
      total: 180,
      status: "delivered",
      createdAt: "2026-10-03T19:20:00.000Z",
    },
    {
      id: "ORD-1008",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 2, name: "Tibs", price: 280, quantity: 1 }],
      total: 280,
      status: "delivered",
      createdAt: "2026-10-04T13:00:00.000Z",
    },
    {
      id: "ORD-1009",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 5, name: "Alicha Wot", price: 180, quantity: 1 }],
      total: 180,
      status: "delivered",
      createdAt: "2026-10-04T14:00:00.000Z",
    },
    {
      id: "ORD-1010",
      userId: "user-6",
      name: "Yonas",
      phone: "+251966778899",
      address: "Sarbet, Addis Ababa",
      neighbourhood: "Sarbet",
      note: "",
      items: [{ dishId: 3, name: "Kitfo", price: 350, quantity: 1 }],
      total: 350,
      status: "delivered",
      createdAt: "2026-10-04T17:30:00.000Z",
    },
    {
      id: "ORD-1011",
      userId: "user-2",
      name: "Abebe",
      phone: "+251922334455",
      address: "Kazanchis, Addis Ababa",
      neighbourhood: "Kazanchis",
      note: "",
      items: [{ dishId: 6, name: "Beg Wot", price: 320, quantity: 1 }],
      total: 320,
      status: "delivered",
      createdAt: "2026-10-05T08:00:00.000Z",
    },
    {
      id: "ORD-1012",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 1, name: "Doro Wat", price: 320, quantity: 2 }],
      total: 640,
      status: "delivered",
      createdAt: "2026-10-05T09:00:00.000Z",
    },
    {
      id: "ORD-1013",
      userId: "user-4",
      name: "Dawit",
      phone: "+251944556677",
      address: "Megenagna, Addis Ababa",
      neighbourhood: "Megenagna",
      note: "",
      items: [{ dishId: 2, name: "Tibs", price: 280, quantity: 2 }],
      total: 560,
      status: "delivered",
      createdAt: "2026-10-05T15:30:00.000Z",
    },
    {
      id: "ORD-1014",
      userId: "user-7",
      name: "Helina",
      phone: "+251977889900",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 3, name: "Kitfo", price: 350, quantity: 3 }],
      total: 1050,
      status: "preparing",
      createdAt: "2026-10-06T12:10:00.000Z",
    },
    {
      id: "ORD-1015",
      userId: "user-3",
      name: "Selam",
      phone: "+251933445566",
      address: "Kazanchis, Addis Ababa",
      neighbourhood: "Kazanchis",
      note: "",
      items: [{ dishId: 1, name: "Doro Wat", price: 320, quantity: 1 }],
      total: 320,
      status: "preparing",
      createdAt: "2026-10-06T13:00:00.000Z",
    },
    {
      id: "ORD-1016",
      userId: "user-8",
      name: "Kidus",
      phone: "+251988990011",
      address: "Piassa, Addis Ababa",
      neighbourhood: "Piassa",
      note: "",
      items: [{ dishId: 4, name: "Shiro", price: 150, quantity: 3 }],
      total: 450,
      status: "preparing",
      createdAt: "2026-10-06T18:40:00.000Z",
    },
    {
      id: "ORD-1017",
      userId: "user-1",
      name: "Tehesh",
      phone: "+251911223344",
      address: "Bole, Addis Ababa",
      neighbourhood: "Bole",
      note: "",
      items: [{ dishId: 2, name: "Tibs", price: 280, quantity: 2 }],
      total: 560,
      status: "pending",
      createdAt: "2026-10-07T10:15:00.000Z",
    },
    {
      id: "ORD-1018",
      userId: "user-5",
      name: "Marta",
      phone: "+251955667788",
      address: "Megenagna, Addis Ababa",
      neighbourhood: "Megenagna",
      note: "",
      items: [{ dishId: 6, name: "Beg Wot", price: 320, quantity: 1 }],
      total: 320,
      status: "pending",
      createdAt: "2026-10-07T11:45:00.000Z",
    },
  ],
  nextId: 1019,
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

  const matchedArea =
    ["Bole", "Kazanchis", "Megenagna", "Sarbet", "Piassa"].find((a) =>
      (address || "").toLowerCase().includes(a.toLowerCase())
    ) || "Bole";

  const order = {
    id: `ORD-${db.nextId++}`,
    userId,
    name,
    phone,
    address,
    neighbourhood: matchedArea,
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
  return {
    id: o.id,
    items: o.items,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt,
    address: o.address,
    neighbourhood: o.neighbourhood,
  };
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