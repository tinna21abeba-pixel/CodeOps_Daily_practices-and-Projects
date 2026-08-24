const API = "https://open.er-api.com/v6/latest/ETB";

// STATE => What your app knows about the world at any given moment in time

const state = {
  rates: {}, // to fill up with fetched rates
  watchlist: [], // to fill up with watched currencies
  currency: "USD", // Selected currency for conversion
  amount: 100, // Written amount in ETB to convert
};

const form = document.querySelector("#convert-form");

const amountInput = document.querySelector("#amount");

const currencySelect = document.querySelector("#currency");

const result = document.querySelector("#result");

const addWatchButton = document.querySelector("#add-watch");

const watchlist = document.querySelector("#watchlist");

const status = document.querySelector("#status");

const STORAGE_KEY = "birr-watch";

function save() {
  const data = {
    watchlist: state.watchlist,
    currency: state.currency,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return;
  }

  try {
    const data = JSON.parse(saved);

    state.watchlist = data.watchlist || [];

    state.currency = data.currency || "USD";
  } catch (error) {
    console.log("Could not load saved data.");
  }
}

async function loadRates() {
  try {
    status.textContent = "Loading rates...";

    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Failed to load rates");
    }

    const data = await response.json();

    state.rates = data.rates;

    status.textContent = "";

    renderOptions();
  } catch (error) {
    status.textContent = "Could not load rates.";
  }
}

function renderOptions() {
  const currencies = Object.keys(state.rates);
  // OBJECT.KEYS()
  // Returns an array of a given object's property names
  // currencies = ["USD", "EUR", "GBP", ...]

  const options = currencies.map(function (currency) {
    return `
                <option value="${currency}">
                    ${currency}
                </option>
            `;
  });

  currencySelect.innerHTML = options.join("");

  currencySelect.value = state.currency;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const amount = Number(amountInput.value);

  if (amount <= 0) {
    result.textContent = "Enter a valid amount.";

    return;
  }

  const currency = currencySelect.value;

  state.amount = amount;

  state.currency = currency;

  const rate = state.rates[currency];

  const converted = amount * rate;

  const formatted = converted.toFixed(3);

  result.textContent = `${amount} ETB = ${formatted} ${currency}`;

  save();
});

addWatchButton.addEventListener("click", function () {
  const currency = currencySelect.value;

  if (state.watchlist.includes(currency)) {
    return;
  }

  state.watchlist.push(currency);

  save();

  renderWatchlist();
});

function renderWatchlist() {
  const lists = state.watchlist
    .map(function (currency) {
      const rate = state.rates[currency];

      return `
                    <li data-currency="${currency}">

                        ${currency}
                        -
                        1 ETB = ${rate} ${currency}

                        <button
                            class="remove"
                            type="button"
                        >
                            Remove
                        </button>

                    </li>
                `;
    })
    .join("");

  watchlist.innerHTML = lists;
}

watchlist.addEventListener("click", function (event) {
  if (!event.target.matches(".remove")) {
    return;
  }

  const item = event.target.closest("li");

  const currency = item.dataset.currency;

  state.watchlist = state.watchlist.filter(function (item) {
    return item !== currency;
  });

  save();

  renderWatchlist();
});

async function init() {
  load();

  await loadRates();

  renderWatchlist();
}

init();
