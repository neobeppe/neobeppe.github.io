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
const finalText = "Beppe";
let touchStartY = null;

if (emailAnchor) {
    const mail = emailAddress();
    emailAnchor.href = `mailto:${mail}`;
    emailAnchor.textContent = "Email";
}

function completeTyping() {
    typingTimers.forEach((timer) => window.clearTimeout(timer));

    if (typedText) {
        typedText.textContent = finalText;
    }

    cursor?.classList.add("hidden");
}

function setRevealed(isRevealed) {
    document.body.classList.toggle("revealed", isRevealed);
    nameButton?.setAttribute("aria-expanded", String(isRevealed));
}

function revealText() {
    if (document.body.classList.contains("revealed")) {
        return;
    }

    completeTyping();
    setRevealed(true);
}

function moveDotToEnd() {
    if (!typedText || !typedText.textContent.includes(".")) {
        completeTyping();
        return;
    }

    const dottedText = typedText.textContent;
    const dotIndex = dottedText.indexOf(".");
    const beforeText = dottedText.slice(0, dotIndex);
    const afterText = dottedText.slice(dotIndex + 1);
    typedText.textContent = "";

    const beforeDot = document.createElement("span");
    const dot = document.createElement("span");
    const movingTail = document.createElement("span");

    beforeDot.textContent = beforeText;
    dot.className = "traveling-dot";
    dot.textContent = ".";
    movingTail.className = "moving-tail";
    movingTail.textContent = afterText;
    typedText.append(beforeDot, dot, movingTail);

    const startRect = beforeDot.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const movingTailRect = movingTail.getBoundingClientRect();
    const dotOffset = dotRect.left - startRect.left;
    const movingTailOffset = movingTailRect.left - startRect.left;

    typedText.textContent = "";
    const finalStart = document.createElement("span");
    finalStart.textContent = beforeText;
    const finalTail = document.createElement("span");
    finalTail.textContent = afterText;
    typedText.append(finalStart, finalTail);
    const finalStartRect = finalStart.getBoundingClientRect();
    const finalTailRect = finalTail.getBoundingClientRect();
    const finalTailOffset = finalTailRect.left - finalStartRect.left;

    typedText.textContent = "";
    const finalWord = document.createElement("span");
    finalWord.textContent = finalText;
    const destinationDot = document.createElement("span");
    destinationDot.textContent = ".";
    typedText.append(finalWord, destinationDot);
    const finalWordRect = finalWord.getBoundingClientRect();
    const destinationDotRect = destinationDot.getBoundingClientRect();
    const destinationDotOffset = destinationDotRect.left - finalWordRect.left;

    typedText.textContent = "";
    typedText.append(beforeDot, dot, movingTail);
    const destinationX = destinationDotOffset - dotOffset;
    const tailX = finalTailOffset - movingTailOffset;

    dot.animate(
        [
            { transform: "translateX(0)", opacity: 1 },
            { transform: `translateX(${destinationX}px)`, opacity: 1 }
        ],
        { duration: 980, easing: "cubic-bezier(.2, 0, 0, 1)", fill: "forwards" }
    );

    movingTail.animate(
        [
            { transform: "translateX(0)" },
            { transform: `translateX(${tailX}px)` }
        ],
        { duration: 980, easing: "cubic-bezier(.2, 0, 0, 1)", fill: "forwards" }
    );

    typingTimers.push(window.setTimeout(() => {
        dot.animate(
            [
                { opacity: 1 },
                { opacity: 0 }
            ],
            { duration: 560, easing: "ease", fill: "forwards" }
        );
    }, 1760));

    typingTimers.push(window.setTimeout(() => {
        const visualLeft = beforeDot.getBoundingClientRect().left;
        typedText.textContent = finalText;
        const finalLeft = typedText.getBoundingClientRect().left;
        const settleX = visualLeft - finalLeft;

        typedText.animate(
            [
                { transform: `translateX(${settleX}px)` },
                { transform: "translateX(0)" }
            ],
            { duration: 620, easing: "cubic-bezier(.2, 0, 0, 1)" }
        );
    }, 2520));
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
        moveDotToEnd();
    }, startDelay + text.length * characterDelay + 650));
} else {
    completeTyping();
}

if (nameButton) {
    nameButton.addEventListener("click", () => {
        completeTyping();
        setRevealed(!document.body.classList.contains("revealed"));
    });
}

window.addEventListener("wheel", revealText, { passive: true });
window.addEventListener("scroll", revealText, { passive: true });
window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
}, { passive: true });

window.addEventListener("touchmove", (event) => {
    if (touchStartY === null) {
        return;
    }

    const touchY = event.touches[0]?.clientY;

    if (touchY !== undefined && Math.abs(touchY - touchStartY) > 12) {
        revealText();
        touchStartY = null;
    }
}, { passive: true });
