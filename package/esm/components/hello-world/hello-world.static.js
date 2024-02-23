function createToggle() {
    const toggle = document.createElement("input");
    toggle.setAttribute("type", "checkbox");
    toggle.addEventListener("change", () => {
        const liveHelloWorldElement = document.querySelector(".hw-element");
        if (liveHelloWorldElement === null || liveHelloWorldElement === void 0 ? void 0 : liveHelloWorldElement.hasAttribute("disabled")) {
            liveHelloWorldElement === null || liveHelloWorldElement === void 0 ? void 0 : liveHelloWorldElement.removeAttribute("disabled");
        }
        else {
            liveHelloWorldElement === null || liveHelloWorldElement === void 0 ? void 0 : liveHelloWorldElement.setAttribute("disabled", "");
        }
    });
    return toggle;
}
function createLabel() {
    const label = document.createElement("label");
    label.innerText = "Disable Hello World";
    return label;
}
function createHelloWorldEl() {
    const helloWorldElement = document.createElement("hwc-hello-world");
    helloWorldElement.setAttribute("class", "hw-element");
    helloWorldElement.setAttribute("size", "medium");
    return helloWorldElement;
}
function createDivEl() {
    const divElement = document.createElement("div");
    divElement.setAttribute("class", "hw-container");
    return divElement;
}
function existingElCheck() {
    const app = document.getElementById("app");
    const existingElement = app === null || app === void 0 ? void 0 : app.querySelector(".hw-container");
    if (existingElement) {
        return existingElement;
    }
    else
        return false;
}
export function createHelloWorld() {
    const existingEl = existingElCheck();
    if (existingEl) {
        return existingEl;
    }
    const divElement = createDivEl();
    const helloWorldElement = createHelloWorldEl();
    const label = createLabel();
    const toggle = createToggle();
    divElement.appendChild(label);
    divElement.appendChild(toggle);
    divElement.appendChild(helloWorldElement);
    return divElement;
}
//# sourceMappingURL=hello-world.static.js.map