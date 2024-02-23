import { FASTElement } from "@microsoft/fast-element";
export declare class SvgIcon extends FASTElement {
    private computedStylesheet?;
    private isLoading;
    private isError;
    /**
     * The name of the SVG to use from the SVG sprite.
     * @public
     * @remarks
     * HTML Attribute: name
     * @type {string}
     */
    name: string;
    nameChanged(): void;
    /**
     * The size of the icon. Value must match icon size as indicated in its name.
     * @public
     * @remarks
     * HTML Attribute: size
     * @type {string}
     */
    size: string;
    sizeChanged(): void;
    /**
     * Path to SVG. Can be standalone SVG or SVG sprite.
     * @public
     * @remarks
     * HTML Attribute: path
     * @type {string}
     */
    path: string;
    pathChanged(): void;
    /**
     * Whether the icon is hidden from screen readers. Defaults to true.
     * @public
     * @remarks
     * HTML Attribute: aria-hidden
     * @type {string}
     */
    ariaHidden: string;
    /**
     * Optional label for the icon. Emitted via aria-label.
     * @public
     * @remarks
     * HTML Attribute: label
     * @type {string}
     */
    ariaLabel: string | null;
    /**
     * Whether the icon is focusable. Defaults to false.
     * @public
     * @remarks
     * HTML Attribute: focusable
     * @type {string}
     */
    focusable: string | null;
    /**
     * The role of the icon. Defaults to null.
     * @public
     * @remarks
     * HTML Attribute: role
     * @type {string}
     */
    role: string | null;
    private renderResolver;
    private renderPromise;
    connectedCallback(): void;
    private checkAndResolveRenderPromise;
    private renderIcon;
    private renderErrorIcon;
    private updateComputedStylesheet;
    private updateSvgAttributes;
}
//# sourceMappingURL=svg-icon.d.ts.map