



const myform = document.querySelector("#search-form");
const myInput = document.querySelector("#country-input");
const btn = document.querySelector("#btn");
const facts = document.querySelector("#facts");

// Theme
const themeToggle = document.querySelector("#theme-toggle");

// Signup
const signupForm = document.querySelector("#signup-form");
const nameInput = document.querySelector("#name-input");
const phoneInput = document.querySelector("#phone-input");
const signupError = document.querySelector("#signup-error");
const signupCount = document.querySelector("#signup-count");


// ==============================
// THEME
// ==============================

let currentTheme = "light";

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

themeToggle.addEventListener("click", () => {
    if (currentTheme === "light") {
        currentTheme = "dark";
    } else {
        currentTheme = "light";
    }

    applyTheme(currentTheme);

    localStorage.setItem("theme", currentTheme);
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
}


// ==============================
// LOCAL STORAGE HELPERS
// ==============================

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
    try {
        const data = localStorage.getItem(key);

        if (data === null) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


// ==============================
// COUNTRY FACTS
// ==============================

function renderStat(label, value) {
    const div = document.createElement("div");
    const strong = document.createElement("strong");
    const span = document.createElement("span");

    strong.textContent = label + ":";
    span.textContent = value;

    div.appendChild(strong);
    div.appendChild(span);
    facts.appendChild(div);
}

const API_KEY = "rc_live_7dd3840ff4004c8abedb2457f49d46de"; 

async function dataFetching(countryName) {
    facts.textContent = "Loading...";

    try {
        const res = await fetch(
            `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}&api-key=${API_KEY}`
        );

        if (!res.ok) {
            throw new Error("Country not found");
        }

        const data = await res.json();
        const country = data.data.objects[0];

        facts.innerHTML = "";

        renderStat(
            "Capital",
            country.capitals[0].name
        );

        renderStat(
            "Population",
            country.population
                ? country.population.toLocaleString()
                : "N/A"
        );

        renderStat(
            "Region",
            country.region || "N/A"
        );

        renderStat(
            "Currencies code",
            country.currencies[0].code
        );

        renderStat(
            "Currencies name",
            country.currencies[0].name
        );

        const flagUrl = country.flag.url_svg[0];

        const image = document.createElement("img");

        image.src = flagUrl;
        image.alt = `Flag of ${countryName}`;

        facts.appendChild(image);

    } catch (error) {
        facts.textContent = error.message;
    }
}

dataFetching("ethiopia");

myform.addEventListener("submit", (e) => {
    e.preventDefault();

    if (myInput.value.trim() !== "") {
        dataFetching(myInput.value.trim());
        myInput.value = "";
    }
});


// ==============================
// SIGNUP
// ==============================

let people = load("people");

function renderSignupCount() {
    signupCount.textContent =
        `${people.length} people have signed up.`;
}

renderSignupCount();

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    signupError.textContent = "";

    if (name.length < 2) {
        signupError.textContent =
            "Name must be at least 2 characters.";
        return;
    }

    const ethiopianPhoneRegex = /^(09|07)\d{8}$/;

    if (!ethiopianPhoneRegex.test(phone)) {
        signupError.textContent =
            "Please enter a valid Ethiopian phone number.";
        return;
    }

    people.push({
        name: name,
        phone: phone
    });

    save("people", people);

    signupForm.reset();

    renderSignupCount();
});