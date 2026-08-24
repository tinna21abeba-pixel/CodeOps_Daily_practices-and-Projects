const signupForm = document.querySelector("#signup-form");
const nameInput = document.querySelector("#name-input");
const phoneInput = document.querySelector("#phone-input");
const signupError = document.querySelector("#signup-error");
const signupCount = document.querySelector("#signup-count");


function load(key) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
}

function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let people = load("people");

function renderSignupCount() {
    signupCount.textContent = `${people.length} people have signed up.`;
}

renderSignupCount();

// Requirement: Validation: name at least two characters; phone matches /^(?:\+251|0)9\d{8}$/.
const PHONE = /^(?:\+251|0)9\d{8}$/;

function validate(name, phone) {
    if (name.length < 2) return "Enter your full name.";
    if (!PHONE.test(phone)) return "Enter a valid phone.";
    return "";
}

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    signupError.textContent = "";

    const errorMsg = validate(name, phone);
    
    if (errorMsg !== "") {
        signupError.textContent = errorMsg;
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
