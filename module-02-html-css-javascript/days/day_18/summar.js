import { withVat, format } from "./pricing.js";
import { orders } from "./order.js";

const ordersWithVat=orders.map(order=>{
    const subTotal=order.items.reduce((sum, {price, qty})=> sum + price *qty, 0);
     const total=withVat(subTotal);
     return{
        ...order,
        total
     }
})

const expensiveOrders=ordersWithVat.filter(order=>order.total > 500);
 const grantTotal=ordersWithVat.reduce((sum, {total})=> sum + total, 0);
  console.log("-----Addis market order summary----");

  ordersWithVat.forEach(order=>{
    console.log(`order:${order.id}   ${order.id}  ${order.total} ETB`)
  })

 
console.log(`grant total: ${format(grantTotal)}`);