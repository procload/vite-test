import { FASTElement } from "@microsoft/fast-element";
import { TeachingBubblePlacement, TeachingBubbleSize } from "./teaching-bubble.options";
/**
 * A TeachingBubble Custom HTML Element.
 * @public
 * @class
 * @extends FASTElement
 *
 * @remarks
 * HTML Element: \<hwc-teaching-bubble\>
 * Roles: Implements {@link https://www.w3.org/TR/wai-aria-1.1/#tooltip | ARIA tooltip } on internal container.
 * Composition: TeachingBubble
 *
 * @slot default - The slot for bubble content
 * @slot footer - The slot for bubble footer
 * @slot close - The slot for close button
 * @slot image - The slot for image
 * @slot heading - The slot for heading
 *
 * @attr {string} target - The ID of the element that the teaching bubble is attached to.
 * @attr {TeachingBubblePlacement} placement - The placement of the teaching bubble relative to the target.
 * @attr {boolean} open - Determines whether the teaching bubble is open.
 * @attr {boolean} disable-trap-focus - Determines whether focus trapping is disabled.
 * @attr {TeachingBubbleSize} size - The size of the teaching bubble.
 *
 * @csspart content - The content container for the teaching bubble
 * @csspart footer - The footer container for the teaching bubble
 * @csspart heading - The heading container for the teaching bubble
 * @csspart close - The close button container for the teaching bubble
 * @csspart image - The image container for the teaching bubble
 * @csspart arrow - The arrow container for the teaching bubble
 *
 * @fires openchange - Fires a custom 'openchange' event when the open state changes
 * @fires dismiss - Fires a custom 'dismiss' event when the teaching bubble is dismissed
 *
 * @public
 */
export declare class TeachingBubble extends FASTElement {
    /**
     * @public
     * Method gets called when the component is inserted into the document.
     */
    connectedCallback(): void;
    /**
     * @public
     * Method to perform cleanup tasks.
     */
    disconnectedCallback(): void;
    /**
     * The target element that the teaching bubble is attached to.
     * @type {string}
     * @default ""
     */
    readonly target: string;
    /**
     * The placement of the teaching bubble relative to the target.
     * @type {string}
     *
     */
    readonly placement?: TeachingBubblePlacement;
    /**
     * Determines whether the teaching bubble is open or not.
     * @type {boolean}
     */
    open?: boolean;
    /**
     * Determines whether focus trapping is disabled or not.
     * @type {boolean}
     */
    disableTrapFocus?: boolean;
    /**
     * The size of the teaching bubble.
     * @type {TeachingBubbleSize}
     */
    readonly size?: TeachingBubbleSize;
    /**
     * The target element that the teaching bubble is attached to.
     * @type {HTMLElement | null}
     */
    private targetEl?;
    /**
     * The current element that has focus within the teaching bubble.
     * @type {HTMLElement | null}
     */
    private currentEl?;
    /**
     * The arrow element of the teaching bubble.
     * @type {HTMLElement | null}
     */
    private arrowEl?;
    /**
     * Determines whether the teaching bubble is currently trapping focus or not.
     * @type {boolean}
     */
    private isTrappingFocus;
    /**
     * Determines whether the teaching bubble should trap focus or not.
     * @type {boolean}
     */
    private trapFocus;
    /**
     * Useful for cleanup task of floating UI auto update from dom.
     * @type {boolean}
     */
    private cleanAutoUpdate;
    /**
     * @public
     * Method to show bubble.
     */
    show: () => void;
    /**
     * @public
     * Method to hide bubble.
     * @param dismiss - Determines whether the teaching bubble should be dismissed or not.
     */
    hide: (dismiss?: boolean) => void;
    /**
     * @public
     * Method called when the 'open' attribute changes.
     */
    openChanged(): void;
    private renderResolver;
    private renderPromise;
    /**
     * @private
     * Method to set the target, current and arrow elements.
     */
    private setElements;
    /**
     * @private
     * Method to update position when element is rendered in the dom.
     */
    private updatePosition;
    /**
     * @private
     * Handles keydown events on the document
     * @param e - The keydown event
     */
    private handleDocumentKeydown;
    /**
     * @private
     * Handles tab keydown events
     * @param e - The keydown event
     */
    private handleTabKeyDown;
    /**
     * @private
     * Gets the bounds of the tab queue
     * @returns (HTMLElement | SVGElement)[]
     */
    private getTabQueueBounds;
    /**
     * @private
     * Reduces the list of tabbable items
     * @param elements - The current list of elements
     * @param element - The element to consider adding to the list
     * @returns HTMLElement[]
     */
    private static reduceTabbableItems;
    /**
     * @private
     * Determines if an element is a focusable FASTElement
     * @param element - The element to check
     * @returns boolean
     */
    private static isFocusableFastElement;
    /**
     * @private
     * Determines if an element has a tabbable shadow
     * @param element - The element to check
     * @returns boolean
     */
    private static hasTabbableShadow;
    /**
     * @private
     * Updates the state of focus trapping
     * @param shouldTrapFocusOverride - Optional override for whether focus should be trapped
     */
    private updateTrapFocus;
    /**
     * @private
     * Handles focus events on the document
     * @param e - The focus event
     */
    private handleDocumentFocus;
    /**
     * @private
     * Focuses the first element in the tab queue
     */
    private focusFirstElement;
    /**
     * @private
     * Determines if focus should be forced
     * @param currentFocusElement - The currently focused element
     * @returns boolean
     */
    private shouldForceFocus;
    /**
     * @private
     * Determines if focus should be trapped
     * @returns boolean
     */
    private shouldTrapFocus;
    /**
     * @private
     * Method to check if attribute 'disable-trap-focus' is present or not.
     */
    private disableTrapFocusHandler;
    /**
     * @private
     * Method to initialize the position of bubble.
     */
    private initializePosition;
}
//# sourceMappingURL=teaching-bubble.d.ts.map