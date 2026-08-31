const transactions = [
    {
        id: 1,
        title: "Groceries",
        amount: 550,
        type: "expense",
        category: "Food",
        date: "2026-08-30",
        notes: "Weekly shopping"
    },

    {
        id: 2,
        title: "Salary",
        amount: 20000,
        type: "income",
        category: "Income",
        date: "2026-08-29",
        notes: "Monthly salary"
    },

    {
        id: 3,
        title: "Transport",
        amount: 200,
        type: "expense",
        category: "Transport",
        date: "2026-08-28",
        notes: "Taxi"
    }
];
const transactionList =
    document.querySelector("#transactionList");

const transactionForm =
    document.querySelector("#transactionForm");

const balance =
    document.querySelector("#balance");

const incomeDisplay =
    document.querySelector("#incomeDisplay");

const spentPercentage =
    document.querySelector("#spentPercentage");


const categoryButtons =
    document.querySelectorAll(".category-btn");
const categoryInput =
    document.querySelector("#category");
const budgetCategories =
    document.querySelectorAll(".budget-category");


function renderTransactions(){
    transactionList.innerHTML = "";
    transactions.forEach(transaction=>{
        const div= document.createElement("div");
        div.classList.add("transaction-item");
         div.innerHTML=`
         <span class="transaction-title">${transaction.title}</span>
         <strong class="transaction-amount">${transaction.amount}ETB</strong>
        `
        transactionList.appendChild(div);

    })
    
}

 function calculateIncome(){
    const income=transactions.filter(t=>t.type==="income")
      .reduce((total, transaction)=>total+transaction.amount,0);
      return income;

 }

 function calculateTotalExpenses(){
    const expenses=transactions.filter(t=>t.type === "expense")
    .reduce((total, transaction)=>total + transaction.amount, 0);
    return expenses;
 }

 function calculateBalance(){
    const balance=calculateIncome()-calculateTotalExpenses();
    return balance;
 }

 function updateDashBoard(){
    const income=calculateIncome();
    const expenses=calculateTotalExpenses();
    const currentBalance=calculateBalance();
    const expensePercentage =
        income>0? (expenses/income)*100 : 0;
    

  balance.textContent=`${currentBalance.toFixed(2)}ETB`;
  incomeDisplay.innerHTML=`+${income.toFixed(2)}ETB`;
  spentPercentage.textContent=`${expensePercentage.toFixed(2)}%`;

  if (currentBalance<0){
    balance.style.color="red";
  }
  else{
    balance.style.color="green";
  }
  
 }
 

 transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const amount =
        Number(document.querySelector("#amount").value);

    const type =
        document.querySelector("#type").value;

    const category =
        document.querySelector("#category").value;

    const date =
        document.querySelector("#date").value;

    const notes =
        document.querySelector("#notes").value;


    const newTransaction = {

        id: Date.now(),

        title: category,

        amount: amount,

        type: type,

        category: category,

        date: date,

        notes: notes
    };


    transactions.push(newTransaction);


    renderTransactions();

   updateDashBoard();


    transactionForm.reset();

});

categoryButtons.forEach(button => {

    button.addEventListener("click", function() {

       categoryButtons.forEach(btn=>{
        btn.classList.remove("active");
       })
       button.classList.add("active");


        const selectedCategory =
            button.dataset.category;

        categoryInput.value =
            selectedCategory;

    });

});

function categorySpent(category){
    const  spent=transactions.filter((transaction)=>transaction.category===category && transaction.type==="expense")
                                   .reduce((total, transaction)=>total +transaction.amount, 0)
     return spent;
}

renderTransactions();
updateDashBoard();