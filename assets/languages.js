const content = document.getElementById("content");
const buttons = {
    it: document.getElementById("btn-it"),
    en: document.getElementById("btn-en")
};

function emailAddress() {
    return [109, 101, 64, 98, 101, 112, 46, 112, 101]
        .map((code) => String.fromCharCode(code))
        .join("");
}

function hydrateEmail(container) {
    const anchor = container.querySelector("[data-email]");
    const mail = emailAddress();

    anchor.href = `mailto:${mail}`;
    anchor.textContent = mail;
}

function updateLanguage(lang) {
    const template = document.getElementById(`content-${lang}`) || document.getElementById("content-en");
    const fragment = template.content.cloneNode(true);

    hydrateEmail(fragment);
    content.replaceChildren(fragment);
    document.documentElement.lang = lang;

    Object.entries(buttons).forEach(([buttonLang, button]) => {
        button.setAttribute("aria-pressed", String(buttonLang === lang));
    });
}

const userLang = navigator.language.startsWith("it") ? "it" : "en";

buttons.it.addEventListener("click", () => updateLanguage("it"));
buttons.en.addEventListener("click", () => updateLanguage("en"));

updateLanguage(userLang);
