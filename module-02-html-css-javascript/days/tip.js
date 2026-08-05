const bill= '300';
let person=5;
let tip;

 console.log(bill)
bill >=300?tip =bill*0.1 : tip=bill*0.05;



 let total= Number(bill) + Number(tip);
 let perperson = total / person

console.log(`the total bill with tip is ${total}`);
console.log(`the bill amount per person is ${perperson}`)
 
paymentMethod="telebir";
switch(paymentMethod){
    case 'telebir':
        fee=total *0.01
         break
    case 'cbe birr':
        fee=total * 0.05
        break
    default:
        fee= "choose a payment method"
}
console.log(`the total fee is ${fee}`)























