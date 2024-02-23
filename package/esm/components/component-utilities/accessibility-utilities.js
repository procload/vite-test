/**
 * Checks whether the specified element is disabled.
 * @param {Element} el The element to check.
 */
export function isDisabledElement(el) {
    return el.getAttribute("aria-disabled") === "true";
}
/**
 * Checks whether the specified element is hidden.
 * @param {Element} el The element to check.
 */
export function isHiddenElement(el) {
    return el.getAttribute("aria-hidden") === "true";
}
/**
 * Checks whether the specified element is focusable.
 * @param {Element} el The element to check.
 */
export function isFocusableElement(el) {
    return (!isDisabledElement(el) &&
        !isHiddenElement(el) &&
        el.offsetParent !== null);
}
//# sourceMappingURL=accessibility-utilities.js.map