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
    private static cache;
    /**
     * Loads an SVG icon or sprite from a given path.
     *
     * @param path {string} - The path to the SVG file.
     * @param name {string} - The name (ID) of the icon if fetching from a sprite.
     * @returns {Promise<string>} - A promise that resolves to the SVG content or rejects with an error.
     */
    static loadIconOrSprite(path: string, name: string): Promise<string>;
    /**
     * Fetches and caches an SVG from a given path.
     *
     * @param path {string} - The path to the SVG file.
     * @returns {Promise<string>} - A promise that resolves to the SVG content.
     */
    private static fetchAndCacheSVG;
    /**
     * Extracts an icon from an SVG sprite.
     *
     * @param spriteContent {string} - The SVG sprite content.
     * @param iconName {string} - The name (ID) of the icon to extract.
     * @returns {string} - The SVG content for the icon.
     */
    private static getIconFromSprite;
    /**
     * Prepares SVG content, either as a standalone SVG or extracting it from a sprite.
     *
     * @param path {string} - The path to the SVG file.
     * @param name {string} - The name (ID) of the icon if fetching from a sprite.
     * @returns {Promise<{content: string, width?: string, height?: string}>} - A promise that resolves to the prepared SVG content and dimensions.
     */
    static getPreparedSVG(path: string, name: string): Promise<{
        content: string;
        width?: string;
        height?: string;
    }>;
    /**
     * Parse the input SVG string and return an SVG Document.
     *
     * @param svgString {string} - The input SVG content in string format.
     * @returns {Document} - The parsed SVG as a Document.
     */
    private static parseSVG;
    /**
     * Converts an SVG symbol to an SVG element, extracting and returning its content and dimensions.
     *
     * @param symbol {Element} - The SVG symbol element to be converted.
     * @returns {{ content: string, width?: string, height?: string }} - An object containing the SVG content and optional width and height.
     */
    private static getSVGDetailsFromSymbol;
    /**
     * Extracts content and dimensions from the first SVG element within a Document.
     *
     * @param doc {Document} - The Document containing SVG data.
     * @returns {{ content: string, width?: string, height?: string }} - An object with the SVG content and optional width and height.
     */
    private static getSVGDetailsFromSVGElement;
}
//# sourceMappingURL=svg-service.d.ts.map