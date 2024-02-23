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
/**
 * sanitizeSVG
 *
 * @param {string} svgString - The original SVG content string.
 * @returns {string} - Sanitized SVG content string.
 *
 */
export declare function sanitizeSVG(svgString: string): string;
//# sourceMappingURL=svg-sanitizer.d.ts.map