const roleText = document.querySelector("#role-text");
const navbar=document.querySelector(".navbar")

const text = roleText.textContent.trim();
navbar.style
roleText.textContent = "";

text.split("").forEach((letter, index) => {
    const span = document.createElement("span");

    span.textContent = letter === " " ? "\u00A0" : letter;

    span.classList.add("rain-letter");

    span.style.setProperty("--delay", `${index * 0.08}s`);

    roleText.appendChild(span);
});