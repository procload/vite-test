import { sanitizeSVG } from "../scripts/svg-sanitizer";
/**
 * SvgService is responsible for fetching, caching, and manipulating SVG content.
 * This includes loading SVG icons or sprites from given paths and preparing SVG
 * content for display. Cached SVGs ensure that repeated fetches are avoided.
 *
 * Typical usage:
 *
 * const svgContent = await SvgService.loadIconOrSprite('/path/to/sprite.svg', 'icon-name');
 *
 */
export default class SvgService {
    /**
     * Loads an SVG icon or sprite from a given path.
     *
     * @param path {string} - The path to the SVG file.
     * @param name {string} - The name (ID) of the icon if fetching from a sprite.
     * @returns {Promise<string>} - A promise that resolves to the SVG content or rejects with an error.
     */
    static async loadIconOrSprite(path, name) {
        try {
            let svgContent = await this.fetchAndCacheSVG(path);
            if (svgContent.includes("<symbol")) {
                return this.getIconFromSprite(svgContent, name);
            }
            else {
                return svgContent;
            }
        }
        catch (error) {
            console.error(`Failed to load SVG from path ${path}:`, error);
            throw error;
        }
    }
    /**
     * Fetches and caches an SVG from a given path.
     *
     * @param path {string} - The path to the SVG file.
     * @returns {Promise<string>} - A promise that resolves to the SVG content.
     */
    static async fetchAndCacheSVG(path) {
        if (!this.cache.has(path)) {
            try {
                const svgPromise = fetch(path)
                    .then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Network error: ${resp.status} ${resp.statusText}`);
                    }
                    return resp.text();
                })
                    .then((svg) => {
                    // Basic check for SVG format
                    if (!/<svg[\s\S]+<\/svg>/.test(svg)) {
                        throw new Error("Invalid SVG format");
                    }
                    return sanitizeSVG(svg);
                });
                this.cache.set(path, svgPromise);
                return await svgPromise;
            }
            catch (error) {
                console.error(`Failed to fetch and cache SVG from path ${path}:`, error);
                throw error; // Propagate the error so it can be handled by the calling code if needed
            }
        }
        return await this.cache.get(path);
    }
    /**
     * Extracts an icon from an SVG sprite.
     *
     * @param spriteContent {string} - The SVG sprite content.
     * @param iconName {string} - The name (ID) of the icon to extract.
     * @returns {string} - The SVG content for the icon.
     */
    static getIconFromSprite(spriteContent, iconName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(spriteContent, "image/svg+xml");
        const symbol = doc.querySelector(`symbol[id="${iconName}"]`);
        if (!symbol) {
            console.error(`Icon with ID ${iconName} not found in sprite.`);
            return "";
        }
        // Convert the symbol content into SVG.
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svgElem = document.createElementNS(svgNamespace, "svg");
        svgElem.setAttribute("xmlns", svgNamespace);
        svgElem.setAttributeNS(null, "viewBox", symbol.getAttribute("viewBox") || "");
        svgElem.innerHTML = symbol.innerHTML;
        return svgElem.outerHTML;
    }
    /**
     * Prepares SVG content, either as a standalone SVG or extracting it from a sprite.
     *
     * @param path {string} - The path to the SVG file.
     * @param name {string} - The name (ID) of the icon if fetching from a sprite.
     * @returns {Promise<{content: string, width?: string, height?: string}>} - A promise that resolves to the prepared SVG content and dimensions.
     */
    static async getPreparedSVG(path, name) {
        try {
            const content = await this.loadIconOrSprite(path, name);
            const doc = this.parseSVG(content);
            const symbol = doc.querySelector("symbol");
            if (symbol) {
                return this.getSVGDetailsFromSymbol(symbol);
            }
            else {
                return this.getSVGDetailsFromSVGElement(doc);
            }
        }
        catch (error) {
            console.error(`Failed to prepare SVG from path ${path}:`, error);
            throw error;
        }
    }
    /**
     * Parse the input SVG string and return an SVG Document.
     *
     * @param svgString {string} - The input SVG content in string format.
     * @returns {Document} - The parsed SVG as a Document.
     */
    static parseSVG(svgString) {
        const parser = new DOMParser();
        return parser.parseFromString(svgString, "image/svg+xml");
    }
    /**
     * Converts an SVG symbol to an SVG element, extracting and returning its content and dimensions.
     *
     * @param symbol {Element} - The SVG symbol element to be converted.
     * @returns {{ content: string, width?: string, height?: string }} - An object containing the SVG content and optional width and height.
     */
    static getSVGDetailsFromSymbol(symbol) {
        const viewBox = symbol.getAttribute("viewBox");
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("viewBox", viewBox || "");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        while (symbol.firstChild) {
            svgElement.appendChild(symbol.firstChild);
        }
        const width = symbol.getAttribute("width") || undefined;
        const height = symbol.getAttribute("height") || undefined;
        return {
            content: svgElement.outerHTML,
            width,
            height,
        };
    }
    /**
     * Extracts content and dimensions from the first SVG element within a Document.
     *
     * @param doc {Document} - The Document containing SVG data.
     * @returns {{ content: string, width?: string, height?: string }} - An object with the SVG content and optional width and height.
     */
    static getSVGDetailsFromSVGElement(doc) {
        const svgElem = doc.querySelector("svg");
        let width;
        let height;
        if (svgElem) {
            width = svgElem.getAttribute("width") || undefined;
            height = svgElem.getAttribute("height") || undefined;
        }
        return {
            content: (svgElem === null || svgElem === void 0 ? void 0 : svgElem.outerHTML) || "",
            width,
            height,
        };
    }
}
SvgService.cache = new Map();
//# sourceMappingURL=svg-service.js.map