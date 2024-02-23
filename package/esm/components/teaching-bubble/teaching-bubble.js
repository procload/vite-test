var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { arrow, autoPlacement, autoUpdate, computePosition, offset, } from "@floating-ui/dom";
import { FASTElement, Updates, attr, observable, } from "@microsoft/fast-element";
import { keyEscape, keyTab } from "@microsoft/fast-web-utilities";
import { isTabbable } from "tabbable";
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
export class TeachingBubble extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The target element that the teaching bubble is attached to.
         * @type {string}
         * @default ""
         */
        this.target = "";
        /**
         * Determines whether focus trapping is disabled or not.
         * @type {boolean}
         */
        this.disableTrapFocus = false;
        /**
         * Determines whether the teaching bubble is currently trapping focus or not.
         * @type {boolean}
         */
        this.isTrappingFocus = false;
        /**
         * Determines whether the teaching bubble should trap focus or not.
         * @type {boolean}
         */
        this.trapFocus = false;
        /**
         * Useful for cleanup task of floating UI auto update from dom.
         * @type {boolean}
         */
        this.cleanAutoUpdate = null;
        /**
         * @public
         * Method to show bubble.
         */
        this.show = () => {
            this.updatePosition();
            // Auto updates the position of anchored Teaching Bubble to its reference element on resize.
            this.cleanAutoUpdate = autoUpdate(this.targetEl, this.currentEl, this.updatePosition);
            this.open = true;
            this.trapFocus = true;
            this.updateTrapFocus(true);
        };
        /**
         * @public
         * Method to hide bubble.
         * @param dismiss - Determines whether the teaching bubble should be dismissed or not.
         */
        this.hide = (dismiss = false) => {
            var _a;
            this.open = false;
            (_a = this.currentEl) === null || _a === void 0 ? void 0 : _a.setAttribute("hidden", "");
            if (dismiss) {
                this.$emit("dismiss");
            }
        };
        this.renderResolver = null;
        this.renderPromise = new Promise((resolve) => {
            this.renderResolver = resolve;
        });
        /**
         * @private
         * Method to set the target, current and arrow elements.
         */
        this.setElements = () => {
            var _a;
            this.targetEl = document.getElementById(this.target);
            this.currentEl = this;
            this.arrowEl = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById("arrow");
        };
        /**
         * @private
         * Method to update position when element is rendered in the dom.
         */
        this.updatePosition = () => {
            this.setElements();
            // Initial position of the Teaching Bubble popup.
            const computeObj = this.placement
                ? {
                    placement: this.placement,
                    middleware: [
                        offset(10),
                        arrow({
                            element: this.arrowEl,
                            padding: 4, // Prevents arrow from overflowing the corners, matches border radius of bubble.
                        }),
                    ],
                }
                : {
                    middleware: [
                        autoPlacement({ autoAlignment: true }),
                        offset(10),
                        arrow({
                            element: this.arrowEl,
                            padding: 4,
                        }),
                    ],
                };
            if (this.targetEl && this.currentEl) {
                computePosition(this.targetEl, this.currentEl, computeObj).then(({ x, y, placement, middlewareData }) => {
                    var _a;
                    if (!(this.currentEl instanceof HTMLElement)) {
                        return;
                    }
                    Object.assign(this.currentEl.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                    // Accessing the arrow x and y position.
                    const { x: arrowX, y: arrowY } = ((_a = middlewareData.arrow) !== null && _a !== void 0 ? _a : {});
                    const staticSide = {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right",
                    }[placement.split("-")[0]];
                    Object.assign(this.arrowEl.style, {
                        left: arrowX != null ? `${arrowX}px` : "",
                        top: arrowY != null ? `${arrowY}px` : "",
                        right: "",
                        bottom: "",
                        [staticSide]: "-8px",
                    });
                });
            }
        };
        /**
         * @private
         * Handles keydown events on the document
         * @param e - The keydown event
         */
        this.handleDocumentKeydown = (e) => {
            if (!e.defaultPrevented && this.open) {
                switch (e.key) {
                    case keyTab:
                        this.handleTabKeyDown(e);
                        break;
                    case keyEscape:
                        this.hide(true);
                        break;
                    default:
                        return true;
                }
            }
        };
        /**
         * @private
         * Handles tab keydown events
         * @param e - The keydown event
         */
        this.handleTabKeyDown = (e) => {
            if (!this.trapFocus || !this.open) {
                return;
            }
            const bounds = this.getTabQueueBounds();
            if (bounds.length === 1) {
                bounds[0].focus();
                e.preventDefault();
                return;
            }
            if (e.shiftKey && e.target === bounds[0]) {
                bounds[bounds.length - 1].focus();
                e.preventDefault();
            }
            else if (!e.shiftKey && e.target === bounds[bounds.length - 1]) {
                bounds[0].focus();
                e.preventDefault();
            }
            return;
        };
        /**
         * @private
         * Gets the bounds of the tab queue
         * @returns (HTMLElement | SVGElement)[]
         */
        this.getTabQueueBounds = () => {
            const bounds = [];
            return TeachingBubble.reduceTabbableItems(bounds, this);
        };
        /**
         * @private
         * Updates the state of focus trapping
         * @param shouldTrapFocusOverride - Optional override for whether focus should be trapped
         */
        this.updateTrapFocus = (shouldTrapFocusOverride) => {
            const shouldTrapFocus = shouldTrapFocusOverride === undefined
                ? this.shouldTrapFocus()
                : shouldTrapFocusOverride;
            if (shouldTrapFocus && !this.isTrappingFocus) {
                this.isTrappingFocus = true;
                // Add an event listener for focusin events if we are trapping focus
                document.addEventListener("focusin", this.handleDocumentFocus);
                Updates.enqueue(() => {
                    if (this.shouldForceFocus(document.activeElement)) {
                        this.focusFirstElement();
                    }
                });
            }
            else if (!shouldTrapFocus && this.isTrappingFocus) {
                this.isTrappingFocus = false;
                // remove event listener if we are not trapping focus
                document.removeEventListener("focusin", this.handleDocumentFocus);
            }
        };
        /**
         * @private
         * Handles focus events on the document
         * @param e - The focus event
         */
        this.handleDocumentFocus = (e) => {
            if (!e.defaultPrevented && this.shouldForceFocus(e.target)) {
                this.focusFirstElement();
                e.preventDefault();
            }
        };
        /**
         * @private
         * Focuses the first element in the tab queue
         */
        this.focusFirstElement = () => {
            const bounds = this.getTabQueueBounds();
            const teachingBubbleAllEls = document.getElementsByTagName("hwc-teaching-bubble");
            let disableFocus = 0;
            Array.from(teachingBubbleAllEls).forEach((el) => {
                if (true === el.hasAttribute("open")) {
                    disableFocus++;
                }
            });
            // If more than one hwc-tabbable element present, then disable first focus.
            if (disableFocus > 1) {
                return;
            }
            if (bounds.length > 0) {
                bounds[0].focus();
            }
            else {
                if (this.currentEl instanceof HTMLElement) {
                    this.currentEl.focus();
                }
            }
        };
        /**
         * @private
         * Determines if focus should be forced
         * @param currentFocusElement - The currently focused element
         * @returns boolean
         */
        this.shouldForceFocus = (currentFocusElement) => {
            return this.isTrappingFocus && !this.contains(currentFocusElement);
        };
        /**
         * @private
         * Determines if focus should be trapped
         * @returns boolean
         */
        this.shouldTrapFocus = () => {
            return this.trapFocus && this.open;
        };
    }
    /**
     * @public
     * Method gets called when the component is inserted into the document.
     */
    connectedCallback() {
        super.connectedCallback();
        this.renderPromise.then(() => {
            this.setElements();
            this.initializePosition();
            document.addEventListener("keydown", this.handleDocumentKeydown);
            Updates.enqueue(() => {
                this.updateTrapFocus();
                this.disableTrapFocusHandler();
            });
        });
        this.renderResolver();
    }
    /**
     * @public
     * Method to perform cleanup tasks.
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        // Remove the keydown event listener.
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        document.removeEventListener("focusin", this.handleDocumentFocus);
        this.updateTrapFocus(false);
        if (this.cleanAutoUpdate) {
            this.cleanAutoUpdate();
        }
        this.targetEl = null;
        this.currentEl = null;
        this.arrowEl = null;
    }
    /**
     * @public
     * Method called when the 'open' attribute changes.
     */
    openChanged() {
        this.initializePosition();
        Updates.enqueue(() => {
            this.updateTrapFocus();
            this.disableTrapFocusHandler();
        });
        this.$emit("openchange", this.open);
    }
    /**
     * @private
     * Reduces the list of tabbable items
     * @param elements - The current list of elements
     * @param element - The element to consider adding to the list
     * @returns HTMLElement[]
     */
    static reduceTabbableItems(elements, element) {
        if (element.getAttribute("tabindex") === "-1") {
            return elements;
        }
        if (isTabbable(element) ||
            (TeachingBubble.isFocusableFastElement(element) &&
                TeachingBubble.hasTabbableShadow(element))) {
            elements.push(element);
            return elements;
        }
        return Array.from(element.children).reduce((elements, currentElement) => TeachingBubble.reduceTabbableItems(elements, currentElement), elements);
    }
    /**
     * @private
     * Determines if an element is a focusable FASTElement
     * @param element - The element to check
     * @returns boolean
     */
    static isFocusableFastElement(element) {
        var _a, _b;
        return !!((_b = (_a = element.$fastController) === null || _a === void 0 ? void 0 : _a.definition.shadowOptions) === null || _b === void 0 ? void 0 : _b.delegatesFocus);
    }
    /**
     * @private
     * Determines if an element has a tabbable shadow
     * @param element - The element to check
     * @returns boolean
     */
    static hasTabbableShadow(element) {
        var _a, _b;
        return Array.from((_b = (_a = element.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll("*")) !== null && _b !== void 0 ? _b : []).some((x) => {
            return isTabbable(x);
        });
    }
    /**
     * @private
     * Method to check if attribute 'disable-trap-focus' is present or not.
     */
    disableTrapFocusHandler() {
        if (this.disableTrapFocus) {
            this.trapFocus = false;
        }
        else {
            this.trapFocus = true;
        }
    }
    /**
     * @private
     * Method to initialize the position of bubble.
     */
    initializePosition() {
        this.open && this.targetEl && this.currentEl && this.arrowEl && this.show();
        this.open || this.hide();
    }
}
__decorate([
    attr({ mode: "fromView" })
], TeachingBubble.prototype, "target", void 0);
__decorate([
    attr({ mode: "fromView" })
], TeachingBubble.prototype, "placement", void 0);
__decorate([
    attr({ mode: "boolean" })
], TeachingBubble.prototype, "open", void 0);
__decorate([
    attr({ mode: "boolean", attribute: "disable-trap-focus" })
], TeachingBubble.prototype, "disableTrapFocus", void 0);
__decorate([
    attr({ mode: "fromView" })
], TeachingBubble.prototype, "size", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "targetEl", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "currentEl", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "arrowEl", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "isTrappingFocus", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "trapFocus", void 0);
__decorate([
    observable
], TeachingBubble.prototype, "cleanAutoUpdate", void 0);
//# sourceMappingURL=teaching-bubble.js.map