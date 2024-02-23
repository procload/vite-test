/**
 * Sets the specified attributes on the given HTML element.
 * @param {HTMLElement} element The HTML element on which to set attributes.
 * @param {{[key: string]: string}} attributes An object mapping attribute names to values.
 */
export function setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}
//# sourceMappingURL=attribute-utilities.js.map