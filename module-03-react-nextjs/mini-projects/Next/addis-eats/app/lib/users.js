export const USERS = {
  "user-1": {
    id: "user-1",
    name: "Tehesh",
    role: "customer",
  },
  "user-2": {
    id: "user-2",
    name: "Abebe",
    role: "customer",
  },
  "staff-1": {
    id: "staff-1",
    name: "Chef Sara",
    role: "staff",
  },
};

export function getUserById(id) {
  return USERS[id] || null;
}
