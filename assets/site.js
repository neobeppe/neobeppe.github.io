function emailAddress() {
    return [109, 101, 64, 98, 101, 112, 46, 112, 101]
        .map((code) => String.fromCharCode(code))
        .join("");
}

const nameButton = document.querySelector(".name-button");
const emailAnchor = document.querySelector("[data-email]");
const typedText = document.querySelector("[data-text]");
const cursor = document.querySelector(".cursor");
const typingTimers = [];

if (emailAnchor) {
    const mail = emailAddress();
    emailAnchor.href = `mailto:${mail}`;
    emailAnchor.textContent = "Email";
}

function completeTyping() {
    typingTimers.forEach((timer) => window.clearTimeout(timer));

    if (typedText && typedText.dataset.text) {
        typedText.textContent = typedText.dataset.text;
    }

    cursor?.classList.add("hidden");
}

if (typedText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const text = typedText.dataset.text || typedText.textContent;
    const startDelay = 2200;
    const characterDelay = 180;
    typedText.textContent = "";

    Array.from(text).forEach((character, index) => {
        const timer = window.setTimeout(() => {
            typedText.textContent += character;
        }, startDelay + index * characterDelay);

        typingTimers.push(timer);
    });

    typingTimers.push(window.setTimeout(() => {
        cursor?.classList.add("hidden");
    }, startDelay + text.length * characterDelay + 900));
} else {
    cursor?.classList.add("hidden");
}

if (nameButton) {
    nameButton.addEventListener("click", () => {
        completeTyping();

        const isRevealed = document.body.classList.toggle("revealed");
        nameButton.setAttribute("aria-expanded", String(isRevealed));
    });
}
