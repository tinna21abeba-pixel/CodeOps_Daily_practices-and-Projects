
const  price= [800, 2500, 1500, 950 ]
const newPrice=price.map(price => price * 0.15);
const cheapPrices=price.filter(price => price < 1000)

 const grandTotal=price.reduce((sum, price)=>sum + price, 0)

 const customer={
    name: "haile",
    city: "Addis Abeba",
    balance: 500
 }
 for ( const [key, value] of Object.entries(customer)){
    console.log( key, value)
 }

 const {name, city}=customer;
function greet(){
    console.log(`selam ${name} ` )
}
 const updated={...customer, city:"Awassa", phone:"0998438170"}
  