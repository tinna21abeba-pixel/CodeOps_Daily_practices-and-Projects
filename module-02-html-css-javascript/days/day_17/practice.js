
`use strict`

const vat=(amount, rate=0.15) => amount *rate;
function discountBy(rate){
    return 
    price =>rate *price;
      } 
    
    const memberprice=discountBy(0.1);
    const salesPrice=discountBy(0.3);
    console.log(memberprice(1000));
    console.log(salesPrice(1000))
    
  

    
