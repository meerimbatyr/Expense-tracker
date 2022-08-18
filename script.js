const balanceAmount = document.getElementById("balance");
const moneyPlusAmount = document.getElementById("money-plus");
const moneyMinusAmount = document.getElementById("money-minus");
const historyList = document.getElementById("list");
const addTransactionForm = document.getElementById("form");
const newTransactionText = document.getElementById("text");
const newTransactionAmount = document.getElementById("amount");

const getFromLocalStorage = JSON.parse(localStorage.getItem("transactions"));
// console.log(getFromLocalStorage);

let transactions = localStorage.getItem("transactions")
  ? getFromLocalStorage
  : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (!newTransactionText.value && !newTransactionAmount.value) {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: getId(),
      text: newTransactionText.value,
      amount: +newTransactionAmount.value,
    };
    transactions.push(transaction);
    // console.log(transactions);

    updateDOM(transaction);

    calculateValues(transaction);

    updateLocalStorage(transaction.id);
  }
}

//generate unique ID
function getId() {
  return Math.floor(Date.now() * Math.random());
}

//update DOM
function updateDOM(transaction) {
  historyList.innerHTML += `
    <li class=${transaction.amount > 0 ? "plus" : "minus"}>${
    transaction.text
  }<span>${transaction.amount > 0 ? `+` : `-`}${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" onclick="deleteTransaction(${
    transaction.id
  })">x</button></li>
  `;
  //clear inputs
  newTransactionText.value = "";
  newTransactionAmount.value = "";
}

//calculating balance, income and expense
function calculateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((prev, current) => (prev += current), 0);

  const expense =
    amounts
      .filter((amount) => amount < 0)
      .reduce((prev, current) => (prev += current), 0) * -1;

  const total = amounts.reduce((prev, current) => (prev += current), 0);

  moneyPlusAmount.innerHTML = `$${income.toFixed(2)}`;
  moneyMinusAmount.innerHTML = `$${expense.toFixed(2)}`;
  balanceAmount.innerHTML = `$${total.toFixed(2)}`;
}

//delete transaction by ID
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  reset();
}

function reset() {
  historyList.innerHTML = "";
  transactions.forEach(updateDOM);
  calculateValues();
}
reset();

//update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// event listener on form

addTransactionForm.addEventListener("submit", addTransaction);
