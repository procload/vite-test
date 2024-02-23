/**
 * SVG Sanitizer Script
 *
 * This script provides a function, `sanitizeSVG`, designed to sanitize SVG content strings by removing
 * potentially harmful or malicious tags and attributes. It takes an SVG content string as input and returns
 * a sanitized SVG content string.
 *
 * It strictly disallows a predefined list of tags and attributes that can be exploited for malicious purposes
 * such as Cross-Site Scripting (XSS) attacks. Any occurrence of blocked tags and attributes within the provided
 * SVG content is removed during the sanitization process.
 *
 * Example Usage:
 * const sanitizedSVG = sanitizeSVG('<svg><script>alert("XSS")</script></svg>');
 *
 * Upon finding and removing any blocked tags or attributes, the sanitizer logs a warning message
 * to the console for visibility.
 */
const BLOCKED_TAGS = [
    "base",
    "embed",
    "form",
    "frame",
    "iframe",
    "link",
    "meta",
    "object",
    "script",
    "style",
];
const BLOCKED_ATTRS = [
    "data",
    "formaction",
    "onclick",
    "onerror",
    "onload",
    "onmouseover",
    "src",
];
/**
 * sanitizeSVG
 *
 * @param {string} svgString - The original SVG content string.
 * @returns {string} - Sanitized SVG content string.
 *
 */
export function sanitizeSVG(svgString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    // Handle parsing error
    if (!doc.documentElement || doc.documentElement.nodeName === "parsererror") {
        const errorText = doc.documentElement
            ? doc.documentElement.textContent
            : "";
        console.error("SVG parsing error", errorText);
        return "";
    }
    removeBlockedElementsAndAttributes(doc, BLOCKED_TAGS, BLOCKED_ATTRS);
    // Serialize the sanitized SVG content back to string
    return new XMLSerializer().serializeToString(doc.documentElement);
}
/**
 * removeBlockedElementsAndAttributes
 *
 * @param {Document} doc - The SVG DOM document.
 * @param {string[]} blockedTags - Array of blocked tags.
 * @param {string[]} blockedAttrs - Array of blocked attributes.
 *
 */
function removeBlockedElementsAndAttributes(doc, blockedTags, blockedAttrs) {
    var _a;
    // Remove blocked tags and attributes and log them
    const allElements = Array.from(doc.querySelectorAll("*"));
    for (const element of allElements) {
        const tagName = element.tagName.toLowerCase();
        if (blockedTags.includes(tagName)) {
            console.warn(`Custom SVG Sanitizer: Found and removed blocked tag: <${tagName}>`);
            (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
        }
        else {
            for (const attr of element.getAttributeNames()) {
                if (blockedAttrs.includes(attr.toLowerCase()) ||
                    /^on[a-z]+/.test(attr.toLowerCase())) {
                    console.warn(`Custom SVG Sanitizer: Found and removed blocked attribute: ${attr} from <${element.tagName.toLowerCase()}>`);
                    element.removeAttribute(attr);
                }
            }
        }
    }
}
//# sourceMappingURL=svg-sanitizer.js.map