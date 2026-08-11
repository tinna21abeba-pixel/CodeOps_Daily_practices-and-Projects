const subTotal=(...price) =>price.reduce((price, sum)=>sum + price, 0)
function discountBy(rate){
   return price =>price *(1-rate);
}
const addVat=amount=> amount *1.15;
const toETB= amount => `${amount.toFixed(2)} ETB`;
 function receiptMaker(){
   let order=0;
   return  (...prices)=>{order++;
    const sub=subTotal(...prices)
    const discountetd=discountBy(0.1)(sub);
    const vatAmount=addVat(discountetd)
    const formatted=toETB(vatAmount);
    return `#${order} : ${formatted}`
      

 };
}
const makerecipt=receiptMaker();
console.log(makerecipt(300, 300, 450))